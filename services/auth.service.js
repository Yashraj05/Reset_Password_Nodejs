
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import Token from "../models/Token.model.js";
import sendEmail from "../utils/email/sendEmail.js";
import { randomBytes } from "crypto";
import { hash as _hash, compare } from "bcrypt";
import dotenv from 'dotenv';
import path from "path";

dotenv.config({path:"/home/my/Desktop/forgotpassword/.env.example"});

const JWTSecret = process.env.JWT_SECRET;
const bcryptSalt = process.env.BCRYPT_SALT;
const clientURL = process.env.CLIENT_URL;

const signup = async (data) => {
  let user = await User.findOne({ email: data.email });
  if (user) {
    throw new Error("Email already exist", 422);
  }
  user = new User(data);
  const token = jwt.sign({ id: user._id }, JWTSecret);
  await user.save();

  return (data = {
    userId: user._id,
    email: user.email,
    name: user.name,
    token: token,
  });
};

const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email does not exist");

  let token = await Token.findOne({ userId: user._id });
  if (token) await token.deleteOne();

  let resetToken = randomBytes(32).toString("hex");
  const hash = await _hash(resetToken, Number(bcryptSalt));

  await new Token({
    userId: user._id,
      token: hash,
    createdAt: Date.now(),
  }).save();

  const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;
  console.log('before')
  await sendEmail(
    user.email,
    "Password Reset Request",
    link
  );
  return { link };
};

const resetPassword = async (userId, token, password) => {
  let passwordResetToken = await Token.findOne({ userId });

  if (!passwordResetToken) {
    throw new Error("Invalid  password reset token");
  }

  console.log(passwordResetToken.token, token);

  const isValid = await compare(token, passwordResetToken.token);
  console.log(isValid);

  if (!isValid) {
    throw new Error("Invalid or expired password reset token");
  }

  const hash = await _hash(password, Number(bcryptSalt));

  await User.updateOne(
    { _id: userId },
    { $set: { password: hash } },
    { new: true }
  );

  const user = await User.findById({ _id: userId });

  sendEmail(
    user.email,
    "Password Reset Successfully",
    ""
  );

  await passwordResetToken.deleteOne();

  return { message: "Password reset was successful" };
};

export {
  signup,
  requestPasswordReset,
  resetPassword,
};
