const app = require("express")();
const { con } = require("./middlewares/database");
const { transporter, pass } = require("./middlewares/mail");
const bycriptjs = require("bcryptjs");
const uuid = require("uuid");

app.post("/email-sent", async (req, res) => {
  var mail = req.body.mail;
  var codigo = uuid.v4().substring(1, 11);
  var mailOptions = pass(codigo, mail);

  con.query(
    "SELECT * FROM maestros WHERE mail = ?",
    [mail],
    async (err, maestro) => {
      if (err) {
        console.log(err);
        res.render("server/forgotpass", { error: "Se produjo un error" });
      } else {
        con.query(
          "SELECT * FROM coordinadores WHERE mail = ?",
          [mail],
          async (err, coordinador) => {
            if (err) {
              console.log(err);
              res.render("server/forgotpass", { error: "Se produjo un error" });
            } else if (maestro.length == 0 && coordinador.length == 0) {
              res.render("server/forgotpass", {
                error: "El correo no esta registrado",
              });
            } else {
              con.query(
                "INSERT INTO CODES SET ?",
                { code: codigo, mail: mail },
                async (err) => {
                  if (err) {
                    console.log(err);
                    res.render("server/forgotpass", {
                      error: "Se produjo un error",
                    });
                  } else {
                    res.render("server/forgotpass", {
                      code: "true",
                      mail: mail,
                    });
                    transporter.sendMail(mailOptions, (err) => {
                      if (err) {
                        console.log(err);
                      }
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

app.post("/code-sent", async (req, res) => {
  var mail = req.body.mail;
  var codigo = req.body.code;

  con.query("SELECT * FROM codes WHERE mail = ?", [mail], async (err, code) => {
    if (err) {
      console.log(err);
      res.render("server/forgotpass", { error: "Se produjo un error" });
    } else {
      if (code.length == 0) {
        res.render("server/forgotpass", {
          error: "Codigo incorrecto",
          code: true,
          mail: mail,
        });
      } else if (code[0].code != codigo) {
        res.render("server/forgotpass", {
          error: "Codigo incorrecto",
          code: true,
          mail: mail,
        });
      } else {
        console.log(mail);
        res.render("server/forgotpass", {
          newpass: true,
          mail: mail,
          codigo: codigo,
        });
      }
    }
  });
});

app.post("/pass-sent", async (req, res) => {
  var mail = req.body.mail;
  var pass = req.body.pass;
  var passHaash = await bycriptjs.hash(pass, 8);
  console.log(mail, pass);

  con.query(
    "SELECT * FROM maestros WHERE mail = ?",
    [mail],
    async (err, maestro) => {
      if (err) {
        console.log(err.message);
        res.render("server/register");
      } else {
        con.query(
          "SELECT * FROM coordinadores WHERE mail = ?",
          [mail],
          async (err, coordinador) => {
            if (err) {
              console.log(err.message);
              res.render("server/register");
            } else {
              if (maestro.length > 0) {
                con.query(
                  "UPDATE maestros SET pass = ? WHERE mail = ?",
                  [passHaash, mail],
                  async (err) => {
                    if (err) {
                      console.log(err.message);
                      res.render("server/register");
                    } else {
                      con.query(
                        "DELETE FROM codes WHERE mail = ?",
                        [mail],
                        async (err) => {
                          if (err) {
                            console.log(err.message);
                            res.render("server/register");
                          } else {
                            res.render("server/login");
                          }
                        }
                      );
                    }
                  }
                );
              } else if (coordinador.length > 0) {
                con.query(
                  "UPDATE coordinadores SET pass = ? WHERE mail = ?",
                  [passHaash, mail],
                  async (err) => {
                    if (err) {
                      console.log(err.message);
                      res.render("server/register");
                    } else {
                      con.query(
                        "DELETE FROM codes WHERE mail = ?",
                        [mail],
                        async (err) => {
                          if (err) {
                            console.log(err.message);
                            res.render("server/register");
                          } else {
                            res.render("server/login");
                          }
                        }
                      );
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
});

module.exports = app;
