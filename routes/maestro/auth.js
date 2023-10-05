const { grupos, alumnos } = require("../server/middlewares/querys");
const {
  logged2,
  renderError,
  cifrar,
} = require("../server/middlewares/functions");
const { langs, temas } = require("../server/constantes");

const app = require("express")();

app.get("/home_teach", logged2, async (req, res) => {
  try {
    res.render("maestro/home", {
      entidades: await grupos(req.session.idM),
      param: "grupos",
    });
  } catch (err) {
    renderError(res, err);
  }
});

app.get("/Mmyaccout", logged2, async (req, res) => {
  const selected = req.cookies.langM || "es";
  const tema = req.cookies.themeM || "light";
  var data = {
    name: req.session.name,
    lastname: req.session.lastname,
    mail: req.session.mail,
    type: req.session.idM,
  };
  res.render("maestro/myaccount", {
    data: data,
    langs,
    temas,
    selected,
    tema,
  });
});

app.get("/reporteP", logged2, async (req, res) => {
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

app.get("/reporteA", logged2, async (req, res) => {
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

app.get("/evaluacion", logged2, async (req, res) => {
  res.render("maestro/evaluacion", {
    alumnos: await alumnos(req.session.idM),
    grupos: await grupos(req.session.idM),
  });
});

app.get("/Mver_reportesP", logged2, async (req, res) => {
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

app.get("/Mver_reportesA", logged2, async (req, res) => {
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
