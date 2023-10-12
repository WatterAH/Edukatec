const app = require("express")();
const bcryptjs = require("bcryptjs");
const session = require("express-session");
const cookie = require("cookie-parser");
const { con } = require("./middlewares/database");
const { body, validationResult } = require("express-validator");
const { renderError } = require("./middlewares/functions");

app.set("trust proxy", 1);

app.use(cookie());
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: true,
    },
  })
);

app.post(
  "/auth",
  [
    body("mail", "Ingresa un email valido").isEmail(),
    body("pass", "Ingresa una contraseña").isLength({ min: 1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const valores = req.body;
      const validaciones = errors.array();
      res.render("server/login", {
        valores: valores,
        validaciones: validaciones,
      });
    } else {
      const mail = req.body.mail;
      const pass = req.body.pass;
      con.query(
        "SELECT * FROM coordinadores WHERE mail = ?",
        [mail],
        async (err, coordinador) => {
          if (err) return renderError(res, err);
          if (
            coordinador.length == 0 ||
            !(await bcryptjs.compare(pass, coordinador[0].pass))
          ) {
            con.query(
              "SELECT * FROM maestros WHERE mail = ?",
              [mail],
              async (err, maestro) => {
                if (err) return renderError(res, err);
                if (
                  maestro.length == 0 ||
                  !(await bcryptjs.compare(pass, maestro[0].pass))
                ) {
                  con.query(
                    "SELECT * FROM padres WHERE mail = ?",
                    [mail],
                    async (err, padre) => {
                      if (err) return renderError(res, err);
                      if (
                        padre.length == 0 ||
                        !(await bcryptjs.compare(pass, padre[0].pass))
                      ) {
                        res.render("server/login", {
                          error: "Datos incorrectos",
                        });
                      } else {
                        req.session.loggedin3 = true;
                        req.session.idP = padre[0].id;
                        req.session.mail = padre[0].mail;
                        req.session.idC = padre[0].id_coord;
                        res.redirect("home_parent");
                      }
                    }
                  );
                } else {
                  req.session.loggedin2 = true;
                  req.session.name = maestro[0].name;
                  req.session.lastname = maestro[0].lastname;
                  req.session.mail = maestro[0].mail;
                  req.session.idM = maestro[0].id;
                  req.session.idC = maestro[0].id_coord;
                  req.session.type = maestro[0].type;
                  res.redirect("home_teach");
                }
              }
            );
          } else {
            req.session.loggedin = true;
            req.session.name = coordinador[0].name;
            req.session.lastname = coordinador[0].lastname;
            req.session.mail = coordinador[0].mail;
            req.session.idC = coordinador[0].id;
            res.redirect("home_coord");
          }
        }
      );
    }
  }
);

//CERRAR SESION
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("login");
  });
});

module.exports = app;
