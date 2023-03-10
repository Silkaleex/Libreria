const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    direction: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    //relacion de modelos entre si, donde todos los modelos donde lo utilizamos
    books: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Book",
      },
    ],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Author", authorSchema);
