const { grupos, alumnos } = require("../server/middlewares/querys");
const {
  renderError,
  cifrar,
  authRequired,
  validateToken,
} = require("../server/middlewares/functions");
const { langs, temas } = require("../server/constantes");

const app = require("express")();

app.get("/home_teach", authRequired("maestro"), async (req, res) => {
  try {
    const token = await validateToken(req.cookies.token, "maestro");
    res.render("maestro/home", {
      entidades: await grupos(token.id),
      param: "grupos",
    });
  } catch (err) {
    renderError(res, err);
  }
});

app.get("/Mmyaccout", authRequired("maestro"), async (req, res) => {
  const selected = req.cookies.langM || "es";
  const tema = req.cookies.themeM || "light";
  const token = await validateToken(req.cookies.token, "maestro");
  var data = {
    name: token.name,
    lastname: token.lastname,
    mail: token.mail,
    type: token.type,
  };
  res.render("maestro/myaccount", {
    data: data,
    langs,
    temas,
    selected,
    tema,
  });
});

app.get("/reporteP", authRequired("maestro"), async (req, res) => {
  try {
    const token = await validateToken(req.cookies.token, "maestro");
    res.render("maestro/reporteP", {
      type: token.type,
      alumnos: await alumnos(token.id),
      grupos: await grupos(token.id),
      table_report: cifrar("reporte_parcial"),
      table_eval: cifrar("eval_parcial"),
    });
  } catch (err) {
    renderError(res, err);
  }
});

app.get("/reporteA", authRequired("maestro"), async (req, res) => {
  try {
    const token = await validateToken(req.cookies.token, "maestro");
    res.render("maestro/reporteA", {
      type: token.type,
      alumnos: await alumnos(token.id),
      grupos: await grupos(token.id),
      table_report: cifrar("reporte_adicional"),
      table_eval: cifrar("eval_adicional"),
    });
  } catch (err) {
    renderError(res, err);
  }
});

app.get("/evaluacion", authRequired("maestro"), async (req, res) => {
  const token = await validateToken(req.cookies.token, "maestro");
  res.render("maestro/evaluacion", {
    alumnos: await alumnos(token.id),
    grupos: await grupos(token.id),
  });
});

app.get("/Mver_reportesP", authRequired("maestro"), async (req, res) => {
  try {
    const token = await validateToken(req.cookies.token, "maestro");
    res.render("maestro/ver_reportesP", {
      grupos: await grupos(token.id),
      alumnos: await alumnos(token.id),
      type: token.type,
      table_report: cifrar("reporte_parcial"),
      table_eval: cifrar("eval_parcial"),
    });
  } catch (err) {
    renderError(res, err);
  }
});

app.get("/Mver_reportesA", authRequired("maestro"), async (req, res) => {
  try {
    const token = await validateToken(req.cookies.token, "maestro");
    res.render("maestro/ver_reportesA", {
      grupos: await grupos(token.id),
      alumnos: await alumnos(token.id),
      type: token.type,
      table_report: cifrar("reporte_adicional"),
      table_eval: cifrar("eval_adicional"),
    });
  } catch (err) {
    renderError(res, err);
  }
});

module.exports = app;
