const axios = require("axios");

async function getUser(userID) {
  try {
    const reply = await axios.get(`http://localhost:8080/usuarios/${userID}`);
    return reply.data;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = getUser;
