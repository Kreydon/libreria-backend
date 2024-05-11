const User = require("../models/Users.models");

async function readUserIDAction(data) {
  let user;

  // Utilizamos una expresión regular simple para verificar si 'data' tiene formato de correo electrónico
  if (/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data)) {
    // Si data es un correo electrónico, realiza la búsqueda por 'cedula' o 'correo'
    user = await User.findOne({
      $or: [{ cedula: data }, { email: data }],
    }).lean();
  } else {
    // Si no es un correo electrónico, asumimos que es un ID y realizamos la búsqueda por '_id'
    user = await User.findById(data, { _id: 0 }).lean(); // Usamos 'lean' para optimizar la consulta
  }

  return user; // Devuelve el documento encontrado o 'null' si no se encuentra
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
  // Primero, verifica si el usuario existe
  const user = await User.findById(userID).lean();

  if (!user) {
    throw new Error("User not found");
  }

  // Si el usuario existe, actualiza el campo 'isActive' a false
  const result = await User.updateOne(
    { _id: userID }, // Usa '_id' directamente para referenciar al usuario
    { $set: data }
  );

  return result; // Devuelve el resultado de la operación de actualización
}

async function deleteUserAction(userID) {
  // Primero, verifica si el usuario existe
  const user = await User.findById(userID).lean();

  if (!user) {
    throw new Error("User not found");
  }

  // Si el usuario existe, actualiza el campo 'isActive' a false
  const result = await User.updateOne(
    { _id: userID }, // Usa '_id' directamente para referenciar al usuario
    { $set: { isActive: false } } // Usa '$set' para asegurar que solo se modifique 'isActive'
  );

  return result; // Devuelve el resultado de la operación de actualización
}

module.exports = {
  readUserIDAction,
  readUsersAction,
  createUserAction,
  updateUserAction,
  deleteUserAction,
};
