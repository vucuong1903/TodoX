const authMe = async (req, res) => {
   try {
      const user = req.user;
      return res.status(200).json({ user });
   } catch (error) {
      console.error("❌ Error call authMe:", error.message);
      return res.status(500).json({ message: "Lỗi hệ thống" });
   }
};
const test = async (req, res) => {
   return res.sendStatus(204)
}
export default { authMe, test };
