const express = require("express");
const router = express.Router();

// funções do controller
const { register } = require("../controllers/UserController");

//rotas
router.post("/register", register);
console.log(register)

module.exports = router;
