const { body } = require("express-validator");

const userCreateValidation = () => {
  return [
    body("name")
      .isString()
      .withMessage("O nome e obrigatório")
      .isLength({ min: 3 })
      .withMessage("O nome precisa ter no mínimo 3 caracteres"),
    body("email")
      .isString()
      .withMessage("O e-mail e obrigatório")
      .isEmail()
      .withMessage("Insira um e-mail valido."),
    body("password")
      .isString()
      .withMessage("A senha e obrigatória")
      .isLength({ min: 5 })
      .withMessage("A senha precisa ter no mínimo 5 caracteres "),
    body("confirmpassword")
      .isString("A confirmação de senha e obrigatória")
      .custom((value, { req }) => {
        if (value != req.body.password) {
          throw new Error("As senhas nao sao iguais.");
        }
        return true;
      }),
  ];
};

module.exports = {
  userCreateValidation,
};
