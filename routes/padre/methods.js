const {
  logged3,
  isAjax,
  descifrar,
  query,
} = require("../server/middlewares/functions");
const { getReportID } = require("../server/middlewares/helpers");
const { body, validationResult } = require("express-validator");
const { con } = require("../server/middlewares/database");
const bcryptjs = require("bcryptjs");
const PDFDoc = require("pdfkit");

const app = require("express")();

app.post(
  "/changePassP",
  logged3,
  [
    body("pass1").trim().isLength({ min: 1 }),
    body("pass2").trim().isLength({ min: 1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(401).send("Ingresa una contraseña!");
    } else {
      const pass1 = req.body.pass1;
      const pass2 = req.body.pass2;
      const passHaash = await bcryptjs.hash(pass2, 8);
      const mail = req.session.mail;
      con.query(
        "SELECT * FROM padres WHERE mail = ?",
        [mail],
        async (err, padre) => {
          if (err) return res.status(500).send("Ocurrio un error");
          if (
            padre.length == 0 ||
            !(await bcryptjs.compare(pass1, padre[0].pass))
          ) {
            res.status(401).send("La contraseña anterior no coincide");
          } else {
            con.query(
              "UPDATE padres SET pass = ? WHERE mail = ?",
              [passHaash, mail],
              async (err) => {
                if (err) return res.status(500).send("Ocurrio un error");
                res.status(200).send("Contraseña cambiada");
              }
            );
          }
        }
      );
    }
  }
);

app.get("/reportParent", isAjax, async (req, res) => {
  const hijo = descifrar(req.query.hijo);
  const table_report = descifrar(req.query.report);
  const periodo = req.query.period;
  if (hijo === null || table_report === null)
    return res.send(JSON.stringify(""));
  const [{ ciclo }] = await query(
    "SELECT COALESCE(1, id_ciclo) AS ciclo FROM coordinadores"
  );
  const reportID = await getReportID(hijo, table_report, periodo, ciclo);
  const isAccepted = await query("SELECT * FROM ?? WHERE id = ?", [
    table_report,
    reportID,
  ]);
  if (isAccepted.length === 0 || !isAccepted[0].accepted)
    return res.send(JSON.stringify(""));
  const table_eval =
    table_report == "reporte_parcial" ? "eval_parcial" : "eval_adicional";
  const evals = await query("SELECT * FROM ?? WHERE id_pattern = ?", [
    table_eval,
    reportID,
  ]);
  return res.send(JSON.stringify(evals));
});

app.get("/pdf", isAjax, async (req, res) => {
  const hijo = descifrar(req.query.hijo);
  const table_report = descifrar(req.query.report);
  const periodo = req.query.period;
  if (hijo === null || table_report === null)
    return res.send(JSON.stringify(""));
  const [{ ciclo }] = await query(
    "SELECT COALESCE(1, id_ciclo) AS ciclo FROM coordinadores"
  );
  const reportID = await getReportID(hijo, table_report, periodo, ciclo);
  const isAccepted = await query("SELECT * FROM ?? WHERE id = ?", [
    table_report,
    reportID,
  ]);
  if (isAccepted.length === 0 || !isAccepted[0].accepted)
    return res.send(JSON.stringify(""));
  const table_eval =
    table_report == "reporte_parcial" ? "eval_parcial" : "eval_adicional";
  const evals = await query("SELECT * FROM ?? WHERE id_pattern = ?", [
    table_eval,
    reportID,
  ]);
  const doc = new PDFDoc();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=reporte.pdf");
  doc.pipe(res);

  doc
    .font("Helvetica")
    .fontSize(12)
    .text("Ciclo " + date(ciclo) + "\n", 40, 20);

  evals.forEach((eval, index) => {
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(materia(index + 1), { continued: true });
    doc
      .font("Helvetica")
      .fontSize(12)
      .text(" " + eval.texto);
  });

  doc.end();
});

const materia = (num) => {
  if (num == 1) return "Lenguaje y comunicación: ";
  if (num == 2) return "Pensamiento matemático: ";
  if (num == 3) return "Exploración y comprensión del mundo natural y social: ";
  if (num == 4) return "Artes: ";
  if (num == 5) return "Inglés: ";
  if (num == 6) return "Educación fisica: ";
};

const date = (num) => {
  const fecha = new Date();
  var año = fecha.getFullYear();
  var fecha_uno = año - 1;
  var fecha_dos = año + 1;

  if (num == 1) return fecha_uno + "-" + año;
  if (num == 2) return año + "-" + fecha_dos;
};

module.exports = app;
