const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Your Name"],
      maxLength: [30, "Name cannot exceed 30 character"],
      minLength: [4, "Name should have more than 4 character"],
    },
    email: {
      type: String,
      required: [true, "Please Enter Your Email"],
      unique: true,
      validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    password: {
      type: String,
      required: [true, "Please Enter Your password"],
      maxLength: [30, "password cannot exceed 30 character"],
      minLength: [8, "password should have more than 8 character"],
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    role: {
      type: String,
      default: "user",
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// JWT Token

userSchema.methods.getJWTToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// compare password

// userSchema.methods.comparePassword = async function(enteredPassword){
//         return await bcrypt.compare(enteredPassword,this.password);
// }

// Genrating password reset Token

userSchema.methods.getResetPasswordToken = function() {
  // Genrating Token

  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing  and add to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
