const express = require("express");
const router = express.Router();

// funções do controller
const { register, login } = require("../controllers/UserController");

//Middleware
const validate = require("../middlewares/handleValidation");
const {
  userCreateValidation,
  loginValidation,
} = require("../middlewares/useValidations");

//rotas
router.post("/register", userCreateValidation(), validate, register);
router.post("/login", loginValidation(), validate, login);

module.exports = router;
