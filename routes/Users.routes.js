const express = require("express");
const router = express.Router();

const {
  readUserIDController,
  readUsersController,
  createUserController,
  updateUserController,
  deleteUserController,
} = require("../controllers/Users.controllers");

async function getUserIDRoute(req, res) {
  try {
    const user = await readUserIDController(req.params.id);
    res.status(200).json({ ...user });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
}

async function getUsersRoute(req, res) {
  try {
    const users = await readUsersController();
    res.status(200).json({ ...users });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
}

async function postUsersRoute(req, res) {
  try {
    const users = await createUserController(req.body);
    if (users.modifiedCount === 0) {
      throw new Error("It wasn't possible to create the user");
    }
    res.status(200).json({
      mensaje: "The user has been successfully created",
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
}

async function patchUsersRoute(req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      throw new Error("Authorization token wasn't provided");
    }
    const users = await updateUserController(req.body, token);

    if (users.modifiedCount === 0) {
      throw new Error("It wasn't possible to create the user");
    }
    res.status(200).json({ mensaje: "The user has been successfully updated" });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
}

async function deleteUsersRoute(req, res) {
  try {
    const userID = req.params.id;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      throw new Error("Authorization token wasn't provided");
    }

    if (!userID) {
      throw new Error("User ID wasn't provided");
    }
    const users = await deleteUserController(userID, token);

    if (users.modifiedCount === 0) {
      throw new Error("It wasn't possible to delete the user");
    }
    res.status(200).json({ mensaje: "The user has been successfully deleted" });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
}

router.get("/:id", getUserIDRoute);
router.get("/", getUsersRoute);
router.post("/", postUsersRoute);
router.patch("/", patchUsersRoute);
router.delete("/:id", deleteUsersRoute);

module.exports = router;
