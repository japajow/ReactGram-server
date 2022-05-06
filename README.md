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

Definindo o diretório de upload das imagens

```tsx
app.use("/upload", express.static(path.join(__dirname, process.env.UPLOADS)));
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
