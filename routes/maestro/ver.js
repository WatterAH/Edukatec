const { materias } = require("../server/constantes");
const {
  query,
  descifrar,
  cifrar,
  isAjax,
  authRequired,
  validateToken,
} = require("../server/middlewares/functions");
const { getReportID, hallExists } = require("../server/middlewares/helpers");
const {
  evaluaciones,
  comments,
  alumnos,
} = require("../server/middlewares/querys");

const app = require("express")();

app.post("/entidadesM", authRequired("maestro"), async (req, res) => {
  const id = descifrar(req.body.id);
  if (id === null) return res.redirect("home_teach");
  const param = req.body.param;
  if (param == "grupos") {
    const get = await query("SELECT * FROM alumnos WHERE grupo = ?", id);
    const entidades = get.map((row) => {
      const id = cifrar(row.id);
      return { ...row, id: id };
    });
    res.render("maestro/home", {
      entidades: entidades,
      param: "alumnos",
    });
  } else if (param == "alumnos") {
    const entidades = await query(
      "SELECT * FROM evaluaciones WHERE id_alumno = ?",
      id
    );
    res.render("maestro/home", {
      entidades: entidades,
      param: "evals",
    });
  } else {
    res.redirect("home_teach");
  }
});

app.get("/reporteM", isAjax, async (req, res) => {
  const alumno = descifrar(req.query.alumno);
  const table_report = descifrar(req.query.report);
  const table_eval = descifrar(req.query.eval);
  const token = await validateToken(req.cookies.token, "maestro");
  const type = token.type;
  if (alumno == null || table_report == null || table_eval == null) {
    return res.send(JSON.stringify(""));
  }
  const id = await getReportID(alumno, table_report);
  const eval = await evaluaciones(id, materias(type), table_eval);
  const [{ accepted }] = await query("SELECT accepted FROM ?? WHERE id = ?", [
    table_report,
    id,
  ]);
  const data = { eval, accepted };

  return res.send(JSON.stringify(data));
});

app.get("/alumnosGrupo", isAjax, async (req, res) => {
  const grupo = descifrar(req.query.grupo);
  const token = await validateToken(req.cookies.token, "maestro");
  if (grupo === null) {
    const estudiantes = await alumnos(token.id);
    return res.send(JSON.stringify(estudiantes));
  }
  const get = await query("SELECT * FROM alumnos WHERE grupo = ?", grupo);
  const estudiantes = get.map((row) => {
    const id = cifrar(row.id);
    return { ...row, id: id };
  });
  return res.send(JSON.stringify(estudiantes));
});

app.get("/recuperar", isAjax, async (req, res) => {
  //DATOS
  const alumno = descifrar(req.query.alumno);
  const table_report = descifrar(req.query.report);
  const table_eval = descifrar(req.query.eval);
  const token = await validateToken(req.cookies.token, "maestro");
  const id_coord = token.idC;
  const type = token.type;
  const id_teach = token.id;
  //VALIDAR CIFRADO
  if (alumno === null || table_report === null || table_eval === null) {
    return res.send(JSON.stringify(""));
  }
  const type_report = table_report == "reporte_parcial" ? 1 : 2;
  //ID PADRE
  const id_pattern = await getReportID(alumno, table_report);
  const id_sala = await hallExists(type_report, id_pattern, id_coord, id_teach);
  //ENVIAR RESPUESTA
  const response = {
    comentarios: await comments(id_sala),
    eval: await evaluaciones(id_pattern, materias(type), table_eval),
  };
  res.send(JSON.stringify(response));
});

module.exports = app;
