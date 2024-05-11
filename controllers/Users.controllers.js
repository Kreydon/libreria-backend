const jwt = require("jsonwebtoken");
const dotend = require("dotenv");
dotend.config();

const {
  readUserIDAction,
  readUsersAction,
  verifyUsersAction,
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
  // Verifica si ya existe un usuario activo con la misma cédula
  const isActiveUserExists = await verifyUsersAction(data.cedula);

  if (isActiveUserExists) {
    throw new Error("The user already exists.");
  }

  // Si no existe, procede a crear el nuevo usuario
  const newUser = await createUserAction(data);
  return newUser;
}

async function updateUserController(data, token) {
  const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  const userID = decodedToken._id;
  const userInfo = await readUserIDAction(userID);

  if (!userInfo || !userInfo.isActive) {
    throw new Error("User not found");
  }
  const update = await updateUserAction(userID, data);

  return update;
}

async function deleteUserController(data, token) {
  const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  const userID = decodedToken._id;
  if (userID !== data) {
    throw new Error(
      "User not found or don't have permisson to delete the user"
    );
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
