import { userSignup } from "../model/schema.js";
import { verificationToken } from "../model/verificationToken.js";
//import { resetToken } from "../model/resetToken.js";
import { createRandomBytes, sendError } from "./../utils/helper.js";
import jwt from "jsonwebtoken";
import env from "dotenv";
import {
  generateOTP,
  mailTransport,
  generateEmailTemplate,
  plainEmailTemplate,
  generatePasswordResetTemplate,
} from "./../utils/mail.js";
import * as mongoose from "mongoose";
import { resetToken } from "../model/resetToken.js";

env.config();
export const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await userSignup.findOne({ email });
  if (!user) {
    const newUser = new userSignup({
      name,
      email,
      password,
    });
    const OTP = generateOTP();

    const tokenVerification = new verificationToken({
      owner: newUser._id,
      token: OTP,
    });

    const tokenverify = await tokenVerification.save();
    const addUser = await newUser.save();

    mailTransport().sendMail({
      from: "emailverication@email.com",
      to: newUser.email,
      subject: "verify your email account",
      html: generateEmailTemplate(OTP),
    });

    res.send(addUser);
  } else {
    res.status(400).json({ success: false, error: "Email is already exist" });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email.trim() || !password.trim())
    return res.status(401).send({ error: "Email / Password missing !" });
  const user = await userSignup.findOne({ email });
  if (!user) return sendError(res, "User Not Found");
  const isMatched = await user.comparePassword(password);
  if (!isMatched) return sendError(res, "Email / Password Does not Matched !");

  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });
  res.json({
    success: true,
    user: {
      name: user.name,
      email: user.email,
      id: user._id,
      token: token,
    },
  });
};

export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;
  if (!userId || !otp.trim())
    return sendError(res, "Invalid request missing parameter");
  //if (!isValidObjectId(userId)) return sendError(res, "Invalid User Id");
  //if (!isValidObjectId(userId)) return sendError(res, "Invalid User Id");

  const user = await userSignup.findById(userId);
  if (!user) return sendError(res, "User Not Found");
  if (user.verified) return sendError(res, "This Account is alread Verified !");

  const token = await verificationToken.findOne({ owner: user._id });
  if (!token) return sendError(res, "Sorry, User not Found !");

  const isMatched = await token.compareToken(otp);
  if (!isMatched) return sendError(res, "Please Provide the Valid Token !");

  user.verified = true;
  await verificationToken.findByIdAndDelete(token._id);
  await user.save();
  mailTransport().sendMail({
    from: "emailverication@email.com",
    to: user.email,
    subject: "Welcome Email",
    html: plainEmailTemplate(
      "Email Verified Successfully ",
      "Thanks for connecting with us"
    ),
  });
  //res.send("Your Email is Verified");
  res.json({ success: true, message: "Your Email is Verified" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return sendError(res, "Provide valid Email ");

  const user = await userSignup.findOne({ email });
  if (!user) return sendError(res, "User is not Found, Invalid Request !");

  const token = await resetToken.findOne({ owner: user._id });
  if (token)
    return sendError(
      res,
      "Only After one hour you can request for another token"
    );

  //For GENERATING RANDOM TOKENS
  const randBytes = await createRandomBytes();
  const resettoken = new resetToken({ owner: user._id, token: randBytes });
  await resettoken.save();
  mailTransport().sendMail({
    from: "security@email.com",
    to: user.email,
    subject: "Password Reset",
    html: generatePasswordResetTemplate(
      `http://localhost:3000/reset-password?token=${randBytes}&id=${user._id}`
    ),
  });
  res.send({
    success: true,
    message: "Password Reset Link is sent to your Email.",
  });
};

export const resetPassword = async (req, res) => {
  const { password } = req.body;

  const user = await userSignup.findById(req.user._id);
  if (!user) return sendError(res, "User Not Found");
  const isSamePassword = await user.comparePassword(password);
  if (isSamePassword) return sendError(res, "New Password Must be Different");
  if (password.trim().length < 8 || password.trim().length > 20)
    return sendError(res, "Password Must be 8 to 20 charactersd long !");
  user.password = password.trim();
  await user.save();
  await resetToken.findOneAndDelete({ owner: user._id });

  mailTransport().sendMail({
    from: "security@email.com",
    to: user.email,
    subject: "Password Reset Successfully",
    html: plainEmailTemplate(
      "Password reset Successfully",
      "Now you can login with new password !"
    ),
  });
  res.json({
    success: true,
    message: "Password Reset Successsfully !",
    user: {
      name: user.name,
      email: user.email,
      id: user.password,
    },
  });
};
