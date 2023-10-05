const { query } = require("./functions");

async function correctTime(type, id, eval) {
  try {
    let valor =
      type == 1 ? [1, 2, 3, 4] : type == 2 ? [5] : type == 3 ? [6] : null;
    const evaluacion = await query(
      "SELECT * FROM ?? WHERE id_pattern = ? and id_materia IN (?)",
      [eval, id, valor]
    );
    return evaluacion.length > 0;
  } catch (err) {
    throw err;
  }
}

async function getReportID(alumno, table_name, period, cycle) {
  try {
    if (period && cycle) {
      try {
        const [{ id }] = await query(
          "SELECT * FROM ?? WHERE id_alumno = ? AND id_periodo = ? AND id_ciclo = ? ",
          [table_name, alumno, period, cycle]
        );
        return id;
      } catch (err) {
        return 0;
      }
    } else {
      const [{ periodo }] = await query(
        "SELECT COALESCE(id_periodo, 1) AS periodo FROM coordinadores"
      );
      const [{ ciclo }] = await query(
        "SELECT COALESCE(id_ciclo, 1) AS ciclo FROM coordinadores"
      );
      const [{ id }] = await query(
        "SELECT * FROM ?? WHERE id_alumno = ? AND id_periodo = ? AND id_ciclo = ? ",
        [table_name, alumno, periodo, ciclo]
      );
      return id;
    }
  } catch (err) {
    throw err;
  }
}

async function eval(id_pattern, materia, txt, table_name, isInsert) {
  try {
    if (isInsert) {
      const data = await query(
        "INSERT INTO ?? (id_pattern, id_materia, texto) VALUES (?, ?, ?)",
        [table_name, id_pattern, materia, txt]
      );
      return data;
    } else {
      await query(
        "UPDATE ?? SET texto = ? WHERE id_pattern = ? AND id_materia = ?",
        [table_name, txt, id_pattern, materia]
      );
      return;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function hallExists(type, reportID, id_coord, id_teach) {
  try {
    const sala = await query(
      "SELECT * FROM sala_comentarios WHERE type = ? AND reportID = ? AND id_coord = ? AND id_teach = ?",
      [type, reportID, id_coord, id_teach]
    );
    if (sala.length === 0) {
      const id = await query(
        "INSERT INTO sala_comentarios (type, reportID, id_coord, id_teach) VALUES (?, ?, ?, ?)",
        [type, reportID, id_coord, id_teach]
      );
      return id.insertId;
    }
    return sala[0].id;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  correctTime,
  getReportID,
  eval,
  hallExists,
};
