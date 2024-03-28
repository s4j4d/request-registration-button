const { validationResult, check } = require("express-validator");
const User = require("../models/userModel");
const path = require("path");
const { sendEmailNotification } = require("./emailController");

const iranianPhoneNumberRegex = /^(?:\+98|0)?9\d{9}$/;

exports.validateRegistration = [
  check("email").optional().normalizeEmail(),
  check("nameAndLastName")
    .notEmpty()
    .withMessage("Name and Last Name are required")
    .matches(/^[^0-9]+$/)
    .withMessage("Name and Last Name should not contain numbers")
    .isString(),
  check("phoneNumber").custom((value) => {
    if (!value) {
      throw new Error("Phone number is required");
    }
    if (!iranianPhoneNumberRegex.test(value)) {
      throw new Error("Invalid Iranian phone number");
    }
    check("appointmentDate").isDate();
    return true;
  }),
];

exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    email,
    phoneNumber,
    nameAndLastName,
    address,
    description,
    appointmentDate,
  } = req.body;

  try {
    const newUser = new User({
      email,
      phoneNumber,
      nameAndLastName,
      address,
      description,
      appointmentDate,
    });
    await newUser.save();
    // await sendEmailNotification({
    //   phoneNumber,
    //   nameAndLastName,
    //   email,
    //   address,
    //   description,
    //   appointmentDate
    // });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getRegistrationPage = (req, res) => {
  res.sendFile(path.resolve(__dirname, "../views/index.html"));
};
