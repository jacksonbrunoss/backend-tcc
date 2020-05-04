const express = require("express");
const app = express();

app.use((req, res, next) => {
  const erro = new Error("Não foi possivel encontrar!");
  erro.status = 404;
  next(erro);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.send({
    erro: {
      mensagem: error.message,
    },
  });
});

module.exports = app;
