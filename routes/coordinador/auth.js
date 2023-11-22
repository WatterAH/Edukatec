const app = require("express")();
const { langs, temas } = require("../server/constantes");
const { con } = require("../server/middlewares/database");
const {
  language,
  renderError,
  showMessage,
  descifrar,
  cifrar,
  theme,
  authRequired,
  validateToken,
} = require("../server/middlewares/functions");
const {
  grupos,
  codes,
  maestros,
  asignacion,
  tiempos,
  alumnos,
} = require("../server/middlewares/querys");

app.get("/home_coord", authRequired("coordinador"), async (req, res) => {
  try {
    res.render("coordinador/home", {
      entidades: await grupos(),
      texts: language(req),
      theme: theme(req),
      param: "grupos",
    });
  } catch (err) {
    renderError(res, err);
  }
});

app.get("/register_m", authRequired("coordinador"), async (req, res) => {
  try {
    res.render("coordinador/register_m", {
      message: showMessage(res, req),
      codes: await codes(),
      texts: language(req),
      theme: theme(req),
    });
  } catch (err) {
    renderError(res, err);
  }
});

app.get("/register_g", authRequired("coordinador"), (req, res) => {
  res.render("coordinador/register_g", {
    message: showMessage(res, req),
    texts: language(req),
    theme: theme(req),
  });
});

app.get("/register_a", authRequired("coordinador"), async (req, res) => {
  try {
    res.render("coordinador/register_a", {
      grupos: await grupos(),
      texts: language(req),
      message: showMessage(res, req),
      theme: theme(req),
    });
  } catch (err) {
    renderError(res, err);
  }
});

app.get("/register_p", authRequired("coordinador"), async (req, res) => {
  try {
    res.render("coordinador/register_p", {
      alumnos: await alumnos(),
      grupos: await grupos(),
      texts: language(req),
      theme: theme(req),
      message: showMessage(res, req),
    });
  } catch (err) {
    renderError(res, err);
  }
});

app.get("/asignar", authRequired("coordinador"), async (req, res) => {
  try {
    res.render("coordinador/asignar", {
      grupos: await grupos(),
      maestros: await maestros(),
      asignacion: await asignacion(),
      descifrar: descifrar,
      texts: language(req),
      message: showMessage(res, req),
      theme: theme(req),
    });
  } catch (err) {
    renderError(res, err);
  }
});

app.get("/Cver_reportesP", authRequired("coordinador"), async (req, res) => {
  try {
    res.render("coordinador/ver_reportesP", {
      texts: language(req),
      theme: theme(req),
      grupos: await grupos(),
      alumnos: await alumnos(),
      table_report: cifrar("reporte_parcial"),
      table_eval: cifrar("eval_parcial"),
    });
  } catch (err) {
    renderError(res, err);
  }
});

app.get("/Cver_reportesA", authRequired("coordinador"), async (req, res) => {
  try {
    res.render("coordinador/ver_reportesA", {
      texts: language(req),
      theme: theme(req),
      grupos: await grupos(),
      alumnos: await alumnos(),
      table_report: cifrar("reporte_adicional"),
      table_eval: cifrar("eval_adicional"),
    });
  } catch (err) {
    renderError(res, err);
  }
});

app.get("/Cmyaccount", authRequired("coordinador"), async (req, res) => {
  const token = await validateToken(req.cookies.token, "coordinador");
  var data = {
    name: token.name,
    lastname: token.lastname,
    mail: token.mail,
  };
  res.render("coordinador/myaccount", {
    data: data,
    texts: language(req),
    theme: theme(req),
  });
});

app.get("/Csettings", authRequired("coordinador"), async (req, res) => {
  try {
    const selected = req.cookies.lang || "es";
    const tema = req.cookies.theme || "light";
    res.render("coordinador/settings", {
      langs,
      temas,
      tema,
      selected,
      texts: language(req),
      periodos: await tiempos(),
      theme: theme(req),
    });
  } catch (err) {
    console.log(err);
    renderError(res, err);
  }
});

module.exports = app;
