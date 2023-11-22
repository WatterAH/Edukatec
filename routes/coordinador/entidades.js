const app = require("express")();
const bcryptjs = require("bcryptjs");
const path = require("path");
const xlsx = require("xlsx");
const fileUpload = require("express-fileupload");
const {
  descifrar,
  sendMessage,
  query,
  language,
  cifrar,
  theme,
  authRequired,
} = require("../server/middlewares/functions");
const { con, ejecutarArchivoSql } = require("../server/middlewares/database");

app.use(fileUpload());

app.post("/entidades", authRequired, async (req, res) => {
  const id = descifrar(req.body.id);
  if (id === null) return res.redirect("home_coord");
  const param = req.body.param;
  if (param == "grupos") {
    const get = await query("SELECT * FROM alumnos WHERE grupo = ?", id);
    const entidades = get.map((row) => {
      const id = cifrar(row.id);
      return { ...row, id: id };
    });
    res.render("coordinador/home", {
      entidades: entidades,
      texts: language(req),
      theme: theme(req),
      param: "alumnos",
    });
  } else if (param == "alumnos") {
    const entidades = await query(
      "SELECT * FROM evaluaciones WHERE id_alumno = ?",
      id
    );
    res.render("coordinador/home", {
      entidades: entidades,
      texts: language(req),
      theme: theme(req),
      param: "evals",
    });
  } else {
    res.redirect("home_coord");
  }
});

app.post("/assign", authRequired("coordinador"), async (req, res) => {
  const maestro = descifrar(req.body.maestro);
  const grupo = descifrar(req.body.grupo);
  if (grupo === null || maestro === null)
    return res.status(401).send("¡No modifiques el ID!");
  con.query(
    "SELECT * FROM asignacion_grupos WHERE id_maestro = ? AND id_grupo = ?",
    [maestro, grupo],
    async (err, result) => {
      if (err) {
        return res.status(500).send("Ocurrió un error");
      } else if (result.length > 0) {
        return res.status(401).send("Ya has realizado esta asignación");
      } else {
        con.query(
          "INSERT INTO asignacion_grupos SET ?",
          { id_maestro: maestro, id_grupo: grupo },
          async (err) => {
            if (err) {
              return res.status(500).send("Ocurrió un error");
            } else {
              return res.status(200).send("Asignación exitosa");
            }
          }
        );
      }
    }
  );
});

app.post("/deleteAssign", authRequired("coordinador"), async (req, res) => {
  const maestro = descifrar(req.body.maestro);
  const grupo = descifrar(req.body.grupo);
  if (maestro === null || grupo == null) {
    return res.status(401).send("¡No modifiques el ID!");
  } else {
    con.query(
      "DELETE FROM asignacion_grupos WHERE id_maestro = ? AND id_grupo = ?",
      [maestro, grupo],
      async (err) => {
        return res.status(200).send("Eliminado");
      }
    );
  }
});

app.post("/aprobarRep", authRequired("coordinador"), async (req, res) => {
  const id = descifrar(req.body.id);
  const table = descifrar(req.body.table_report);
  if (id === null || table === null)
    return res.status(401).send("¡No modifiques nada!");
  con.query(
    "UPDATE ?? SET accepted = true WHERE id = ?",
    [table, id],
    async (err) => {
      if (err) return res.status(500).send("Ocurrió un error", err);
      return res.status(200).send("Aprobado");
    }
  );
});

app.post("/desaprobarRep", authRequired("coordinador"), async (req, res) => {
  const id = descifrar(req.body.id);
  const table = descifrar(req.body.table_report);
  if (id === null || table === null)
    return res.status(401).send("¡No modifiques nada!");
  con.query(
    "UPDATE ?? SET accepted = false WHERE id = ?",
    [table, id],
    async (err) => {
      if (err) return res.status(500).send("Ocurrió un error", err);
      return res.status(200).send("Desaprobado");
    }
  );
});

app.post("/deleteCode", authRequired("coordinador"), async (req, res) => {
  const code = req.body.code;
  con.query("DELETE FROM maestros WHERE code = ?", code, async (err) => {
    if (err) return sendMessage(res, "Ocurrió un error", "register_m", err);
    sendMessage(res, "Codigo eliminado", "register_m");
  });
});

app.post("/excelAlumnos", authRequired("coordinador"), async (req, res) => {
  if (!req.files || !req.files.file)
    return sendMessage(res, "Ingresa un archivo", "register_a");
  const file = req.files.file;
  const fileExt = path.extname(file.name);
  if (!fileExt === ".xlsx")
    return sendMessage(res, "Selecciona un archivo excel", "register_a");
  //SE OBTIENEN LAS COLUMNAS Y FILAS
  const workbook = xlsx.read(file.data, { type: "buffer" });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  const data = jsonData
    .slice(1) // Omite la primera fila, asumiendo que es una fila de encabezados
    .map((row) => row.slice(0, 4)) // Toma solo las primeras 4 columnas de cada fila
    .filter((row) => row.some((cell) => cell !== ""));

  //SE CREAN OBJETOS CON LOS ALUMNOS QUE TENGAN ESTRUCTURA CORRECTA
  const entidades = await Promise.all(
    data.map(async (row, index) => {
      // VALIDAMOS NOMBRE, APELLIDO P Y M
      if (
        !/^[A-Za-záéíóúÁÉÍÓÚñÑ\s"-]+$/.test(data[index][0]) ||
        !/^[A-Za-záéíóúÁÉÍÓÚñÑ\s"-]+$/.test(data[index][1]) ||
        !/^[A-Za-záéíóúÁÉÍÓÚñÑ\s"-]+$/.test(data[index][2])
      ) {
        return null;
      }
      const name = data[index][3];
      try {
        const [{ id }] = await query(
          "SELECT id FROM grupos WHERE name = ?",
          name
        );
        const newRow = { ...row, [3]: id };
        const newKeys = ["name", "spaterno", "smaterno", "grupo"];
        const alumno = Object.fromEntries(
          Object.entries(newRow).map(([key, value], i) => [newKeys[i], value])
        );
        const alrExists = await query(
          "SELECT * FROM alumnos WHERE name = ? AND spaterno = ? AND smaterno = ? AND grupo = ?",
          [alumno.name, alumno.spaterno, alumno.smaterno, alumno.grupo]
        );
        if (alrExists.length > 0) {
          return null;
        } else {
          return alumno;
        }
      } catch (err) {
        return null;
      }
    })
  );

  const alumnos = entidades.filter((alumno) => alumno != null);
  const [{ periodo }] = await query(
    "SELECT COALESCE(id_periodo, 1) AS periodo FROM coordinadores"
  );
  const [{ ciclo }] = await query(
    "SELECT COALESCE(id_ciclo, 1) AS ciclo FROM coordinadores"
  );
  alumnos.forEach((alumno) => {
    con.query("INSERT INTO alumnos SET ?", alumno, async (err, result) => {
      if (err) return sendMessage(res, "Ocurrió un error", "register_a", err);
      const datos = {
        id_alumno: result.insertId,
        id_ciclo: ciclo,
        id_periodo: periodo,
      };
      con.query("INSERT INTO reporte_parcial SET ?", datos, async (err) => {
        if (err) {
          return sendMessage(res, "Ocurrió un error", "register_a");
        }
      });
      con.query("INSERT INTO reporte_adicional SET ?", datos, async (err) => {
        if (err) {
          return sendMessage(res, "Ocurrió un error", "register_a");
        }
      });
    });
  });
  return sendMessage(
    res,
    entidades.length +
      " alumnos encontrados, " +
      alumnos.length +
      " agregados.",
    "register_a"
  );
});

/* CHANGE CONSTANTS TO CREATE A TEACHER AND COORDINATOR EXAMPLE */

app.get("/initialize", async (req, res) => {
  ejecutarArchivoSql();
  const pass = "YourPass";
  const mail = "somemail@gmail.com";
  const name = "yourname";
  const lastname = "yourlastname";
  const passHaash = await bcryptjs.hash(pass, 8);

  con.query(
    "INSERT INTO coordinadores SET ?",
    {
      name,
      lastname,
      mail,
      pass: passHaash,
    },
    async (err) => {
      if (err) {
        res.redirect("/");
      } else {
        con.query(
          "INSERT INTO maestros SET ?",
          {
            id_coord: 1,
            name,
            lastname,
            mail,
            pass: passHaash,
            type: 1,
          },
          async (err) => {
            if (err) {
              res.redirect("/");
            } else {
              res.redirect("login");
            }
          }
        );
      }
    }
  );
});

module.exports = app;
