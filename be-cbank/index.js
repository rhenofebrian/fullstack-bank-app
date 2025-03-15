require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/index.route");
const adminRoutes = require("./routes/admin.route");
const mongoose = require("mongoose");

const { API_PORT, MONGO_URL } = process.env;

const app = express();
const PORT = API_PORT;

app.use(express.json());
app.use(cors());

mongoose.connect(MONGO_URL).catch((err) => {
  if (err) {
    console.log("can't connect to mongodb!");
    throw err;
  }
});

app.use("/admin", adminRoutes);
app.use(userRoutes);

app.listen(PORT, () => {
  console.log("server api is working on port " + PORT);
});

module.exports = app;
