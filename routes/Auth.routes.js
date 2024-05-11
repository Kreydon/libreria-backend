const express = require("express");
const router = express.Router();
const { login } = require("../controllers/Auth.controllers");

async function entry(req, res) {
  try {
    const users = await login(req.body);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
}

router.post("/", entry);

module.exports = router;
