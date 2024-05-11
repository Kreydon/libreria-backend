const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema(
  {
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    state: {
      type: String,
      enum: ["in progress", "complete", "cancel"],
      default: "in progress",
    },
    total: { type: mongoose.Types.Decimal128, required: true },
    books: [
      {
        bookID: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Order = mongoose.model("Order", ordersSchema);

module.exports = Order;
