const Photo = require("../models/Photo");

const mongoose = require("mongoose");
const User = require("../models/User");

// Inserindo uma photo relacionado ao usuario que postou

const insertPhoto = async (req, res) => {
  const { title } = req.body;
  const image = req.file.filename;

  const reqUser = req.user;

  const user = await User.findById(reqUser._id);

  const newPhoto = await Photo.create({
    image,
    title,
    userId: user._id,
    userName: user.name,
  });

  //Verificar se foi sucesso
  if (!newPhoto) {
    res.status(422).json({
      erros: ["Houve um problema , por favor tente novamente mais tarde"],
    });
  }

  res.status(201).json(newPhoto);
};

module.exports = { insertPhoto };
