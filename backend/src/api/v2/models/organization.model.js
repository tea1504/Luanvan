require("dotenv").config();
var mongoose = require("mongoose");
var databaseConfig = require("../../../config/database.config");

mongoose.connect(databaseConfig.v2.path);

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Bạn phải nhập tên tổ chức"],
      maxLength: [200, "Tên quá dài"],
    },
    code: {
      type: String,
      required: [true, "Bạn phải nhập mã tổ chức"],
      maxLength: [10, "Mã quá dài"],
      unique: [true, "Mã bị trùng"],
    },
    email: {
      type: String,
      required: [true, "Bạn phải nhập email"],
      unique: [true, "Email bị trùng"],
      maxLength: [200, "Email quá dài"],
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Email không hợp lệ"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Bạn phải nhập email"],
      unique: [true, "Số diện thoại bị trùng"],
      maxLength: [10, "Số diện thoại không hợp lệ"],
      match: [
        /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
        "Số diện thoại không hợp lệ",
      ],
    },
    organ: {
      type: mongoose.ObjectId,
      ref: "organizations",
    },
  },
  { collection: "organizations", timestamps: true }
);

module.exports = mongoose.model("organizations", organizationSchema);
