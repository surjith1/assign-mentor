//import { isValidObjectId } from "mongoose";
import { userSignup } from "../model/schema.js";
import { sendError } from "../utils/helper.js";
import { resetToken } from "../model/resetToken.js";
export const isResetTokenValid = async (req, res, next) => {
  const { token, id } = req.query;
  if (!token || !id) return sendError(res, "Invalid Request");
  //if (!isValidObjectId(id)) return sendError(res, "Invalid UserId");

  const user = await userSignup.findById(id);
  if (!user) return sendError(res, "User Not Found ");
  const resettoken = await resetToken.findOne({ owner: user._id });
  if (!resettoken) return sendError(res, "Reset Token Not Found ");
  const isValid = await resettoken.compareToken(token);
  if (!isValid) return sendError(res, "Reset Token is Invalid ");
  req.user = user;
  next();
};
