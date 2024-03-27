const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const userController = require("./controllers/userController");

const app = express();
const port = 3000;

mongoose
  .connect("mongodb://localhost:27017/my_database")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.use(express.static("./views"));

app.use("/", userController);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
