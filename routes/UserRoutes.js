const express = require("express");
const router = express.Router();

// funções do controller
const {
  register,
  login,
  getCurrentUser,
} = require("../controllers/UserController");

//Middleware
const validate = require("../middlewares/handleValidation");
const {
  userCreateValidation,
  loginValidation,
} = require("../middlewares/useValidations");
const authGuard = require("../middlewares/authguard");

//rotas
router.post("/register", userCreateValidation(), validate, register);
router.post("/login", loginValidation(), validate, login);
router.get("/profile", authGuard, getCurrentUser);

module.exports = router;
