const mongoose = require("mongoose");
const argon2 = require("argon2");

const usersSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cedula: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

usersSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await argon2.hash(this.password);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", usersSchema);

module.exports = User;
