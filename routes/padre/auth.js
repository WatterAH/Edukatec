const app = require("express")();
const {
  renderError,
  cifrar,
  authRequired,
  validateToken,
} = require("../server/middlewares/functions");
const { hijos } = require("../server/middlewares/querys");

app.get("/home_parent", authRequired("padre"), async (req, res) => {
  try {
    const token = await validateToken(req.cookies.token, "padre");
    res.render("padre/home", { hijos: await hijos(token.id, true) });
  } catch (err) {
    renderError(res, err);
  }
});

app.get("/reportes", authRequired("padre"), async (req, res) => {
  try {
    const token = await validateToken(req.cookies.token, "padre");
    res.render("padre/reportes", {
      hijos: await hijos(token.id, false),
      parcial: cifrar("reporte_parcial"),
      adicional: cifrar("reporte_adicional"),
    });
  } catch (err) {
    renderError(res, err);
  }
});

module.exports = app;
