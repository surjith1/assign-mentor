import express from "express";

import {
  createUser,
  forgotPassword,
  resetPassword,
  signin,
  verifyEmail,
} from "./../controllers/controller.js";
import { userValidator, validate } from "./../middlewares/validator.js";
import { isResetTokenValid } from "./../middlewares/user.js";
const router = express.Router();

router.post("/signup", userValidator, validate, createUser);

router.post("/signin", signin);

router.post("/verify-email", verifyEmail);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", isResetTokenValid, resetPassword);

router.get("/verify-token", isResetTokenValid,((req,res)=> {
  res.json({success: true})
}));

export const forgorPasswordRouter = router;
