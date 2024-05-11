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

async function readUserIDController(inputData) {
  const userResult = await readUserIDAction(inputData);
  if (!userResult || userResult.isActive === false) {
    throw new Error("User not found");
  }
  return userResult;
}

async function readUsersController() {
  const result = await readUsersAction();
  if (result === null) {
    throw new Error("No se encontraron usuarios");
  }

  return result;
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

async function updateUserController(updateData, authToken) {
  const tokenDetails = jwt.verify(authToken, process.env.SECRET_KEY);
  const userIdentifier = tokenDetails._id;
  const currentUserInfo = await readUserIDAction(userIdentifier);

  if (!currentUserInfo || !currentUserInfo.isActive) {
    throw new Error("Cannot locate active user");
  }

  // Verificar que no se intenten cambiar la cédula, el email o la contraseña
  if (updateData.cedula || updateData.email || updateData.password) {
    throw new Error("Modification of cedula, email, or password isn't allowed");
  }

  const updatedUserInfo = await updateUserAction(userIdentifier, updateData);

  return updatedUserInfo;
}

async function deleteUserController(userIdentifier, authToken) {
  const verifiedToken = jwt.verify(authToken, process.env.SECRET_KEY);
  const loggedInUserId = verifiedToken._id;

  // Verificar si el ID del usuario en el token coincide con el ID proporcionado
  if (loggedInUserId !== userIdentifier) {
    throw new Error("Unable to locate user or permission denied for deletion");
  }

  // Confirmar que el usuario exista y esté activo
  const activeUser = await readUserIDAction(loggedInUserId);

  if (!activeUser || !activeUser.isActive) {
    throw new Error("No active user found or user has been previously removed");
  }

  // Proceso para eliminar el usuario
  const result = await deleteUserAction(userIdentifier);

  return result;
}

module.exports = {
  readUserIDController,
  readUsersController,
  createUserController,
  updateUserController,
  deleteUserController,
};
