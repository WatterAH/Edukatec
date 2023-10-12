//IMPORTS
const express = require("express");
const app = express();
const bodyPraser = require("body-parser");
const path = require("path");
const imports = require("./routes/server/middlewares/imports");

//USES
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "json")));
app.use(bodyPraser.json());
app.use(bodyPraser.urlencoded({ extended: true }));
app.use(imports);
app.use((req, res) => {
  res.status(404).render("server/errores/error404");
});
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//VIEWS
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.set("trust proxy", 1); // Confía en el encabezado X-Forwarded-* del proxy

//STARTING SERVER
app.set("port", process.env.PORT || 8080);
app.listen(app.get("port"), () =>
  console.log("Server started, go to http://localhost:" + app.get("port"))
);
