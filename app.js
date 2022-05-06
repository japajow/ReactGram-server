require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

const port = process.env.PORT;

const app = express();

//configurando as resposta JSON e form data response
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//router
const router = require("./routes/Router.js");
app.use(router);

//cors
app.use(cors({ credentials: true, origin: process.env.BASE_URL }));

//uploads image
app.use("/upload", express.static(path.join(__dirname, process.env.UPLOADS)));

//connection DB
require("./config/db.js");

app.listen(port, () => {
  console.log(`App rodando na porta ${port}`);
});
