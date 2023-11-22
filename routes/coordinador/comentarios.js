const { format } = require("date-fns");
const {
  isAjax,
  descifrar,
  validateToken,
} = require("../server/middlewares/functions");
const { getReportID, hallExists } = require("../server/middlewares/helpers");
const { comments } = require("../server/middlewares/querys");
const { con } = require("../server/middlewares/database");
const { body } = require("express-validator");

const app = require("express")();

app.get("/comentarios", isAjax, async (req, res) => {
  const alumno = descifrar(req.query.alumno);
  const period = req.query.periodo;
  const cycle = req.query.ciclo;
  const table_report = descifrar(req.query.report);
  const maestro = descifrar(req.query.maestro);
  if (alumno === null || table_report === null || maestro === null)
    return res.send(JSON.stringify(""));
  const type_report = table_report == "reporte_parcial" ? 1 : 2;
  const id_pattern = await getReportID(alumno, table_report, period, cycle);
  const token = await validateToken(req.cookies.token, "coordinador");
  const id_sala = await hallExists(type_report, id_pattern, token.id, maestro);
  const comentarios = await comments(id_sala);
  return res.send(JSON.stringify(comentarios));
});

app.post("/commentC", isAjax, [body("txt").trim()], async (req, res) => {
  //SALA
  const alumno = descifrar(req.body.alumno);
  const maestro = descifrar(req.body.maestro);
  const tabla = descifrar(req.body.tabla);
  const txt = req.body.txt;
  if (alumno === null || maestro === null) return res.send(JSON.stringify(""));
  let type = tabla == "reporte_parcial" ? 1 : 2;
  const reportID = await getReportID(alumno, tabla);
  //COMENTARIO
  let fecha = new Date();
  let month = format(fecha, "MMM");
  let day = fecha.getDate();
  let date = day + "-" + month;
  const token = await validateToken(req.cookies.token, "coordinador");

  let id_pattern = await hallExists(type, reportID, token.id, maestro);
  if (!txt) {
    const comentarios = await comments(id_pattern);
    return res.send(JSON.stringify(comentarios));
  }

  con.query(
    "INSERT INTO comentarios SET ?",
    {
      id_pattern,
      txt,
      sender: 1,
      date,
    },
    async (err) => {
      if (err) {
        console.log(err);
        return res.send(JSON.stringify(""));
      }
      const comentarios = await comments(id_pattern);
      return res.send(JSON.stringify(comentarios));
    }
  );
});

module.exports = app;
