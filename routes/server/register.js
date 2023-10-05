const app = require("express")();
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const { con } = require("./middlewares/database");

const passwordsMatch = (value, { req }) => {
  if (value !== req.body.pass2) {
    throw new Error("Las contraseñas no coinciden");
  } else {
    return true;
  }
};
const code = (value) => {
  const one = value.substring(0, 7);
  const two = value.substring(8, 10);
  if (
    value.indexOf("-") !== 7 ||
    !validator.isAlphanumeric(one) ||
    !validator.isAlphanumeric(two) ||
    value.length !== 10 ||
    one.length !== 7 ||
    two.length !== 2
  ) {
    throw new Error("El codigo no es correcto");
  } else {
    return true;
  }
};

app.post(
  "/register",
  [
    body("name", "Ingresa un nombre valido").trim().isAlpha(),
    body("lastname", "Ingresa un apellido valido").trim().isAlpha(),
    body("mail", "Ingresa un email valido").trim().isEmail(),
    body("pass", "Las contraseñas no coinciden")
      .trim()
      .isStrongPassword({
        minLength: 7,
        minLowercase: 0,
        minUppercase: 0,
        minNumbers: 0,
        minSymbols: 0,
      })
      .custom(passwordsMatch),
    body("code").trim().custom(code),
    body("type").trim().isInt({ min: 1, max: 3 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const valores = req.body;
      const validaciones = errors.array();
      res.render("server/register", {
        valores: valores,
        validaciones: validaciones,
      });
    } else {
      const name = req.body.name;
      const lastname = req.body.lastname;
      const mail = req.body.mail;
      const pass = req.body.pass;
      const passHaash = await bcryptjs.hash(pass, 8);
      const codigo = req.body.code;
      const type = req.body.type;
      const valores = {
        name: name,
        lastname: lastname,
        mail: mail,
        pass: pass,
        code: codigo,
      };

      con.query(
        "SELECT code FROM maestros WHERE mail = ?",
        [mail],
        async (err, code) => {
          if (err) {
            console.log(err);
            res.render("server/register");
          } else {
            if (code.length == 0) {
              res.render("server/register", {
                code_error: "true",
                valores: valores,
              });
            } else if (code[0].code != codigo) {
              res.render("server/register", {
                code_error: "true",
                valores: valores,
              });
            } else {
              con.query(
                "UPDATE maestros SET name = ?, lastname = ?, pass = ?, type = ?, code =  null WHERE mail = ?",
                [name, lastname, passHaash, type, mail],
                async (err) => {
                  if (err) {
                    console.log(err);
                    res.render("server/register");
                  } else {
                    res.redirect("login");
                  }
                }
              );
            }
          }
        }
      );
    }
  }
);

module.exports = app;
