const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const authService = require("../services/auth.service");

const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      city,
      country,
      additionalInfo,
      password,
    } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await authService.findUserByEmailOrUsername(email);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const profilePhotoPath = req.file ? `/uploads/${req.file.filename}` : null;

    const user = await authService.createUser({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      city,
      country,
      additional_info: additionalInfo,
      password_hash,
      profile_photo: profilePhotoPath,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        profilePhoto: user.profile_photo,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = await authService.findUserByEmailOrUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ FIX: check password_hash BEFORE bcrypt.compare
    if (!user.password_hash) {
      return res.status(400).json({
        message: "Password not set for this user. Please reset your password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await authService.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // SAFE RESPONSE (no password, no hash)
    res.status(200).json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      profilePhoto: user.profile_photo,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login, getUserByEmail };
