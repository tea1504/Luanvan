require("dotenv").config();
var mongoose = require("mongoose");

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("Connected Successfully"))
  .catch((err) => console.error("Not Connected"));

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    userPassword: { type: String, required: true },
    userRole: { type: Number, required: true },
  },
  { collection: "user", timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
