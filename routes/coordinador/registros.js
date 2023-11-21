const app = require("express")();
const uuid = require("uuid");
const bycriptjs = require("bcryptjs");
const {
  sendMessage,
  descifrar,
  query,
  language,
  generateKey,
  theme,
  authRequired,
} = require("../server/middlewares/functions");
const { transporter, options } = require("../server/middlewares/mail");
const { body, validationResult } = require("express-validator");
const { codes, grupos, alumnos } = require("../server/middlewares/querys");
const { con } = require("../server/middlewares/database");

app.post(
  "/register_m",
  authRequired("coordinador"),
  [body("tmail").isEmail().trim()],
  async (req, res) => {
    const errors = validationResult(req);
    const validaciones = errors.array();
    const valores = req.body;
    if (!errors.isEmpty()) {
      return res.render("coordinador/register_m", {
        codes: await codes(),
        validaciones: validaciones,
        valores: valores,
        texts: language(req),
        theme: theme(req),
      });
    } else {
      const mail = req.body.tmail;
      const code = uuid.v4().substring(1, 11);
      const mailOptions = options(code, mail);

      con.query(
        "SELECT * FROM maestros WHERE mail = ?",
        [mail],
        async (err, maestro) => {
          if (err)
            return sendMessage(res, "Ocurrió un error", "register_m", err);
          con.query(
            "SELECT * FROM coordinadores WHERE mail = ?",
            [mail],
            async (err, coordinador) => {
              if (err)
                return sendMessage(res, "Ocurrió un error", "register_m", err);
              else if (maestro.length > 0 || coordinador.length > 0) {
                return sendMessage(
                  res,
                  "El correo ya existe",
                  "register_m",
                  err
                );
              } else {
                con.query(
                  "INSERT INTO maestros SET ?",
                  {
                    id_coord: req.session.idC,
                    mail,
                    code,
                  },
                  async (err) => {
                    if (err)
                      return sendMessage(
                        res,
                        "Ocurrió un error",
                        "register_m",
                        err
                      );
                    return sendMessage(res, "Correo enviado", "register_m");
                  }
                );
              }
              transporter.sendMail(mailOptions, (err) => {
                if (err) {
                  console.log(err);
                }
              });
            }
          );
        }
      );
    }
  }
);

app.post(
  "/register_g",
  [
    body("group")
      .trim()
      .matches(/^[a-zA-Z0-9-_]+$/),
  ],
  authRequired("coordinador"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendMessage(res, "Ingresa un grupo valido", "register_g");
    } else {
      const gname = req.body.group;
      con.query(
        "SELECT * FROM grupos WHERE name = ?",
        [gname],
        async (err, grupos) => {
          if (err) {
            return sendMessage(res, "Ocurrió un error", "register_g", err);
          }
          if (grupos.length > 0) {
            return sendMessage(
              res,
              "Ya registraste este grupo",
              "register_g",
              err
            );
          }
          con.query(
            "INSERT INTO grupos SET ?",
            { name: gname },
            async (err) => {
              if (err) {
                return sendMessage(res, "Ocurrió un error", "register_g", err);
              }
              sendMessage(res, "Registro exitoso", "register_g");
            }
          );
        }
      );
    }
  }
);

app.post(
  "/register_a",
  authRequired("coordinador"),
  [
    body("sname")
      .trim()
      .matches(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s"]+$/),
    body("spaterno")
      .trim()
      .matches(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s"]+$/),
    body("smaterno")
      .trim()
      .matches(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s"]+$/),
    body("sgrupo").trim().isLength({ min: 1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validaciones = errors.array();
      const valores = req.body;
      res.render("coordinador/register_a", {
        grupos: await grupos(),
        valores: valores,
        validaciones: validaciones,
        texts: language(req),
        theme: theme(req),
      });
    } else {
      const name = req.body.sname;
      const spaterno = req.body.spaterno;
      const smaterno = req.body.smaterno;
      const grupo = descifrar(req.body.sgrupo);
      const [{ periodo }] = await query(
        "SELECT COALESCE(id_periodo, 1) AS periodo FROM coordinadores"
      );
      const [{ ciclo }] = await query(
        "SELECT COALESCE(id_ciclo, 1) AS ciclo FROM coordinadores"
      );
      if (grupo === null)
        return sendMessage(res, "No modifiques el ID!", "register_a");

      con.query(
        "INSERT INTO alumnos SET ?",
        { name: name, spaterno: spaterno, smaterno: smaterno, grupo: grupo },
        async (err, alumno) => {
          if (err) {
            return sendMessage(res, "Ocurrió un error", "register_a");
          } else {
            const datos = {
              id_alumno: alumno.insertId,
              id_ciclo: ciclo,
              id_periodo: periodo,
            };
            con.query(
              "INSERT INTO reporte_parcial SET ?",
              datos,
              async (err) => {
                if (err) {
                  return sendMessage(res, "Ocurrió un error", "register_a");
                }
              }
            );
            con.query(
              "INSERT INTO reporte_adicional SET ?",
              datos,
              async (err) => {
                if (err) {
                  return sendMessage(res, "Ocurrió un error", "register_a");
                }
              }
            );
            return sendMessage(res, "Alumno registrado", "register_a");
          }
        }
      );
    }
  }
);

app.post(
  "/register_p",
  [body("mail").trim().isEmail(), body("hijos").isLength({ min: 1 })],
  authRequired("coordinador"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validaciones = errors.array();
      const valores = req.body;
      res.render("coordinador/register_p", {
        grupos: await grupos(),
        alumnos: await alumnos(),
        valores: valores,
        validaciones: validaciones,
        texts: language(req),
        theme: theme(req),
      });
    } else {
      const mail = req.body.mail;
      const hijosCifrados = req.body.hijos;
      const hijos = hijosCifrados.map((row) => {
        const id = descifrar(row);
        if (id === null) {
          return sendMessage(res, "No cambies los ID", "register_p", err);
        } else {
          return id;
        }
      });
      const pass = generateKey();
      const passHaash = await bycriptjs.hash(pass, 8);
      console.log(pass);
      con.query(
        "SELECT * FROM maestros WHERE mail = ?",
        [mail],
        async (err, maestro) => {
          if (err)
            return sendMessage(res, "Ocurrió un error", "register_p", err);
          con.query(
            "SELECT * FROM coordinadores WHERE mail = ?",
            [mail],
            async (err, coordinador) => {
              if (err)
                return sendMessage(res, "Ocurrió un error", "register_p", err);
              con.query(
                "SELECT * FROM padres WHERE mail = ?",
                [mail],
                async (err, padre) => {
                  if (err)
                    return sendMessage(
                      res,
                      "Ocurrió un error",
                      "register_p",
                      err
                    );
                  if (
                    maestro.length > 0 ||
                    coordinador.length > 0 ||
                    padre.length > 0
                  ) {
                    return sendMessage(
                      res,
                      "El correo ya existe",
                      "register_p"
                    );
                  }
                  con.query(
                    "INSERT INTO padres SET ?",
                    {
                      id_coord: req.session.idC,
                      mail: mail,
                      pass: passHaash,
                    },
                    async (err, result) => {
                      if (err)
                        return sendMessage(
                          res,
                          "Ocurrió un error",
                          "register_p",
                          err
                        );
                      const id = result.insertId;
                      for (let i = 0; i < hijos.length; i++) {
                        con.query(
                          "INSERT INTO asignacion_hijos SET ?",
                          {
                            id_padre: id,
                            id_hijo: hijos[i],
                          },
                          async (err) => {
                            if (err)
                              return sendMessage(
                                res,
                                "Ocurrió un error",
                                "register_p",
                                err
                              );
                          }
                        );
                      }
                      return sendMessage(res, "Padre creado", "register_p");
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  }
);

module.exports = app;
