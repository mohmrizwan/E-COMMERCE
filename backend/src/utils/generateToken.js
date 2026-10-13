import jwt from "jsonwebtoken";
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      tokenVersion: user.tokenVersion || 0,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
};
export default generateToken;
