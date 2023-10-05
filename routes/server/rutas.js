const app = require("express")();

app.get("/", (req, res) => {
  res.render("server/index");
});

app.get("/login", (req, res) => {
  res.render("server/login");
});

app.get("/aviso-cookies", (req, res) => {
  res.render("server/aviso-cookies");
});

app.get("/terminos", (req, res) => {
  res.render("server/terminos");
});

app.get("/forgotpass", (req, res) => {
  res.render("server/forgotpass");
});

app.get("/register", (req, res) => {
  res.render("server/register");
});

module.exports = app;
