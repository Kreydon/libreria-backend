const getUser = require("../actions/Auth.actions");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

async function login(data) {
  const validation = await getUser(data.email);
  console.log("🚀 ~ login ~ validation:", validation);
  if (
    validation.email === data.email &&
    (await passValidate(data.password, validation.password))
  ) {
    const token = jwt.sign(
      { _id: validation._id, email: data.email, cedula: validation.cedula },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    return {
      token: token,
      email: data.email,
      cedula: validation.cedula,
      _id: validation._id,
    };
  } else {
    throw new Error("Usuario o contraseña incorrectos");
  }
}
async function passValidate(pass, hash) {
  return await argon2.verify(hash, pass);
}

module.exports = { login };
