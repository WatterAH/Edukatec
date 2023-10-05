const { cifrar } = require("../server/middlewares/functions");
const { isAjax, descifrar, query } = require("../server/middlewares/functions");
const { getReportID } = require("../server/middlewares/helpers");
const { evaluaciones, maestroDe } = require("../server/middlewares/querys");

const app = require("express")();

app.get("/reporteC", isAjax, async (req, res) => {
  const alumno = descifrar(req.query.alumno);
  const period = req.query.periodo;
  const cycle = req.query.ciclo;
  const table_report = descifrar(req.query.report);
  const table_eval = descifrar(req.query.eval);

  if (alumno == null || table_report == null || table_eval == null) {
    return res.send(JSON.stringify(""));
  }
  const id_pattern = await getReportID(alumno, table_report, period, cycle);
  const eval = await evaluaciones(id_pattern, [1, 2, 3, 4, 5, 6], table_eval);
  try {
    const [{ accepted }] = await query("SELECT accepted FROM ?? WHERE id = ?", [
      table_report,
      id_pattern,
    ]);
    const data = { eval, accepted: { accepted, id: cifrar(id_pattern) } };
    return res.send(JSON.stringify(data));
  } catch (err) {
    const accepted = 0;
    const data = { eval, accepted: { accepted, id: cifrar(id_pattern) } };
    return res.send(JSON.stringify(data));
  }
});

app.get("/maestroDe", isAjax, async (req, res) => {
  const alumno = descifrar(req.query.alumno);
  if (alumno === null) return res.send(JSON.stringify(""));
  const maestros = await maestroDe(alumno);
  return res.send(JSON.stringify(maestros));
});

// app.get("/buscar", isAjax, async (req, res) => {
//   const searchTerm = req.query.nombre;
//   const param = req.query.param;
//   if (!searchTerm) return res.send(JSON.stringify(entidad));
//   if (param === "grupos") {
//     const entidad = await query("SELECT * FROM grupos");
//     const resultados = entidad.filter((grupo) =>
//       grupo.name.toLowerCase().includes(searchTerm.toLocaleLowerCase())
//     );

//     const data = {
//       resultados: resultados,
//       param: param,
//     };
//     return res.send(JSON.stringify(data));
//   } else if (param === "alumnos") {
//     const entidad = await query("SELECT * FROM alumnos");
//     const get = entidad.filter((alumno) =>
//       alumno.name.toLowerCase().includes(searchTerm.toLocaleLowerCase())
//     );
//     const resultados = get.map((row) => {
//       const id = cifrar(row.id);
//       return { ...row, id: id };
//     });
//     const data = {
//       resultados: resultados,
//       param: param,
//     };
//     return res.send(JSON.stringify(data));
//   } else {
//     const data = {
//       resultados: resultados,
//       param: "Cambios detectados",
//     };
//     return res.send(JSON.stringify(data));
//   }
// });

module.exports = app;
