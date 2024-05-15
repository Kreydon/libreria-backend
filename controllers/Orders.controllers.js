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
  filterOrdersByDateAction,
  filterOrdersByStateAction,
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

async function filterOrdersByDateController(startDate, endDate) {
  const orders = await filterOrdersByDateAction(startDate, endDate);
  if (orders.length === 0) {
    throw new Error("No orders found within the given date range");
  }
  return orders;
}

async function filterOrdersByStateController(state) {
  const orders = await filterOrdersByStateAction(state);
  if (orders.length === 0) {
    throw new Error("No orders found with the specified state");
  }
  return orders;
}

async function readOrdersController() {
  const orders = await readOrdersAction();
  return orders;
}

async function createOrderController(data, token) {
  const verifiedToken = jwt.verify(token, process.env.SECRET_KEY);
  const userID = verifiedToken._id;
  const booksPromise = data.libros.map((book) => readBookIDController(book));
  const books = await Promise.all(booksPromise);

  const total = books.reduce((acum, book) => acum + book.price, 0);
  const newOrder = await createOrderAction(userID, total, data.books);
  return newOrder;
}

async function updateCancel(orderInfo, orderID, data) {
  if (orderInfo.state === "cancel" && data === "cancel") {
    throw new Error("This order has already been cancel");
  }

  const update = await updateOrderAction(orderID, data);
  return update;
}

async function updateOrderController(orderId, updateData, authenticationToken) {
  const tokenDetails = jwt.verify(authenticationToken, process.env.SECRET_KEY);
  const orderUser = tokenDetails._id;
  const orderDetails = await readOrderIDAction(orderId);

  if (
    _.toString(orderDetails.userID) === orderUser &&
    updateData.state === "cancel"
  ) {
    if (orderDetails.state === "cancel") {
      throw new Error("This order is already canceled");
    }
    return updateCancel(orderDetails, orderId, updateData);
  }

  const bookIds = orderDetails.books.map((book) => book.bookID);
  const bookFetchPromises = bookIds.map((id) => readBookIDController(id));
  const retrievedBooks = await Promise.all(bookFetchPromises);

  const activeBooks = retrievedBooks.filter((book) => book.isActive);
  if (activeBooks.length !== bookIds.length) {
    throw new Error("One or more books are no longer available");
  }

  const userOwnedBooks = retrievedBooks.filter(
    (book) => _.toString(book.userID) === orderUser
  );
  if (userOwnedBooks.length !== bookIds.length) {
    throw new Error("You don't own one or more of these books");
  }

  const updateResult = await updateOrderAction(orderId, updateData);
  for (const book of retrievedBooks) {
    console.log(book);
    await updateBookController(
      book._id,
      { isActive: false },
      authenticationToken
    );
  }
  return updateResult;
}

async function deleteOrderController(orderID, token) {
  const verifiedToken = jwt.verify(token, process.env.SECRET_KEY);
  const requestorId = verifiedToken._id;
  const orderDetails = await readOrderIDController(orderID);

  if (!orderDetails) {
    throw new Error("Order does not exist");
  }
  if (_.toString(orderDetails.userID) !== requestorId) {
    throw new Error("Unauthorized to delete this order");
  }
  const result = await deleteOrderAction(orderID);
  return result;
}

module.exports = {
  readOrderIDController,
  filterOrdersByDateController,
  filterOrdersByStateController,
  readOrdersController,
  createOrderController,
  updateOrderController,
  deleteOrderController,
};
