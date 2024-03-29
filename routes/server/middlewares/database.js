const fs = require("fs");
const mysql = require("mysql2");

var con = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
  connectionLimit: 10,
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
