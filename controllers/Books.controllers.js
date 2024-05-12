const jwt = require("jsonwebtoken");
const dotend = require("dotenv");
dotend.config();
const {
  readBookIDAction,
  readBooksAction,
  createBookAction,
  updateBookAction,
  deleteBookAction,
} = require("../actions/Books.actions");
const _ = require("lodash");

async function readBookIDController(bookId) {
  const bookResult = await readBookIDAction(bookId);
  if (!bookResult || !bookResult.isActive) {
    throw new Error("No active book found with provided ID");
  }
  return bookResult;
}

async function readBooksController(queryParams) {
  const foundBooks = await readBooksAction(queryParams);
  if (foundBooks.length === 0) {
    throw new Error("No books available with the given criteria");
  }
  return foundBooks;
}

async function createBookController(bookData, authToken) {
  const verifiedToken = jwt.verify(authToken, process.env.SECRET_KEY);
  const userID = verifiedToken._id;
  const newBook = await createBookAction(userID, bookData);
  return newBook;
}

async function updateBookController(bookID, updateData, authenticationToken) {
  const verifiedToken = jwt.verify(authenticationToken, process.env.SECRET_KEY);
  const authorID = verifiedToken._id;
  const existingBookDetails = await readBookIDController(bookID);

  if (_.toString(existingBookDetails.userID) !== authorID) {
    throw new Error("Unauthorized: You cannot update this book.");
  }
  const updatedBook = await updateBookAction(existingBookDetails, updateData);
  return updatedBook;
}

async function deleteBookController(bookID, authenticationToken) {
  const verifiedToken = jwt.verify(authenticationToken, process.env.SECRET_KEY);
  const userIdentifier = verifiedToken._id;
  const bookDetails = await readBookIDController(bookID);

  if (!_.isEqual(userIdentifier, bookDetails.userID.toString())) {
    throw new Error("Permission denied to delete this book");
  }
  if (!bookDetails.isActive) {
    throw new Error("This book has already been deleted");
  }
  const deletionResult = await deleteBookAction(bookID);
  return deletionResult;
}

module.exports = {
  readBookIDController,
  readBooksController,
  createBookController,
  updateBookController,
  deleteBookController,
};
