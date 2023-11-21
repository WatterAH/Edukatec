const app = require("express")();
const bycriptjs = require("bcryptjs");
const { con } = require("../server/middlewares/database");
const { body, validationResult } = require("express-validator");
const { authRequired } = require("../server/middlewares/functions");

app.post("/config_lang", authRequired("maestro"), async (req, res) => {
  const lang = req.body.lang;
  res.cookie("langM", lang, {
    httpOnly: true,
    maxAge: 315360000,
  });
  res.redirect("Csettings");
});

app.post("/config_theme", authRequired("maestro"), async (req, res) => {
  const theme = req.body.tema;
  res.cookie("themeM", theme, {
    httpOnly: true,
    maxAge: 315360000,
  });
  res.redirect("Csettings");
});
app.post(
  "/changePassM",
  [
    body("pass1").trim().isLength({ min: 1 }),
    body("pass2").trim().isLength({ min: 1 }),
  ],
  authRequired("maestro"),
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
        "SELECT * FROM maestros WHERE mail = ?",
        [mail],
        async (err, teach) => {
          if (err) return res.status(500).send("Ocurrio un error");
          if (
            teach.length == 0 ||
            !(await bycriptjs.compare(pass1, teach[0].pass))
          ) {
            res.status(401).send("La contraseña anterior no coincide");
          } else {
            con.query(
              "UPDATE maestros SET pass = ? WHERE mail = ?",
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

module.exports = app;
