const mongoose = require("mongoose");

const booksSchema = new mongoose.Schema(
  {
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    price: { type: mongoose.Types.Decimal128, required: true },
    genre: { type: String, required: true },
    publicationDate: { type: Date, required: true },
    editorial: { type: String, required: true },
    author: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Book = mongoose.model("Book", booksSchema);

module.exports = Book;
