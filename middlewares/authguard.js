const User = require("../models/User");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const authGuard = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  //checando se existe um token
  if (!token) return res.status(401).json({ erros: ["Acesso Negado!"] });

  //checando se o token e valido

  try {
    const verified = jwt.verify(token, jwtSecret);

    req.user = await User.findById(verified.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ erros: ["token invalido"] });
  }
};

module.exports = authGuard;
