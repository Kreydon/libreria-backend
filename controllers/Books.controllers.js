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

async function readBookIDController(data) {
  const search = await readBookIDAction(data);
  if (!search || !search.isActive) {
    throw new Error("The book doesn't exist");
  }
  return search;
}

async function readBooksController(data) {
  const search = await readBooksAction(data);
  if (search.length === 0) {
    throw new Error("No books found");
  }
  return search;
}

async function createBookController(data, token) {
  const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  const userID = decodedToken._id;
  const creation = await createBookAction(userID, data);
  return creation;
}

async function updateBookController(bookID, data, token) {
  const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  const userID = decodedToken._id;
  const bookInfo = await readBookIDController(bookID);

  if (_.toString(bookInfo.userID) !== userID) {
    throw new Error("You don't have permissions to make updates to this book");
  }
  const update = await updateBookAction(bookInfo, data);
  return update;
}

async function deleteBookController(data, token) {
  const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  const userID = decodedToken._id;
  const bookInfo = await readBookIDController(data);

  if (_.isEqual(userID, bookInfo.userID.toString()) === false) {
    throw new Error("You don't have permissions to delete this book");
  }
  if (!bookInfo.isActive) {
    throw new Error("This book has already been deleted");
  }
  const deleting = await deleteBookAction(data);
  return deleting;
}

module.exports = {
  readBookIDController,
  readBooksController,
  createBookController,
  updateBookController,
  deleteBookController,
};
