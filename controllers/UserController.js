const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");

const jwtSecret = process.env.JWT_SECRET;

//gerador de token
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "7d", // vence em 7 dias
  });
};

const register = async (req, res) => {
  const { name, password, email } = req.body;

  //checamos se o urnário existe
  const user = await User.findOne({ email });
  //caso houver o usurário no registro retorna erro
  if (user) {
    res.status(422).json({ errors: ["Por favor utilize outro email"] });
  }

  //Gerando a senha em hash code
  const salt = await bcrypt.genSalt();
  // geramos uma senha com hash e passamos a passwordHash
  const passwordHash = await bcrypt.hash(password, salt);

  // Criando usuario
  const newUser = await User.create({
    name,
    email,
    password: passwordHash,
  });

  //checamos se o usuario foi gerado com sucesso retorno o token
  if (!newUser) {
    res
      .status(422)
      .json({ errors: ["Houve um erro , por favor tente mais tarde."] });
    return;
  }

  res.status(201).json({
    _id: newUser._id,
    token: generateToken(newUser._id),
  });
};

// logando o usuario
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // Checar se o nao usuario existir
  if (!user) {
    res.status(404).json({ errors: ["usuario nao existe."] });
    return;
  }

  //Checando se a senha combina com a senha do usuario
  if (!(await bcrypt.compare(password, user.password))) {
    res.status(422).json({ errors: ["Senha invalida"] });
    return;
  }

  // se deu tudo certo retorna o usuario e o token
  res.status(201).json({
    _id: user._id,
    profileImage: user.profileImage,
    token: generateToken(user._id),
  });
};

// recuperando dados do usuario logado
const getCurrentUser = async (req, res) => {
  const user = req.user;
  res.status(200).json(user);
};

//update an user

const update = async (req, res) => {
  const { name, password, bio } = req.body;

  let profileImage = null;

  if (req.file) {
    profileImage = req.file.filename;
  }

  const reqUser = req.user;
  const user = await User.findById(mongoose.Types.ObjectId(reqUser._id)).select(
    "-password"
  );

  if (name) {
    user.name = name;
  }

  if (password) {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    user.password = passwordHash;
  }

  if (profileImage) {
    user.profileImage = profileImage;
  }

  if (bio) {
    user.bio = bio;
  }

  await user.save();

  res.status(200).json(user);
};

//get user by id
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(mongoose.Types.ObjectId(id)).select(
      "-password"
    );
    if (!user) {
      res.status(404).json({ errors: ["Usuario nao encontrado"] });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ errors: ["Usuario nao existe"] });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  update,
  getUserById,
};
