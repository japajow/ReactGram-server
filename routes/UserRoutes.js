const express = require("express");
const router = express.Router();

// funções do controller
const {
  register,
  login,
  getCurrentUser,
  update,
} = require("../controllers/UserController");

//Middleware
const validate = require("../middlewares/handleValidation");
const {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
} = require("../middlewares/useValidations");
const authGuard = require("../middlewares/authguard");
const { imageUpload } = require("../middlewares/imageupload");

//rotas
router.post("/register", userCreateValidation(), validate, register);
router.post("/login", loginValidation(), validate, login);
router.get("/profile", authGuard, getCurrentUser);
router.put(
  "/",
  authGuard,
  userUpdateValidation(),
  validate,
  imageUpload.single("profileImage"),
  update
);

module.exports = router;
