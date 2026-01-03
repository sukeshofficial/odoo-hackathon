const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/auth.controller");

const router = express.Router();
const upload = require("../middleware/upload.middleware");

router.post(
  "/register",
  upload.single("profilePhoto"),
  authController.register
);

router.post(
  "/register",
  [
    body("firstName").notEmpty(),
    body("lastName").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 })
  ],
  authController.register
);

router.post("/login", authController.login);

router.get("/user-by-email", authController.getUserByEmail);

module.exports = router;
