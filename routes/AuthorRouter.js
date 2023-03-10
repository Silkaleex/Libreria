const express = require("express");
const Author = require("../models/Author");
const AuthorRouter = express.Router();

//crear un autor
AuthorRouter.post("/author", async (req, res) => {
  try {
    const { name, surname, direction, age } = req.body;
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Por favor introduce tu nombre",
      });
    }
    if (!surname) {
      return res.status(400).send({
        success: false,
        message: "Por favor introduce tu Apellido",
      });
    }
    if (!direction) {
      return res.status(400).send({
        success: false,
        message: "Por favor introduce tu Direccion",
      });
    }
    if (!age) {
      return res.status(400).send({
        success: false,
        message: "Por favor introduce tu Edad",
      });
    }
    let newAuthor = new Author({
      name,
      surname,
      direction,
      age,
    });

    newAuthor.save();

    return res.status(201).send({
      success: true,
      message: "Autor creado correctamente",
      newAuthor,
    });
  } catch (error) {
    return res.status(500).send({
      sucess: false,
      message: error.message,
    });
  }
});

AuthorRouter.get("/author/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let author = await Author.findById(id).populate({
      path: "books",
      select: "title description",
    });
    if (!author) {
      return res.status(400).send({
        sucess: false,
        message: "Author no enontrado",
      });
    }
    return res.status(400).send({
      sucess: false,
      message: "Author found succesfully",
      author,
    });
  } catch (error) {
    return res.status(400).send({
      sucess: false,
      message: error.message,
    });
  }
});

module.exports = AuthorRouter;
