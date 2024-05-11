const Book = require("../models/Books.models");

async function readBookIDAction(id) {
  const book = Book.findById(id);
  return book;
}

async function readBooksAction(query) {
  const books = Book.find(query);
  return books;
}
async function createBookAction(userID, book) {
  const libroCreado = Book.create({ ...book, userID: userID });
  return libroCreado;
}

async function updateBookAction(bookInfo, data) {
  const currentBook = Book.updateOne({ _id: bookInfo._id }, data);
  return currentBook;
}

async function deleteBookAction(id) {
  const deletedBook = Book.updateOne({ _id: id }, { isActive: false });
  return deletedBook;
}

module.exports = {
  readBookIDAction,
  readBooksAction,
  createBookAction,
  updateBookAction,
  deleteBookAction,
};
