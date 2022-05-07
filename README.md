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

## Criando a validação de autenticação

Criando o middleware authGuard.js

```tsx
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const authGuard = async (req, res, next) => {
  // toda requisição tem os padrões , tem os headers que tem o authorization
  const authHeader = req.headers["authorization"];
  //Verificando se o authHeader existe and a segunda parte do header
  // Bearer jsjaosjoajsoajos pegando a segunda parte que e o token
  const token = authHeader && authHeader.split(" ")[1];

  //checando se existe um token
  // se nao tiver o authorization ja vai da erro
  if (!token) return res.status(401).json({ erros: ["Acesso Negado!"] });

  //checando se o token e valido
  try {
    // verificamos o token com jwtSecret comparando os dois token
    const verified = jwt.verify(token, jwtSecret);
    // jogamos o objeto do usuario pegando pelo id , tirando o password pq nao precisamos dele
    req.user = await User.findById(verified.id).select("-password");
    // segue em frente com next()
    next();
  } catch (error) {
    // se cair aqui e pq o token e invalido
    res.status(401).json({ erros: ["token invalido"] });
  }
};

module.exports = authGuard;
```

## Resgatando o usuario autenticado

Criando a funcao noUserCOntroller.js

```tsx
// recuperando dados do usuario logado
const getCurrentUser = async (req, res) => {
  const user = req.user;
  res.status(200).json(user);
};

module.exports = {
  register,
  login,
  getCurrentUser,
};
```

No arquivo de UserRoutes.js

```tsx
//importamos getCurrentUser
const {
  register,
  login,
  getCurrentUser,
} = require("../controllers/UserController");

//importamos o authGuard
const authGuard = require("../middlewares/authguard");

//Criamos a rota profile usando o authGuard e getCurrentUser
router.get("/profile", authGuard, getCurrentUser);
```

## Middleware de upload de imagens

criamos middlewares/imageUpload.js

```tsx
//upload de arquivos
const multer = require("multer");
//module padrão do node
const path = require("path");

//Destino da imagem a ser salva
const imageStorage = multer.diskStorage({
  //destino requisição ,arquivo e callback
  destination: (req, file, cb) => {
    let folder = ""; // pasta vazia

    // se a requisição tiver users
    if (req.baseUrl.includes("users")) {
      //a pasta vai ser users
      folder = "users";
    } else if (req.baseUrl.includes("photos")) {
      //se incluir photos , a pasta nome sera photos
      folder = "photos";
    }
    //callback com o destino do uploads e users ou photos
    cb(null, `uploads/${folder}/`);
  },
  //definindo o nome da imagem arquivo, requisição, pasta , callback
  filename: (req, file, cb) => {
    // data horário milissegundos e o caminho
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

//mini validação da imagem e aonde vai ser salva
const imageUpload = multer({
  //setando aonde vai ser salvo , passando a funcao que criamos acima
  storage: imageStorage,
  // filtrando a extensão do arquivo
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      //upload only png and jpg
      return cb(new Error("Por favor enviar apenas png ou jpg !"));
    }
    //se nao cair no if retorna true e o código seja continuado
    cb(undefined, true);
  },
});

module.exports = { imageUpload };
```

## Middleware de atualização do usuario

vamos no userValidation.js

```tsx
//Criamos a validação
const userUpdateValidation = () => {
  return [
    body("name")
      .optional()
      .isLength({ min: 3 })
      .withMessage("O nome precisa de pelo menos 3 caracteres"),
    body("password")
      .optional()
      .isLength({ min: 5 })
      .withMessage("A senha precisa ter no mínimo 5 caracteres"),
  ];
};

//exportamos
module.exports = {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
};
```

Agora no UserRoutes.js

```tsx
router.put(
  "/",
  authGuard,
  userUpdateValidation(),
  validate,
  imageUpload.single("profileImage"),
  update >> ainda nao existe
);


const {
  register,
  login,
  getCurrentUser,
  update
} = require("../controllers/UserController");
```

Criando o update no Controller
UserController.js

```tsx
const update = async (req, res) => {
  res.send("update");
};

//exportamos o update

module.exports = {
  register,
  login,
  getCurrentUser,
  update,
};
```

## Atualizando usuario

no UserController.js

```tsx
//importamos o mongoose
const mongoose = require("mongoose");

const update = async (req, res) => {
  // pegando valores que pode vir ou nao pela requisição
  const { name, password, bio } = req.body;

  // criamos uma variável imagem como nulo
  let profileImage = null;

  //verificamos se chegou uma requisição de imagem
  if (req.file) {
    //se chegou atribuímos a profileImage pegando a requisição do filename
    profileImage = req.file.filename;
  }

  //atribuímos o usuario que tem no token req.user
  const reqUser = req.user;
  //pegamos o usuario pelo ID pegando pelo token , sem o password
  const user = await User.findById(mongoose.Types.ObjectId(reqUser._id)).select(
    "-password"
  );
  //verificamos se o nome chegou
  if (name) {
    user.name = name;
  }
  //verificamos se a senha chegou
  if (password) {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // passamo a senha com hash para o user.password
    user.password = passwordHash;
  }

  // se chegou uma requisição de profileImage
  if (profileImage) {
    user.profileImage = profileImage;
  }
  //se chegou a bio
  if (bio) {
    user.bio = bio;
  }
  //salvamos ele no banco
  await user.save();
  //damos um resolve 200 passando o user no json
  res.status(200).json(user);
};
```

## Resgatando o usuario pelo ID

No UserController.js

```tsx
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(mongoose.Types.ObjectId(id)).select(
      "-password"
    );
    if (!user) {
      res.status(404).json({ errors: ["Usuario nao encontrado"] });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ errors: ["Usuario nao existe"] });
  }
};
```

Inserimos na rotas tambem

UserRoutes.js

```tsx
// passamos o getUserById  e nao precisa de nenhum middleware
router.get("/:id", getUserById);
```

## Configuracao inicial para rotas de fotos Part 1

Criamos o controller da foto
controller/PhotoController.js

Criamos a rota da foto
router/PhotoRoutes.js

```tsx
const express = require("express");
const router = express.Router();

// Controller

// Middleware

// Routes

module.exports = router;
```

Criando o middleware/photoValidation.js

```tsx
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

module.exports = { photoInsertValidation };
```

importamos no /PhotoRoutes.js

```tsx
const express = require("express");
const router = express.Router();

// Controller

// Middleware
const { photoInsertValidation } = require("../middlewares/photoValidation");
const authGuard = require("../middlewares/authguard");
const validate = require("../middlewares/handleValidation");

// Routes

module.exports = router;
```

## Configuracao inicial para rotas de fotos Part 2

vamos no PhotoController.js

```tsx
const Photo = require("../models/Photo");

const mongoose = require("mongoose");

// Inserindo uma photo relacionado ao usuario que postou

const insertPhoto = async (req, res) => {
  const { title } = req.body;
  const image = req.file.filename;

  console.log(req.body);

  res.send("Photo insert by user");
};

module.exports = insertPhoto;
```

Vamos no PhotoRoutes.js

```tsx
// Controller
const { insertPhoto } = require("../controllers/PhotoController");

// e passamos na routes
// Routes
router.post(
  "/",
  authGuard,
  imageUpload.single("image"),
  photoInsertValidation(),
  validate,
  insertPhoto
);
```

Agora vamos no router.js

```tsx
router.use("/api/photos", require("./PhotoRoutes"));
```

PhotoCOntroller.js

```tsx
const Photo = require("../models/Photo");

const mongoose = require("mongoose");
const User = require("../models/User");

// Inserindo uma photo relacionado ao usuario que postou

const insertPhoto = async (req, res) => {
  const { title } = req.body;
  const image = req.file.filename;

  const reqUser = req.user;

  const user = await User.findById(reqUser._id);

  const newPhoto = await Photo.create({
    image,
    title,
    userId: user._id,
    userName: user.name,
  });

  //Verificar se foi sucesso
  if (!newPhoto) {
    res.status(422).json({
      erros: ["Houve um problema , por favor tente novamente mais tarde"],
    });
  }

  res.status(201).json(newPhoto);
};

module.exports = { insertPhoto };
```
