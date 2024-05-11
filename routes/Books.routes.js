const express = require("express");
const router = express.Router();
const {
  readBookIDController,
  readBooksController,
  createBookController,
  updateBookController,
  deleteBookController,
} = require("../controllers/Books.controllers");

async function getBookIDRoute(req, res) {
  try {
    const book = await readBookIDController(req.params.id);
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
}

async function getBooksRoute(req, res) {
  try {
    const books = await readBooksController(req.query);
    res.status(200).json({ libros: books });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
}

async function postBooksRoute(req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const book = await createBookController(req.body, token);

    if (book.modifiedCount === 0) {
      throw new Error("It wasn't possible to create the book");
    }
    res.status(200).json({ mensaje: "The book has been successfully created" });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
}

async function patchBooksRoute(req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const book = await updateBookController(req.body, token);

    if (book.modifiedCount === 0) {
      throw new Error("It wasn't possible to update the book");
    }
    res.status(200).json({ mensaje: "The book has been successfully updated" });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
}

async function deleteBooksRoute(req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const book = await deleteBookController(req.params.id, token);

    if (book.modifiedCount === 0) {
      throw new Error("It wasn't possible to delete the book");
    }
    res.status(200).json({ mensaje: "The book has been successfully deleted" });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
}

router.get("/:id", getBookIDRoute);
router.get("/", getBooksRoute);
router.post("/", postBooksRoute);
router.patch("/:id", patchBooksRoute);
router.delete("/:id", deleteBooksRoute);

module.exports = router;
