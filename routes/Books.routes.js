const express = require("express");
const router = express.Router();
const {
  readBookIDController,
  readBooksByGenreController,
  readBooksByPublicationDateController,
  readBooksByEditorialController,
  readBooksByAuthorController,
  readBooksByNameController,
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

async function getBooksByGenreRoute(req, res) {
  try {
    const books = await readBooksByGenreController(req.query.genre);
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
}

async function getBooksByPublicationDateRoute(req, res) {
  try {
    const books = await readBooksByPublicationDateController(
      req.query.publicationDate
    );
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
}

async function getBooksByEditorialRoute(req, res) {
  try {
    const books = await readBooksByEditorialController(req.query.editorial);
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
}

async function getBooksByAuthorRoute(req, res) {
  try {
    const books = await readBooksByAuthorController(req.query.author);
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
}

async function getBooksByNameRoute(req, res) {
  try {
    const books = await readBooksByNameController(req.query.name);
    res.status(200).json(books);
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
router.get("/:genre", getBooksByGenreRoute);
router.get("/:date", getBooksByPublicationDateRoute);
router.get("/:editorial", getBooksByEditorialRoute);
router.get("/:author", getBooksByAuthorRoute);
router.get("/:name", getBooksByNameRoute);
router.get("/", getBooksRoute);
router.post("/", postBooksRoute);
router.patch("/:id", patchBooksRoute);
router.delete("/:id", deleteBooksRoute);

module.exports = router;
