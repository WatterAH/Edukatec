//IMPORTS
const express = require("express");
const app = require("express")();
const bodyPraser = require("body-parser");
const imports = require("./routes/server/middlewares/imports");

//VIEWS
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

//USES
app.use(express.static("public"));
app.use(bodyPraser.json());
app.use(bodyPraser.urlencoded({ extended: true }));
app.use(imports);
app.use((req, res) => {
  res.status(404).render("server/errores/error404");
});

//STARTING SERVER
const port = process.env.PORT || 8080;
app.listen(app.get("port"), () =>
  console.log("Server started, go to http://localhost:" + port)
);
