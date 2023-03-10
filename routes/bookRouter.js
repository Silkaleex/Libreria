const express = require("express");
const Book = require("../models/Book");
const BookRouter = express.Router();
const Author = require("../models/Author");

BookRouter.post("/book", async (req, res) => {
  try {
    const { title, description, authorId } = req.body;
    if (!title || !description || !authorId) {
      return res.status(400).send({
        success: false,
        message: "No has completado todos los campos",
      });
    }
    if (title.length < 3) {
      return res.status(400).send({
        success: false,
        message: "Titulo demasiado corto",
      });
    }
    if (title.length > 30) {
      return res.status(400).send({
        success: false,
        message: "Titulo demasiado largo",
      });
    }
    //creanos un nuevo libro
    let newBook = new Book({
      title,
      description,
      author: authorId,
    });
    // //despues de creal el libro y antes de guardarlo en la base de datos,
    // //busca en el modelo/coleccion de author, el author con el id que ha pasado por el req.body
    // //y si me lo encuentra, añade el id del nuevo libro creado en la propiedad book con ese autor
    await Author.findByIdAndUpdate(authorId, {
      $push: {
        books: newBook._id,
      },
    });
    // //despues de añadir el nuevo libro de author añademelo en la nueva base de datos

    await newBook.save();

    return res.status(200).send({
      success: true,
      message: "Libro creado correctamente",
      newBook,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});
BookRouter.get("/book/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let book = await Book.findById(id);
    // .select("author")
    // .populate({ path: "author", select: "name surname age" });
    if (!book) {
      return res.status(400).send({
        success: false,
        message: "Libro no encontrado",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Book found succesfully",
      book,
    });
  } catch (error) {
    return res.status(500).send({
      success: true,
      message: error.message,
    });
  }
});

//Put y Delete
//put metodo Http - modifica contenido
BookRouter.put("/book/:id", async (req, res) => {
  try {
    //pasamos parametros el id del objeto a modificar
    const { id } = req.params;
    //paso por el body las propiedades que se pueden modificar de ese libro
    const { title, description } = req.body;
    //busco el libro por el id(que he pasado en params)
    //y le paso el objeto resultante con los datos que he metido por body
    //podemos poner condiciones
    await Book.findByIdAndUpdate(id, { title, description });
    if (!title || !description) {
      return res.status(200).send({
        success: false,
        message: "Por favor completa todos los campos que quieras modificar",
      });
    }
    //devolvemos el libro modificado
    return res.status(200).send({
      success: true,
      message: "Libro modificado correctamente",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});
//delete - elimina contenido
BookRouter.delete("/book/:id", async (req, res) => {
  try {
    //pasamos por params el id del objeto a borrar
    const { id } = req.params;

    //lo buscamos en nuestra coleccion por id y lo borramos
    await Book.findByIdAndDelete(id);
    if (!id) {
      return res.status(400).send({
        success: false,
        message: "no se encontro dicho elemento",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Elemento eliminado",
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = BookRouter;
