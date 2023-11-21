const { grupos, alumnos } = require("../server/middlewares/querys");
const {
  renderError,
  cifrar,
  authRequired,
  validateToken,
} = require("../server/middlewares/functions");
const { langs, temas } = require("../server/constantes");
const { con } = require("../server/middlewares/database");

const app = require("express")();

app.get("/home_teach", authRequired("maestro"), async (req, res) => {
  try {
    res.render("maestro/home", {
      entidades: await grupos(req.session.idM),
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
  if (!token) {
    return renderError(res, "No token specified");
  }
  con.query("SELECT * FROM maestros WHERE id = ?", [token], (err, maestro) => {
    if (err) return renderError(res, err);
    var data = {
      name: maestro[0].name,
      lastname: maestro[0].lastname,
      mail: maestro[0].mail,
      type: maestro[0].idM,
    };
    res.render("maestro/myaccount", {
      data: data,
      langs,
      temas,
      selected,
      tema,
    });
  });
});

app.get("/reporteP", authRequired("maestro"), async (req, res) => {
  try {
    res.render("maestro/reporteP", {
      type: req.session.type,
      alumnos: await alumnos(req.session.idM),
      grupos: await grupos(req.session.idM),
      table_report: cifrar("reporte_parcial"),
      table_eval: cifrar("eval_parcial"),
    });
  } catch (err) {
    renderError(res, err);
  }
});

app.get("/reporteA", authRequired("maestro"), async (req, res) => {
  try {
    res.render("maestro/reporteA", {
      type: req.session.type,
      alumnos: await alumnos(req.session.idM),
      grupos: await grupos(req.session.idM),
      table_report: cifrar("reporte_adicional"),
      table_eval: cifrar("eval_adicional"),
    });
  } catch (err) {
    renderError(res, err);
  }
});

app.get("/evaluacion", authRequired("maestro"), async (req, res) => {
  res.render("maestro/evaluacion", {
    alumnos: await alumnos(req.session.idM),
    grupos: await grupos(req.session.idM),
  });
});

app.get("/Mver_reportesP", authRequired("maestro"), async (req, res) => {
  try {
    res.render("maestro/ver_reportesP", {
      grupos: await grupos(req.session.idM),
      alumnos: await alumnos(req.session.idM),
      type: req.session.type,
      table_report: cifrar("reporte_parcial"),
      table_eval: cifrar("eval_parcial"),
    });
  } catch (err) {
    renderError(res, err);
  }
});

app.get("/Mver_reportesA", authRequired("maestro"), async (req, res) => {
  try {
    res.render("maestro/ver_reportesA", {
      grupos: await grupos(req.session.idM),
      alumnos: await alumnos(req.session.idM),
      type: req.session.type,
      table_report: cifrar("reporte_adicional"),
      table_eval: cifrar("eval_adicional"),
    });
  } catch (err) {
    renderError(res, err);
  }
});

module.exports = app;
