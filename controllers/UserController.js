const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

//gerador de token
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "7d", // vence em 7 dias
  });
};

const register = async (req, res) => {
  res.send("Registro");
};

module.exports = {
  register,
};
