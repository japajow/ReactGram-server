const express = require("express");
const router = express.Router();

// funções do controller
const { register } = require("../controllers/UserController");

//Middleware
const validate = require("../middlewares/handleValidation");

//rotas
router.post("/register", validate, register);
console.log(register);

module.exports = router;
