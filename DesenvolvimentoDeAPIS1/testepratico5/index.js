const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());

app.post("/cookie/criar", (req, res) => {
  const nomeCookie = "meuCookie";
  const valorCookie = "valorCookie";
  res.cookie(nomeCookie, valorCookie, { httpOnly: true });
  res.status(201).json({
    mensagem: "Cookie criado com sucesso",
    cod_status: 201,
  });
});

app.get("/cookie/ler", (req, res) => {
  const nomeCookie = "meuCookie";
  if (req.cookies[nomeCookie]) {
    res.status(200).json({
      mensagem: `O nome do cookie criado foi ${nomeCookie} e valor ${req.cookies[nomeCookie]}`,
      cod_status: 200,
    });
  } else {
    res.status(404).json({
      mensagem: "Cookie não encontrado",
      cod_status: 404,
    });
  }
});

app.put("/cookie/atualizar", (req, res) => {
  const nomeCookie = "meuCookie";
  const novoValorCookie = "novoValorCookie";
  if (req.cookies[nomeCookie]) {
    res.cookie(nomeCookie, novoValorCookie, { httpOnly: true });
    res.status(200).json({
      mensagem: `O nome do cookie é ${nomeCookie} e o novo valor é ${novoValorCookie}`,
      cod_status: 200,
    });
  } else {
    res.status(404).json({
      mensagem: "Cookie não encontrado para atualização",
      cod_status: 404,
    });
  }
});

app.delete("/cookie/excluir", (req, res) => {
  const nomeCookie = "meuCookie";
  if (req.cookies[nomeCookie]) {
    res.clearCookie(nomeCookie);
    res.status(200).json({
      mensagem: "Cookie excluído com sucesso",
      cod_status: 200,
    });
  } else {
    res.status(404).json({
      mensagem: "Cookie não encontrado para exclusão",
      cod_status: 404,
    });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
