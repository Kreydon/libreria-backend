const mongoose = require("mongoose");

const booksSchema = new mongoose.Schema(
  {
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true, minlength: 1, maxlength: 100 },
    price: { type: mongoose.Types.Decimal128, required: true, min: 0 },
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
