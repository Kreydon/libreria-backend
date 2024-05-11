const jwt = require("jsonwebtoken");
const dotend = require("dotenv");
dotend.config();

const {
  readUserIDAction,
  readUsersAction,
  createUserAction,
  updateUserAction,
  deleteUserAction,
} = require("../actions/Users.actions");

async function readUserIDController(data) {
  const search = await readUserIDAction(data);
  if (!search || !search.isActive) {
    throw new Error("User not found");
  }

  return search;
}

async function readUsersController() {
  const search = await readUsersAction();
  if (!search) {
    throw new Error("Usuarios no encontrados");
  }

  return search;
}

async function createUserController(data) {
  const cedula = data.cedula;
  const user = await readUsersAction(cedula);
  if (user && user.isActive) {
    throw new Error("This user already exists");
  }
  const creation = await createUserAction(data);

  return creation;
}

async function updateUserController(data, token) {
  const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  const userID = decodedToken.cedula;
  const userExists = await readUserIDAction(userID);
  if (!userExists || !userExists.isActive) {
    throw new Error("User not found");
  }
  const update = await updateUserAction(userID, data);

  return update;
}

async function deleteUserController(data, token) {
  const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  const userID = decodedToken.cedula;
  if (userID !== data) {
    throw new Error("User not found");
  }
  const userExists = await readUserIDAction(userID);

  if (!userExists || !userExists.isActive) {
    throw new Error("User not found or has already been deleted");
  }
  const deleting = await deleteUserAction(data);

  return deleting;
}

module.exports = {
  readUserIDController,
  readUsersController,
  createUserController,
  updateUserController,
  deleteUserController,
};
