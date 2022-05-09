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

//removendo a photo no db

const deletePhoto = async (req, res) => {
  //pegamos o id da photo pela URL
  const { id } = req.params;
  //pegamos o usuario pela requisição
  const reqUser = req.user;

  try {
    //pegamos a foto
    const photo = await Photo.findById(mongoose.Types.ObjectId(id));

    // Verificamos se a foto existe

    if (!photo) {
      res.status(404).json({ errors: ["Foto nao encontrada!"] });
      return;
    }

    // Verificamos se a foto pertence ao usuario
    if (!photo.userId.equals(reqUser._id)) {
      res.status(422).json({
        errors: ["Ocorreu um erro, por favor tente novamente mais tarde."],
      });
    }

    // Caso chegar ate aqui deletamos a foto
    await Photo.findByIdAndDelete(photo._id);

    res
      .status(200)
      .json({ id: photo._id, message: "Foto excluída com sucesso!" });
  } catch (error) {
    res.status(404).json({ errors: ["Foto nao encontrada!"] });
  }
};

//Pegando todas as fotos existente no bd
const getAllPhotos = async (req, res) => {
  const photos = await Photo.find({})
    .sort([["createdAt", -1]])
    .exec();
  return res.status(200).json(photos);
};

module.exports = { insertPhoto, deletePhoto, getAllPhotos };
