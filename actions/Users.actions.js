const User = require("../models/Users.models");

async function readUserIDAction(data) {
  const user = await User.findOne({
    $or: [{ cedula: data }, { email: data }],
  }).lean();
  return user;
}

async function readUsersAction() {
  const users = await User.find();
  return users;
}

async function createUserAction(data) {
  const createdUser = User.create(data);
  return createdUser;
}

async function updateUserAction(userID, data) {
  const currentUser = await User.updateOne({ cedula: userID }, data);
  return currentUser;
}

async function deleteUserAction(userID) {
  const deletedUser = await User.updateOne(
    { cedula: userID },
    { isActive: false }
  );
  return deletedUser;
}

module.exports = {
  readUserIDAction,
  readUsersAction,
  createUserAction,
  updateUserAction,
  deleteUserAction,
};
