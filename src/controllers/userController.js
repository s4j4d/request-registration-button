const express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");
const User = require("../models/userModel");
const path = require("path");

const { sendEmailNotification } = require("./emailController");
const { log } = require("console");

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

const iranianPhoneNumberRegex = /^(?:\+98|0)?9\d{9}$/;

router.post(
  "/register",
  [
    check("email").notEmpty().isEmail().normalizeEmail(),
    check("nameAndLastName")
      .matches(/^[^0-9]+$/)
      .notEmpty()
      .isString(),
    check("phoneNumber").custom((value) => {
      if (!iranianPhoneNumberRegex.test(value)) {
        throw new Error("Invalid Iranian phone number");
      }
      return true;
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, phoneNumber, nameAndLastName, address, description } =
      req.body;

    try {
      const newUser = new User({
        email,
        phoneNumber,
        nameAndLastName,
        address,
        description,
      });
      await newUser.save();
      await sendEmailNotification({
        phoneNumber,
        nameAndLastName,
        email,
        address,
        description,
      }); //TODO uncomment this!!!!
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get("/register", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../views/index.html"));
});

module.exports = router;
