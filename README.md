## Projeto ReactGram com Matheus UDEMY

> Construindo o servidor

npm init

> Instalando os pacotes no projeto
> npm i bcryptjs cors dotenv express express-validator jsonwebtoken mongoose multer

bcryptjs Controlador de senhas
cors Garante acesso no mesmo local origin
dotenv Onde fica as variáveis do ambiente na nossa aplicação
express Framework de backend
express-validator Um middleware para validações dos dados
jsonwebtoken Na hora da validação ele gera o token e verifica
mongoose Trabalhar com banco de dados
multer Upload de imagens no projeto

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
