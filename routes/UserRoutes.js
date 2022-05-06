const express = require("express");
const router = express.Router();

// funções do controller
const { register } = require("../controllers/UserController");

//Middleware
const validate = require("../middlewares/handleValidation");
const { userCreateValidation } = require("../middlewares/useValidations");

//rotas
router.post("/register", userCreateValidation(), validate, register);

module.exports = router;
