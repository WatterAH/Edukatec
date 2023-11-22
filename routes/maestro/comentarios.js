const { con } = require("../server/middlewares/database");
const { format } = require("date-fns");
const { getReportID, hallExists } = require("../server/middlewares/helpers");
const { descifrar, validateToken } = require("../server/middlewares/functions");
const { comments } = require("../server/middlewares/querys");
const { body } = require("express-validator");

const app = require("express")();

app.post("/commentM", [body("txt").trim()], async (req, res) => {
  //SALA
  let alumno = descifrar(req.body.alumno);
  let tabla = descifrar(req.body.tabla);
  if (alumno === null || tabla === null) return res.send(JSON.stringify(""));
  let type = tabla == "reporte_parcial" ? 1 : 2;
  const reportID = await getReportID(alumno, tabla);
  //COMENTARIO
  let txt = req.body.txt;
  let fecha = new Date();
  let month = format(fecha, "MMM");
  let day = fecha.getDate();
  let date = day + "-" + month;
  const token = await validateToken(req.cookies.token, "maestro");

  let id_pattern = await hallExists(type, reportID, token.idC, token.id);
  if (!txt) {
    const comentarios = await comments(id_pattern);
    return res.send(JSON.stringify(comentarios));
  }
  con.query(
    "INSERT INTO comentarios SET ?",
    {
      id_pattern,
      txt,
      sender: 2,
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
