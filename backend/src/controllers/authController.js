import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Sesstion from "../models/Sesstion.js";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;
const signUp = async (req, res) => {
   try {
      const { username, password, email, firstName, lastName } = req.body;

      if (!username || !password || !email || !firstName || !lastName) {
         return res
            .status(400)
            .json({ message: "Không thể thiếu username, password, email, firstName, lastName" });
      }

      // Kiểm tra user đã tồn tại chưa
      const duplicate = await User.findOne({ $or: [{ username }, { email }] });
      if (duplicate) {
         return res.status(409).json({ message: "Username or email already exists" });
      }

      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);

      // Tạo user mới
      await User.create({
         username,
         hashedPassword,
         email,
         displayName: `${firstName} ${lastName}`,
      });
      return res.sendStatus(204);
   } catch (error) {
      console.error("❌ Error call signUp:", error.message);
      return res.status(500).json({ message: "Lỗi hệ thống" });
   }
};

const signIn = async (req, res) => {
   try {
      //lấy inputs
      const { username, password } = req.body;
      if (!username || !password) {
         return res.status(400).json({ message: "Thiếu username hoặc password" });
      }

      //lấy hashedPassword từ db để so sánh
      const user = await User.findOne({ username });
      if (!user) {
         return res.status(401).json({ message: "Sai username hoặc password" });
      }

      //kiểm tra password
      const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);
      if (!passwordCorrect) {
         return res.status(401).json({ message: "Sai username hoặc password" });
      }

      //tạo jwt token
      const accessToken = jwt.sign(
         {
            userId: user._id,
         },
         process.env.ACCESS_TOKEN_SECRET,
         { expiresIn: ACCESS_TOKEN_TTL }
      );

      // tạo refresh token
      const refreshToken = crypto.randomBytes(64).toString("hex");

      // tạo session lưu refresh token vào db
      await Sesstion.create({
         userId: user._id,
         refreshToken,
         expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
      });

      // trả refreshToken về trong cookie
      res.cookie("refreshToken", refreshToken, {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "strict",
         maxAge: REFRESH_TOKEN_TTL,
      });

      // trả accessToken về trong res
      return res.status(200).json({
         message: `User ${user.displayName} đã logged in!`,
         accessToken,
      });
   } catch (error) {
      console.error("❌ Error call signIn:", error.message);
      return res.status(500).json({ message: "Lỗi hệ thống" });
   }
};

const signOut = async (req, res) => {
   try {
      //lấy refreshToken từ cookie
      const token = req.cookies?.refreshToken;
      if (token) {
         await Sesstion.deleteOne({ refreshToken: token });
         res.clearCookie("refreshToken");
      }

      return res.sendStatus(204);
   } catch (error) {
      console.error("❌ Error call signOut:", error.message);
      return res.status(500).json({ message: "Lỗi hệ thống" });
   }
};

const refreshToken = async (req, res) => {
   try {
      //Lấy refreshToken từ cookie
      const token = req.cookies?.refreshToken;
      if (!token) {
         return res.status(401).json({ message: "Token không tồn tại" });
      }

      //so sanh refreshToken trong db
      const session = await Sesstion.findOne({ refreshToken: token });
      if (!session) {
         return res.status(403).json({ message: "Token không hợp lệ" });
      }

      //kiểm tra hết hạn chưa
      if (session.expiresAt < new Date()) {
         return res.status(403).json({ message: "Token đã hết hạn" });
      }

      //tạo access token mới
      const accessToken = jwt.sign(
         {
            userId: session.userId,
         },
         process.env.ACCESS_TOKEN_SECRET,
         { expiresIn: ACCESS_TOKEN_TTL }
      );

      return res.status(200).json({ accessToken });
   } catch (error) {
      console.log("Lỗi khi gọi refreshToken", error);
      return res.status(500).json({ message: "Lỗi hệ thống" });
   }
};

export default { signUp, signIn, signOut, refreshToken };
