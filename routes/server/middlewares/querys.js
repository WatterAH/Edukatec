const { query, cifrar } = require("./functions");

async function codes() {
  try {
    const codes = await query(
      "SELECT code FROM maestros WHERE code IS NOT NULL"
    );
    return codes;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function grupos(id) {
  try {
    if (id) {
      const get = await query(
        "SELECT grupos. * FROM asignacion_grupos JOIN grupos ON asignacion_grupos.id_grupo = grupos.id WHERE asignacion_grupos.id_maestro = ?",
        id
      );
      const grupos = get.map((row) => {
        const id = cifrar(row.id);
        return { ...row, id: id };
      });
      return grupos;
    } else {
      const get = await query("SELECT * FROM grupos");
      const grupos = get.map((row) => {
        const id = cifrar(row.id);
        return { ...row, id: id };
      });
      return grupos;
    }
  } catch (err) {
    throw err;
  }
}

async function maestros() {
  try {
    const get = await query("SELECT * FROM maestros WHERE code IS NULL");
    const maestros = get.map((row) => {
      const id = cifrar(row.id);
      return { ...row, id: id };
    });
    return maestros;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function alumnos(id) {
  try {
    if (id) {
      const get = await query(
        "SELECT alumnos.* FROM alumnos JOIN grupos ON alumnos.grupo = grupos.id JOIN asignacion_grupos ON grupos.id = asignacion_grupos.id_grupo WHERE asignacion_grupos.id_maestro = ?",
        id
      );
      const alumnos = get.map((row) => {
        const id = cifrar(row.id);
        return { ...row, id: id };
      });
      return alumnos;
    } else {
      const get = await query("SELECT * FROM alumnos");
      const alumnos = get.map((row) => {
        const id = cifrar(row.id);
        return { ...row, id: id };
      });
      return alumnos;
    }
  } catch (err) {
    throw err;
  }
}

async function hijos(id, isHome) {
  try {
    if (isHome) {
      const hijos = await query(
        "SELECT p.id AS ID_Padre, a.name, a.spaterno, a.smaterno, g.name AS grupo, m.name AS maestro, m.lastname, m.mail, m.type FROM padres AS p JOIN asignacion_hijos AS ah ON p.id = ah.id_padre JOIN alumnos AS a ON ah.id_hijo = a.id JOIN grupos AS g ON a.grupo = g.id JOIN asignacion_grupos AS ag ON g.id = ag.id_grupo JOIN maestros AS m ON ag.id_maestro = m.id WHERE p.id = ?",
        id
      );
      return hijos;
    } else {
      const get = await query(
        "SELECT alumnos.* FROM asignacion_hijos JOIN alumnos ON asignacion_hijos.id_hijo = alumnos.id WHERE asignacion_hijos.id_padre = ?",
        id
      );
      const hijos = get.map((row) => {
        const id = cifrar(row.id);
        return { ...row, id: id };
      });
      return hijos;
    }
  } catch (err) {
    throw err;
  }
}

async function asignacion() {
  try {
    const get = await query(
      "SELECT maestros.id AS id_maestro, grupos.id AS id_grupo, maestros.name, maestros.lastname, grupos.name AS nombre_grupo FROM asignacion_grupos LEFT JOIN maestros ON maestros.id = asignacion_grupos.id_maestro LEFT JOIN grupos ON grupos.id = asignacion_grupos.id_grupo"
    );
    const grupos = get.map((row) => {
      const id_maestro = cifrar(row.id_maestro);
      return { ...row, id_maestro: id_maestro };
    });
    return grupos;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function comments(id_pattern) {
  try {
    const comentarios = await query(
      "SELECT * FROM comentarios WHERE id_pattern = ?",
      id_pattern
    );
    return comentarios;
  } catch (err) {
    throw err;
  }
}

async function evaluaciones(id_pattern, materias, table) {
  try {
    const eval = await query(
      "SELECT * FROM ?? WHERE id_pattern = ? AND id_materia IN (?)",
      [table, id_pattern, materias]
    );
    return eval;
  } catch (err) {
    throw err;
  }
}

async function maestroDe(id) {
  try {
    const get = await query(
      "SELECT m.* FROM maestros m JOIN asignacion_grupos ag ON m.id = ag.id_maestro JOIN alumnos a ON ag.id_grupo = a.grupo WHERE a.id = ?",
      id
    );
    const maestros = get.map((row) => {
      const id = cifrar(row.id);
      return { ...row, id: id };
    });
    return maestros;
  } catch (err) {
    throw err;
  }
}

async function tiempos() {
  try {
    const [{ id_periodo }] = await query(
      "SELECT id_periodo FROM coordinadores"
    );
    return id_periodo;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  codes,
  grupos,
  maestros,
  asignacion,
  alumnos,
  tiempos,
  comments,
  evaluaciones,
  maestroDe,
  hijos,
};
