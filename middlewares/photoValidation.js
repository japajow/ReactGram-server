const { body } = require("express-validator");

const photoInsertValidation = () => {
  return [
    body("title")
      .not()
      .equals("undefined")
      .withMessage("O titulo e obrigatório")
      .isString(0)
      .withMessage("O titulo e obrigatório")
      .isLength({ min: 3 })
      .withMessage("O titulo precisa ter no mínimo 3 caracteres "),
    body("image").custom((value, { req }) => {
      if (!req.file) {
        const newLocal = "A imagem e obrigatória";
        throw new Error(newLocal);
      }

      return true;
    }),
  ];
};

const photoUpdateValidation = () => {
  return [
    body("title")
      .optional()
      .not()
      .equals("undefined")
      .withMessage("O titulo e obrigatório")
      .isString()
      .withMessage("O titulo e obrigatório")
      .isLength({ min: 3 })
      .withMessage("O titulo precisa ter no mínimo 3 caracteres "),
  ];
};

module.exports = { photoInsertValidation, photoUpdateValidation };
