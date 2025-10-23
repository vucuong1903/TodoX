import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protectedRoute = async (req, res, next) => {
   try {
      //lấy token từ header
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      if (!token) {
         return res.status(401).json({ message: "Thiếu token xác thực" });
      }

      //xác nhận token hợp lệ
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
         if (err) {
            console.error("❌ Token verification error:", err.message);
            return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
         }

         //tìm user
         const user = await User.findById(decoded.userId).select("-hashedPassword");
         if (!user) {
            return res.status(404).json({ message: "User không tồn tại" });
         }

         //trả user cho req
         req.user = user;
         next();
      });
   } catch (error) {
      console.error("❌ Error in authMiddleware:", error.message);
      return res.status(500).json({ message: "Lỗi hệ thống" });
   }
};

export default protectedRoute;
