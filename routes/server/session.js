const app = require("express")();
const bcryptjs = require("bcryptjs");
const session = require("express-session");
const cookie = require("cookie-parser");
const { con } = require("./middlewares/database");
const { body, validationResult } = require("express-validator");
const { renderError, createAccessToken } = require("./middlewares/functions");

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
                        const token = await createAccessToken({
                          id: padre[0].id,
                          entity: "padre",
                        });
                        res.cookie("token", token);
                        req.session.loggedin3 = true;
                        req.session.idP = padre[0].id;
                        req.session.idC = padre[0].id_coord;
                        res.redirect("home_parent");
                      }
                    }
                  );
                } else {
                  const token = await createAccessToken({
                    id: maestro[0].id,
                    entity: "maestro",
                  });
                  res.cookie("token", token);
                  req.session.idM = maestro[0].id;
                  req.session.idC = maestro[0].id_coord;
                  res.redirect("home_teach");
                }
              }
            );
          } else {
            const token = await createAccessToken({
              id: coordinador[0].id,
              entity: "coordinador",
            });
            res.cookie("token", token);
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
  res.cookie("token", "", { expires: new Date() });
  res.redirect("login");
});

module.exports = app;
