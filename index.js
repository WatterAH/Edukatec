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

//VIEWS
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

//STARTING SERVER
app.set("port", process.env.PORT || 3000);
app.listen(app.get("port"), () =>
  console.log("Server started, go to http://localhost:" + app.get("port"))
);
