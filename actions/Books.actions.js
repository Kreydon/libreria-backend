const Book = require("../models/Books.models");

async function readBookIDAction(id) {
  const book = Book.findById(id);
  return book;
}

async function filterBooksByGenreAction(genre) {
  const booksByGenre = await Book.find({ genre: genre });
  return booksByGenre;
}

async function filterBooksByPublicationDateAction(publicationDate) {
  const booksByDate = await Book.find({ publicationDate: publicationDate });
  return booksByDate;
}

async function filterBooksByEditorialAction(editorial) {
  const booksByEditorial = await Book.find({ editorial: editorial });
  return booksByEditorial;
}

async function filterBooksByAuthorAction(author) {
  const booksByAuthor = await Book.find({ author: author });
  return booksByAuthor;
}

async function filterBooksByNameAction(name) {
  const booksByName = await Book.find({
    name: { $regex: name, $options: "i" },
  }); // Utiliza expresión regular para búsqueda insensible a mayúsculas
  return booksByName;
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
  filterBooksByGenreAction,
  filterBooksByPublicationDateAction,
  filterBooksByEditorialAction,
  filterBooksByAuthorAction,
  filterBooksByNameAction,
  readBooksAction,
  createBookAction,
  updateBookAction,
  deleteBookAction,
};
