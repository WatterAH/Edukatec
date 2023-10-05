const app = require("express")();
const fs = require("fs");
const mysql = require("mysql2");
const database = "users";

var config = {
  host: "localhost",
  user: "Watter",
  password: "takemebacktola",
  database: database,
  port: 3306,
};

var data = {
  host: "localhost",
  user: "root",
  password: "n0m3l0",
  database: database,
  port: 3308,
};

var con = mysql.createConnection(config);

con.connect((err) => {
  if (err) {
    return console.log(err.code);
  }
  console.log("Successful connection with '" + database + "'");
});

const ejecutarArchivoSql = () => {
  const contenidoSql = fs.readFileSync("./database/db.sql", "utf-8");
  const consultas = contenidoSql
    .split(";")
    .filter((consulta) => consulta.trim() !== "");
  consultas.forEach((consulta) => {
    try {
      con.query(consulta);
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports = {
  con,
  ejecutarArchivoSql,
};
