const app = require("express")();
const {
  logged3,
  renderError,
  descifrar,
  cifrar,
} = require("../server/middlewares/functions");
const { hijos } = require("../server/middlewares/querys");

app.get("/home_parent", logged3, async (req, res) => {
  try {
    res.render("padre/home", { hijos: await hijos(req.session.idP, true) });
  } catch (err) {
    renderError(res, err);
  }
});

app.get("/reportes", logged3, async (req, res) => {
  try {
    res.render("padre/reportes", {
      hijos: await hijos(req.session.idP, false),
      parcial: cifrar("reporte_parcial"),
      adicional: cifrar("reporte_adicional"),
    });
  } catch (err) {
    renderError(res, err);
  }
});

module.exports = app;
