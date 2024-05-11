const axios = require("axios");

async function getUser(userID) {
  console.log("🚀 ~ getUser ~ userID:", userID);
  try {
    const reply = await axios.get(`http://localhost:8080/users/${userID}`);
    return reply.data;
  } catch (error) {
    console.log(
      "Error en getUser:",
      error.response ? error.response.data : error.message
    );
    throw new Error(error.response ? error.response.data : error.message);
  }
}

module.exports = getUser;
