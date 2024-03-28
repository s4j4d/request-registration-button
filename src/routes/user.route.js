const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: true }));

router.post(
  "/register",
  userController.validateRegistration,
  userController.registerUser
);
router.get("/register", userController.getRegistrationPage);

module.exports = router;
