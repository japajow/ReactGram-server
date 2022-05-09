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

//Pegando fotos especifico do usuario
const getUserPhotos = async (req, res) => {
  //pegando o id pela URL
  const { id } = req.params;

  try {
    const photos = await Photo.find({ userId: id })
      .sort([["createdAt", -1]])
      .exec();

    return res.status(200).json(photos);
  } catch (error) {
    return res.status(404).json({ errors: ["Foto nao encontrada!"] });
  }
};

// Pegando a fot pelo ID
const getPhotoById = async (req, res) => {
  try {
    // Checamos se a foto existe
    const { id } = req.params;

    const photo = await Photo.findById(mongoose.Types.ObjectId(id));

    if (!photo) {
      res.status(404).json({ errors: ["Foto nao encontrada!"] });
      return;
    }

    //Caso houver a foto
    res.status(200).json(photo);
  } catch (error) {
    res.status(404).json({ errors: ["Foto nao encontrada!"] });
    return;
  }
};

// Atualizando a foto

const updatePhoto = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const reqUser = req.user;
  const photo = await Photo.findById(id);

  // checando se a foto existe
  if (!photo) {
    res.status(404).json({ errors: ["foto nao encontrada"] });
    return;
  }

  // Verificar se a foto pertence ao usuario
  if (!photo.userId.equals(reqUser._id)) {
    res.status(422).json({
      errors: ["Ocorreu um erro , por favor tente novamente mais tarde"],
    });

    return;
  }

  //Verifica se o titulo existe
  if (title) {
    photo.title = title;
  }

  //salvamos a photo
  await photo.save(); //assim atualizamos os dados
  res.status(200).json({ photo, message: "Foto atualizada com sucesso!" });
};

// funcionalidade de comentário

const commentPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const reqUser = req.user;

    const user = await User.findById(reqUser._id);

    const photo = await Photo.findById(id);

    // checando se a foto existe
    if (!photo) {
      res.status(404).json({ errors: ["foto nao encontrada"] });
      return;
    }
    //Adicionando o comentário com arrays
    const userComment = {
      comment,
      userName: user.name,
      userImage: user.profileImage,
      userId: user._id,
    };

    //adicionamos o comentário
    await photo.comments.push(userComment);
    //atualizamos a foto com comentário
    await photo.save();

    res.status(200).json({
      comment: userComment,
      message: "O comentário foi adicionado com sucesso!",
    });
  } catch (error) {
    res.status(422).json({ errors: ["Ocorreu algum erro , tente novamente!"] });
    return;
  }
};

// funcionalidade do like

const likePhoto = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;

  const photo = await Photo.findById(id);
  if (!photo) {
    res.status(404).json({ errors: ["foto nao encontrada"] });
    return;
  }

  // verificando se o usuario ja deu um like
  if (photo.likes.includes(reqUser._id)) {
    res.status(422).json({ errors: ["Voce ja curtiu a foto"] });
    return;
  }

  // se deu tudo certo colocar o id do usuario no array
  await photo.likes.push(reqUser._id);

  photo.save();

  res.status(200).json({
    photoId: id,
    userId: reqUser._id,
    message: "A foto foi curtida",
  });
};

// funcionalidade que busca a foto

const searchPhoto = async (req, res) => {
  const { q } = req.query;

  const photos = await Photo.find({ title: new RegExp(q, "i") }).exec();

  res.status(200).json(photos);
};

module.exports = {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto,
  commentPhoto,
  likePhoto,
  searchPhoto,
};
