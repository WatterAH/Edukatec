const app = require("express")();
const { con } = require("../server/middlewares/database");
const { logged, query } = require("../server/middlewares/functions");
const { body, validationResult } = require("express-validator");
const bycriptjs = require("bcryptjs");

app.post("/config_lang", logged, async (req, res) => {
  const lang = req.body.lang;
  res.cookie("lang", lang, {
    httpOnly: true,
    maxAge: 315360000,
  });
  res.redirect("Csettings");
});

app.post("/config_theme", logged, async (req, res) => {
  const theme = req.body.tema;
  res.cookie("theme", theme, {
    httpOnly: true,
    maxAge: 315360000,
  });
  res.redirect("Csettings");
});

app.post(
  "/changePassC",
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
      const passHaash = await bycriptjs.hash(pass2, 8);
      const mail = req.session.mail;
      con.query(
        "SELECT * FROM coordinadores WHERE mail = ?",
        [mail],
        async (err, coord) => {
          if (err) return res.status(500).send("Ocurrio un error");
          if (
            coord.length == 0 ||
            !(await bycriptjs.compare(pass1, coord[0].pass))
          ) {
            res.status(401).send("La contraseña anterior no coincide");
          } else {
            con.query(
              "UPDATE coordinadores SET pass = ? WHERE mail = ?",
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

app.post(
  "/periodo",
  logged,
  [body("periodo").isInt({ min: 1, max: 5 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.redirect("Csettings");
    } else {
      const periodo = req.body.periodo;
      const [{ ciclo }] = await query(
        "SELECT COALESCE(id_ciclo, 1) AS ciclo FROM coordinadores"
      );
      con.query(
        "UPDATE coordinadores SET id_periodo = ?",
        [periodo],
        async (err) => {
          if (err) {
            console.log(err);
            res.redirect("Csettings");
          } else {
            con.query("SELECT * FROM ALUMNOS", async (err, alumnos) => {
              if (err) {
                console.log(err);
                res.redirect("Csettings");
              } else {
                for (let i = 0; i < alumnos.length; i++) {
                  const datos = {
                    id_alumno: alumnos[i].id,
                    id_ciclo: ciclo,
                    id_periodo: periodo,
                  };
                  con.query(
                    "INSERT INTO reporte_parcial SET ?",
                    datos,
                    async (err) => {
                      if (err) return res.redirect("Csettings");
                    }
                  );
                  con.query(
                    "INSERT INTO reporte_adicional SET ?",
                    datos,
                    async (err) => {
                      if (err) return res.redirect("Csettings");
                    }
                  );
                }
                res.redirect("Csettings");
              }
            });
          }
        }
      );
    }
  }
);

module.exports = app;
