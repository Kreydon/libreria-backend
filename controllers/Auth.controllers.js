const getUser = require("../actions/Auth.actions");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

async function login(credentials) {
  const userFound = await getUser(credentials.email);
  const isValidLogin =
    userFound.email === credentials.email &&
    (await passValidate(credentials.password, userFound.password));

  if (isValidLogin) {
    const payload = {
      _id: userFound._id,
      email: credentials.email,
      cedula: userFound.cedula,
    };

    const authToken = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    return {
      token: authToken,
      email: payload.email,
      cedula: payload.cedula,
      _id: payload._id,
    };
  } else {
    throw new Error("Incorrect user or password");
  }
}

async function passValidate(pass, hash) {
  return await argon2.verify(hash, pass);
}

module.exports = { login };
