## Projeto ReactGram com Matheus UDEMY

> Construindo o servidor

npm init

> Instalando os pacotes no projeto
> npm i bcryptjs cors dotenv express express-validator jsonwebtoken mongoose multer

- **bcryptjs** Controlador de senhas
- **cors** Garante acesso no mesmo local origin
- **dotenv** Onde fica as variáveis do ambiente na nossa aplicação
- **express** Framework de backend
- **express-validator** Um middleware para validações dos dados
- **jsonwebtoken** Na hora da validação ele gera o token e verifica
- **mongoose** Trabalhar com banco de dados
- **multer** Upload de imagens no projeto

> Instalação do pacotes de DEV dependencies
> npm i --save-dev nodemon
> nodemon

Criando o arquivo de inicialização app.js

```tsx
const express = require("express");
const path = require("path");
const cors = require("cors");

const port = 5000;

const app = express();

//configurando as resposta JSON e form data response
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, () => {
  console.log(`App rodando na porta ${port}`);
});
```

Criamos um script no package.json

```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "server":"nodemon ./app.js"
  },
```

## Configurando o dotenv

Criamos um arquivo .env na raiz

no app.js

```tsx
require("dotenv").config();
```

no arquivo .env

```tsx
PORT = 5000;
```

Agora usamos o PORT no app.js

```tsx
const port = process.env.PORT;
```

## Testando a Rota do API

Criando a pasta models controllers e routes

routes/router.js

```tsx
const express = require("express");
const router = express();

module.exports = router;
```

No app.js

```tsx
//router
const router = require("./routes/Router.js");
app.use(router);
```

Colocamos uma rota de teste para ver se esta funcionando

routes/router.js

```tsx
router.get("/", (req, res) => {
  res.send("API WORKING!");
});
```

abrimos o insomnia e testamos a rota
http://localhost:5000

## Importando Middleware

//resolvendo o problema de cors

```tsx
//cors
app.use(cors({ credentials: true, origin: process.env.BASE_URL }));
```

arquivo .env

```tsx
BASE_URL=http://localhost:3000
```

Definindo o diretório de upload das imagens

```tsx
app.use("/upload", express.static(path.join(__dirname, process.env.UPLOADS)));
```

arquivo .env

```tsx
UPLOADS = "/uploads";
```

Criamos a pasta uploads/users e photos

e concluindo fazemos a conexão ao db

```tsx
require("./config/db.js");
```

Criamos uma pasta chamada config/db.js

```tsx
const mongoose = require("mongoose");
```

## Conexão com MongoDB Atlas

https://www.mongodb.com/pt-br/cloud/atlas/efficiency

Criando a conta

Criamos o usuario

Add entries to your IP Access list
192.168.1.13 MyIP

Connect > Connect your application

No Arquivo db.js

```tsx
const dbUser = "";
const dbPassword = "";
const conn = async () => {
  try {
    const dbConn = await mongoose.connect(
      "mongodb+srv://reactgramjapajow:<password>@cluster0.1vxtx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    );

    console.log("Conectou ao banco");

    return dbConn;
  } catch (error) {
    console.log(error);
  }
};

conn();

module.exports = conn;
```

Configuramos a senha e usuário no .env

Usamos a variável DB_PASS e DB_USER no db.js

```tsx
const mongoose = require("mongoose");
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

const conn = async () => {
  try {
    const dbConn = await mongoose.connect(
      `mongodb+srv://${dbUser}:${dbPassword}@cluster0.1vxtx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
    );

    console.log("Conectou ao banco");

    return dbConn;
  } catch (error) {
    console.log(error);
  }
};

conn();

module.exports = conn;
```

## Criando model do Usuário

models/User.js

```tsx
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    profileImage: String,
    bio: String,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
```

## Criando model da Photo

models/Photo.js

```tsx
const mongoose = require("mongoose");
const { Schema } = mongoose;

const photoSchema = new Schema(
  {
    image: String,
    title: String,
    likes: Array,
    comments: Array,
    userId: mongoose.ObjectId,
    userName: String,
  },
  {
    timestamps: true,
  }
);

const Photo = mongoose.model("Photo", photoSchema);

module.exports = Photo;
```

## Criando controller do usuario

controllers/UserController.js

Antes de mais nada criamos um JWT no nosso .env para token de acesso

Agora no UserController.js

```tsx
const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

// criamos uma funcao para criar o token
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "7d", // vence em 7 dias
  });
};

// funcao de registrar e logar
const register = async (req, res) => {
  res.send("Registro");
};
//importamos a funcao register
module.exports = {
  register,
};
```

Criando a rota de Usuario

routes/UserRoutes.js

```tsx
const express = require("express");
const router = express.Router();

// funções do controller
const { register } = require("../controllers/UserController");

//rotas

router.post("/register", register);

module.exports = router;
```

Agora vamos no routes/Router principal e chamar a rota de Usuario para incluir na aplicação

routes/router.js

```tsx
router.use("/api/users", require("./UserRoutes"));
```

## Iniciando a validação

Registro do usuario

Criando validações com express validator

Criando pasta middlewares
Middleware e nada mais nada menos que uma verificao entre no meio de uma requisição

middlewares/handleValidation.js

```tsx
// importamos o validationResult
const { validationResult } = require("express-validator");

// criamos validade com req,res,next  next se nao tiver erro continua
const validate = (req, res, next) => {
  //toda requisição que tiver middleware de validação vai retornar possíveis erros
  const errors = validationResult(req);

  //se tiver nenhum erro continua next()
  if (errors.isEmpty()) {
    return next();
  }
  //criamos um array vazio
  const extractedErrors = [];

  // pegamos nossos erros e colocamos no array vazio
  errors.array().map((err) => extractedErrors.push(err.msg));

  //retornamos 422 passando pra json  com errors 422 nao foi bem sucedido por algum motivo
  return res.status(422).json({
    errors: extractedErrors,
  });
};
//exportamos o validate
module.exports = validate;
```

Vamos utilizar ele nas rotas

routes/UserRoutes.js

```tsx
//importamos o middleware
const validate = require("../middlewares/handleValidation");

//colocamos no meio da requisição do usuario e a resposta que vai obter
router.post("/register", validate, register);
```

## middleware criação validação de usuario

middlewares/userValidations.js

```tsx
const { body } = require("express-validator");

const userCreateValidation = () => {
  return [body("name").isString().withMessage("O nome e obrigatório")];
};

module.exports = {
  userCreateValidation,
};
```

No UserRoutes.js

```tsx
const { userCreateValidation } = require("../middlewares/useValidations");

//incluímos na rota a validação
router.post("/register", userCreateValidation(), validate, register);
```

Completando as validações no userCreateValidator

```tsx
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
```

## Registro do usuario

Vamos no UserController.js

```tsx
const register = async (req, res) => {
  const { name, password, email } = req.body;

  //checamos se o urnário existe
  const user = await User.finOne({ email });
  //caso houver o usurário no registro retorna erro
  if (user) {
    res.status(422).json({ errors: "Por favor utilize outro email" });
  }

  //Gerando a senha em hash code
  const salt = await bcrypt.genSalt();
  // geramos uma senha com hash e passamos a passwordHash
  const passwordHash = await bcrypt.hash(password, salt);

  // Criando usuario
  const newUser = await User.create({
    name,
    email,
    password: passwordHash,
  });
  //checamos se o usuario foi gerado com sucesso retorno o token
  if (!newUser) {
    res
      .status(422)
      .json({ errors: "Houve um erro , por favor tente mais tarde." });
    return;
  }
  //Caso for feito com sucesso gera um token com o id do novo usuario
  res.status(201).json({
    _id: newUser._id,
    token: generateToken(newUser._id),
  });
};

//testamos no postman se for sucesso gera o id e o token
{
    "_id": "62759636f1beea537eca1810",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNzU5NjM2ZjFiZWVhNTM3ZWNhMTgxMCIsImlhdCI6MTY1MTg3MzMzNCwiZXhwIjoxNjUyNDc4MTM0fQ.Fbd6y9-eai7T67XEvh2IKN1FkZuoj9KEBO7QaxAXdH4"
}

//enviando mais uma vez da um erro que ja existe um email
{
    "errors": "Por favor utilize outro email"
}

Funcionando perfeitamente
```

## Validação do Login

Vamos no UserValidations.js

```tsx
//criamos uma funcao de loginValidation

const loginValidation = () => {
  return [
    body("email")
      .isString()
      .withMessage("O e-mail e obrigatório")
      .isEmail()
      .withMessage("Insira um e-mail valido"),
    body("password").isString().withMessage("A senha e obrigatória"),
  ];
};
//adicionamos o loginValidation no exports
module.exports = {
  userCreateValidation,
  loginValidation,
};
```

Agora vamos no UserController.js

```tsx
// logando o usuario
const login = (req, res) => {
  res.send("Login");
};

module.exports = {
  register,
  login,
};
```

Vamos criar uma rota routes/UserRoutes.js

```tsx
//importamos do controller o login

const { register, login } = require("../controllers/UserController");

// importamos o loginValidation
const {
  userCreateValidation,
  loginValidation,
} = require("../middlewares/useValidations");

//criamos a rota com post
router.post("/login", loginValidation(), validate, login);
```

## Login de usuario

no UserController.js

```tsx
// logando o usuario
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // Checar se o nao usuario existir
  if (!user) {
    res.status(404).json({ errors: ["usuario nao existe."] });
    return;
  }

  //Checando se a senha combina com a senha do usuario
  if (!(await bcrypt.compare(password, user.password))) {
    res.status(422).json({ errors: ["Senha invalida"] });
    return;
  }

  // se deu tudo certo retorna o usuario e o token
  res.status(201).json({
    _id: user._id,
    profileImage: user.profileImage,
    token: generateToken(user._id),
  });
};
```
