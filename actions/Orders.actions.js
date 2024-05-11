const Order = require("../models/Orders.models");

async function readOrderIDAction(data) {
  const order = await Order.findOne({ _id: data }).lean();
  return order;
}

async function readOrdersAction() {
  const orders = await Order.find();
  return orders;
}

async function createOrderAction(userID, value, books) {
  const booksFormat = books.map((book) => ({ idLibro: book }));

  const orderCreated = await Order.create({
    userID: userID,
    total: value,
    books: booksFormat,
  });
  return orderCreated;
}

async function updateOrderAction(orderID, data) {
  const currentOrder = await Order.updateOne({ _id: orderID }, data);
  return currentOrder;
}

async function deleteOrderAction(orderID) {
  const deletedOrder = await Order.updateOne(
    { _id: orderID },
    { isActive: false }
  );
  return deletedOrder;
}

module.exports = {
  readOrderIDAction,
  readOrdersAction,
  createOrderAction,
  updateOrderAction,
  deleteOrderAction,
};
