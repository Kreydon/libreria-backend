const jwt = require("jsonwebtoken");
const dotend = require("dotenv");
dotend.config();
const _ = require("lodash");
const readBookIDController =
  require("../controllers/Books.controllers").readBookIDController;
const updateBookController =
  require("../controllers/Books.controllers").updateBookController;
const {
  readOrderIDAction,
  readOrdersAction,
  createOrderAction,
  updateOrderAction,
  deleteOrderAction,
} = require("../actions/Orders.actions");

async function readOrderIDController(data) {
  const order = await readOrderIDAction(data);
  if (!order) {
    throw new Error("Order not found");
  }
  return order;
}

async function readOrdersController() {
  const orders = await readOrdersAction();
  return orders;
}

async function createOrderController(data, token) {
  const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  const userID = decodedToken._id;
  const booksPromise = data.libros.map((book) => readBookIDController(book));
  const books = await Promise.all(booksPromise);

  const total = books.reduce((acum, book) => acum + book.price, 0);
  const creation = await createOrderAction(userID, total, data.libros);
  return creation;
}

async function updateCancel(orderInfo, orderID, data) {
  if (orderInfo.estado === "cancel" && data === "cancel") {
    throw new Error("This order has already been cancel");
  }

  const update = await updateOrderAction(orderID, data);
  return update;
}

async function updateOrderController(orderID, data, token) {
  const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  const userID = decodedToken._id;
  const orderInfo = await readOrderIDAction(orderID);

  if (_.toString(orderInfo.userID) === userID && data.state === "cancel") {
    if (orderInfo.state === "cancel") {
      throw new Error("The cancellation of this order has already been made.");
    }
    return updateCancel(orderInfo, orderID, data);
  }

  const bookID = orderInfo.books.map((book) => book.bookID);
  const booksPromise = bookID.map((book) => readBookIDController(book));
  const books = await Promise.all(booksPromise);

  const currentBooks = books.filter((book) => book.isActive);
  if (currentBooks.length !== bookID.length) {
    throw new Error("Some books have already been sold");
  }

  const usersBooks = books.filter((book) => _.toString(book.userID) === userID);
  if (usersBooks.length !== bookID.length) {
    throw new Error(
      "Cannot be updated because there are books that do not belong to you"
    );
  }

  const update = await updateOrderAction(orderID, data);
  for (const book of books) {
    console.log(book);
    await updateBookController(book._id, { isActive: false }, token);
  }
  return update;
}

async function deleteOrderController(orderID, token) {
  const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  const userID = decodedToken._id;
  const orderInfo = await readOrderIDController(orderID);

  if (!orderInfo) {
    throw new Error("Order not found");
  }
  if (_.toString(orderInfo.userID) !== userID) {
    throw new Error("You don't have permission to delete the order");
  }
  const deleting = await deleteOrderAction(orderID);
  return deleting;
}

module.exports = {
  readOrderIDController,
  readOrdersController,
  createOrderController,
  updateOrderController,
  deleteOrderController,
};
