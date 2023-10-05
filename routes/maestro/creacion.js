const app = require("express")();
const {
  logged2,
  descifrar,
  cifrar,
  renderError,
  sendMessage,
  query,
} = require("../server/middlewares/functions");
const {
  getReportID,
  correctTime,
  eval,
} = require("../server/middlewares/helpers");
const { body, validationResult } = require("express-validator");
const { alumnos, grupos } = require("../server/middlewares/querys");
const { con } = require("../server/middlewares/database");

app.post(
  "/reporteP",
  logged2,
  [
    body("alumno").trim().isLength({ min: 1 }),
    body("notesp1")
      .if((value, { req }) => req.session.type === 1)
      .trim()
      .matches(/^[^<>|\\]*$/)
      .isLength({ max: 246 }),
    body("notesp2")
      .if((value, { req }) => req.session.type === 1)
      .trim()
      .matches(/^[^<>A-Za-záéíóúÁÉÍÓÚñÑ\s,.-?!¿¡;"]*$/)
      .isLength({ max: 246 }),
    body("notesp3")
      .if((value, { req }) => req.session.type === 1)
      .trim()
      .matches(/^[^<>A-Za-záéíóúÁÉÍÓÚñÑ\s,.-?!¿¡;"]*$/)
      .isLength({ max: 246 }),
    body("notesp4")
      .if((value, { req }) => req.session.type === 1)
      .trim()
      .matches(/^[^<>A-Za-záéíóúÁÉÍÓÚñÑ\s,.-?!¿¡;"]*$/)
      .isLength({ max: 246 }),
    body("notesp5")
      .if((value, { req }) => req.session.type === 2)
      .trim()
      .matches(/^[^<>A-Za-záéíóúÁÉÍÓÚñÑ\s,.-?!¿¡;"]*$/)
      .isLength({ max: 246 }),
    body("notesp6")
      .if((value, { req }) => req.session.type === 3)
      .trim()
      .matches(/^[^<>A-Za-záéíóúÁÉÍÓÚñÑ\s,.-?!¿¡;"]*$/)
      .isLength({ max: 246 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const valores = req.body;
      const validaciones = errors.array();
      res.render("maestro/reporteP", {
        valores: valores,
        validaciones: validaciones,
        type: req.session.type,
        alumnos: await alumnos(req.session.idM),
        table_report: cifrar("reporte_parcial"),
        table_eval: cifrar("eval_parcial"),
        grupos: await grupos(req.session.idM),
      });
    } else {
      const type = req.session.type;
      const notesp1 = req.body.notesp1;
      const notesp2 = req.body.notesp2;
      const notesp3 = req.body.notesp3;
      const notesp4 = req.body.notesp4;
      const notesp5 = req.body.notesp5;
      const notesp6 = req.body.notesp6;
      const notes = [notesp1, notesp2, notesp3, notesp4, notesp5, notesp6];
      const alumno = descifrar(req.body.alumno);
      if (alumno === null) return res.redirect("reporteP");
      const id = await getReportID(alumno, "reporte_parcial");
      if (!(await correctTime(type, id, "eval_parcial"))) {
        try {
          if (type == 1) {
            for (let i = 1; i <= 4; i++) {
              eval(id, i, notes[i - 1], "eval_parcial", true);
            }
          } else if (type == 2) {
            eval(id, 5, notesp5, "eval_parcial", true);
          } else if (type == 3) {
            eval(id, 6, notesp6, "eval_parcial", true);
          }
        } catch (err) {
          renderError(res, err);
        }
        res.redirect("reporteP");
      } else {
        try {
          if (type == 1) {
            for (let i = 1; i <= 4; i++) {
              eval(id, i, notes[i - 1], "eval_parcial", false);
            }
          } else if (type == 2) {
            eval(id, 5, notesp5, "eval_parcial", false);
          } else if (type == 3) {
            eval(id, 6, notesp6, "eval_parcial", false);
          }
        } catch (err) {
          renderError(res, err);
        }
        res.redirect("reporteP");
      }
    }
  }
);

app.post(
  "/reporteA",
  logged2,
  [
    body("alumno").trim().isLength({ min: 1 }),
    body("notesA1")
      .if((value, { req }) => req.session.type === 1)
      .trim()
      .matches(/^[^<>A-Za-záéíóúÁÉÍÓÚñÑ\s,.-?!¿¡;"]*$/)
      .isLength({ max: 246 }),
    body("notesA2")
      .if((value, { req }) => req.session.type === 1)
      .trim()
      .matches(/^[^<>A-Za-záéíóúÁÉÍÓÚñÑ\s,.-?!¿¡;"]*$/)
      .isLength({ max: 246 }),
    body("notesA3")
      .if((value, { req }) => req.session.type === 1)
      .trim()
      .matches(/^[^<>A-Za-záéíóúÁÉÍÓÚñÑ\s,.-?!¿¡;"]*$/)
      .isLength({ max: 246 }),
    body("notesA4")
      .if((value, { req }) => req.session.type === 1)
      .trim()
      .matches(/^[^<>A-Za-záéíóúÁÉÍÓÚñÑ\s,.-?!¿¡;"]*$/)
      .isLength({ max: 246 }),
    body("notesA5")
      .if((value, { req }) => req.session.type === 2)
      .trim()
      .matches(/^[^<>A-Za-záéíóúÁÉÍÓÚñÑ\s,.-?!¿¡;"]*$/)
      .isLength({ max: 246 }),
    body("notesA6")
      .if((value, { req }) => req.session.type === 3)
      .trim()
      .matches(/^[^<>A-Za-záéíóúÁÉÍÓÚñÑ\s,.-?!¿¡;"]*$/)
      .isLength({ max: 246 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const valores = req.body;
      const validaciones = errors.array();
      res.render("maestro/reporteA", {
        valores: valores,
        validaciones: validaciones,
        type: req.session.type,
        alumnos: await alumnos(req.session.idM),
        table_report: cifrar("reporte_adicional"),
        table_eval: cifrar("eval_adicional"),
        grupos: await grupos(req.session.idM),
      });
    } else {
      const type = req.session.type;
      const notesA1 = req.body.notesA1;
      const notesA2 = req.body.notesA2;
      const notesA3 = req.body.notesA3;
      const notesA4 = req.body.notesA4;
      const notesA5 = req.body.notesA5;
      const notesA6 = req.body.notesA6;
      const notes = [notesA1, notesA2, notesA3, notesA4, notesA5, notesA6];
      const alumno = descifrar(req.body.alumno);
      if (alumno === null) return res.redirect("reporteA");
      const id = await getReportID(alumno, "reporte_adicional");
      if (!(await correctTime(type, id, "eval_adicional"))) {
        try {
          if (type == 1) {
            for (let i = 1; i <= 4; i++) {
              await eval(id, i, notes[i - 1], "eval_adicional", true);
            }
          } else if (type == 2) {
            await eval(id, 5, notesA5, "eval_adicional", true);
          } else if (type == 3) {
            await eval(id, 6, notesA6, "eval_adicional", true);
          }
        } catch (err) {
          return renderError(res, err);
        }
        res.redirect("reporteA");
      } else {
        try {
          if (type == 1) {
            for (let i = 1; i <= 4; i++) {
              await eval(id, i, notes[i - 1], "eval_adicional", false);
            }
          } else if (type == 2) {
            await eval(id, 5, notesA5, "eval_adicional", false);
          } else if (type == 3) {
            await eval(id, 6, notesA6, "eval_adicional", false);
          }
        } catch (err) {
          return renderError(res, err);
        }
        res.redirect("reporteA");
      }
    }
  }
);

app.post(
  "/evaluacion",
  logged2,
  [
    body("alumno").trim().isLength({ min: 1 }),
    body("title")
      .custom((value, { req }) => {
        if (!req.body.notes && !value) {
          throw new Error("El título o las notas deben estar presentes.");
        } else {
          if (value) {
            if (!/^[A-Za-záéíóúÁÉÍÓÚñÑ\s.,¿?!¡"-]+$/.test(value)) {
              throw new Error("");
            } else {
              return true;
            }
          } else {
            return true;
          }
        }
      })
      .trim(),
    body("date").trim().isLength({ min: 1 }),
    body("notes")
      .custom((value, { req }) => {
        if (!req.body.title && !value) {
          throw new Error("El título o las notas deben estar presentes.");
        } else {
          if (value) {
            if (!/^[A-Za-záéíóúÁÉÍÓÚñÑ\s.,¿?!¡"-]+$/.test(value)) {
              throw new Error("");
            } else {
              return true;
            }
          } else {
            return true;
          }
        }
      })
      .trim(),
    body("performance").trim().isInt({ min: 0, max: 3 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const valores = req.body;
      const validaciones = errors.array();
      res.render("maestro/evaluacion", {
        valores: valores,
        validaciones: validaciones,
        alumnos: await alumnos(req.session.idM),
        grupos: await grupos(req.session.idM),
      });
    } else {
      const id_alumno = descifrar(req.body.alumno);
      const title = req.body.title;
      const date = req.body.date;
      const notes = req.body.notes;
      const performance = req.body.performance;
      try {
        const [{ id_periodo }] = await query(
          "SELECT COALESCE(id_periodo, 1) AS id_periodo FROM coordinadores"
        );
        const [{ id_ciclo }] = await query(
          "SELECT COALESCE(id_ciclo, 1) AS id_ciclo FROM coordinadores"
        );

        con.query(
          "INSERT INTO evaluaciones SET ?",
          {
            id_alumno,
            id_ciclo,
            id_periodo,
            performance,
            title,
            date,
            notes,
          },
          async (err) => {
            if (err) return renderError(res, err);
            return res.redirect("evaluacion");
          }
        );
      } catch (err) {
        return renderError(res, err);
      }
    }
  }
);
module.exports = app;
