import { check, validationResult } from "express-validator";
const userValidator = [
  check("name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Name is missing")
    .isLength({ min: 3, max: 20 })
    .withMessage("Invalid Name, Name should be  3 to 20 characters long !"),

  check("email").normalizeEmail().isEmail().withMessage("Email is Invalid"),

  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is missing")
    .isLength({ min: 4, max: 20 })
    .withMessage("Invalid Name, Name should be  3 to 20 characters long !"),
];

const validate = (req, res, next) => {
  const error = validationResult(req).array();
  if (!error.length) return next();
  res.status(401).json({ success: false, error: error[0].msg });
};

export { userValidator, validate };
