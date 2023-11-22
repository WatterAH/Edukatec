const fs = require("fs");
const crypto = require("crypto");
const { con } = require("./database");
const clave = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
const jwt = require("jsonwebtoken");
// require("dotenv").config();

const createAccessToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.SECRET, { expiresIn: "1d" }, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};

const authRequired = (entity) => (req, res, next) => {
  validateToken(req.cookies.token, entity)
    .then((token) => next())
    .catch((error) =>
      res.render("server/login", { error: "Debes Iniciar Sesión" })
    );
};

const validateToken = (token, entity) => {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(null);
    }

    jwt.verify(token, process.env.SECRET, (err, user) => {
      if (err) {
        reject(null);
      } else if (user.entity != entity) {
        reject(null);
      }
      resolve(user);
    });
  });
};

const isAjax = (req, res, next) => {
  if (!req.xhr && !req.headers.accept.includes("json")) {
    res.status(403).render("server/errores/error403");
    return;
  }
  next();
};

const language = (req) => {
  const lang = req.cookies.lang || "es";
  const langData = fs.readFileSync("./json/lang.json", "utf-8");
  const langObj = JSON.parse(langData);
  var texts = langObj[lang];
  if (texts === undefined) {
    texts = langObj["es"];
    return texts;
  }
  return texts;
};

const theme = (req) => {
  const theme = req.cookies.theme || "light";
  if (theme == "light") {
    const data = {
      css: "bootstrap.css",
      page: "#bbe5e3",
    };
    return data;
  } else if (theme == "dark") {
    const data = {
      css: "bootstrap-dark.css",
      page: "#004571",
    };
    return data;
  } else {
    const data = {
      css: "bootstrap.css",
      page: "#bbe5e3",
    };
    return data;
  }
};

async function query(sql, values) {
  return new Promise((resolve, reject) => {
    con.query(sql, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

const renderError = (res, err) => {
  res.render("server/errores/error500", { err });
};

const sendMessage = (res, message, route, err) => {
  if (err) {
    console.log(err);
  }
  res.cookie("message", message);
  return res.redirect(route);
};

const showMessage = (res, req) => {
  const message = req.cookies.message;
  res.clearCookie("message");
  return message;
};

// const agrupar = (arreglo, propiedad) => {
//   const current = arreglo[0][propiedad];
//   const result = [];
//   const match = [];
//   for (let i = 0; i < arreglo.length; i++) {
//     if (current != arreglo[i][propiedad]) {
//       result.push(match);
//       match = [];
//       current = arreglo[i][propiedad];
//     }
//     match.push(arreglo[i]);
//   }
//   result.push(match);
//   return result;
// };

const cifrar = (id) => {
  if (typeof id == "number") {
    const cipher = crypto.createCipheriv("aes-256-cbc", clave, iv);
    let idCifrado = cipher.update(String(id), "utf-8", "hex");
    idCifrado += cipher.final("hex");
    return idCifrado;
  } else {
    const cipher = crypto.createCipheriv("aes-256-cbc", clave, iv);
    let txtCifrado = cipher.update(id, "utf-8", "hex");
    txtCifrado += cipher.final("hex");
    return txtCifrado;
  }
};

function descifrar(id) {
  try {
    if (typeof id == "number") {
      const decipher = crypto.createDecipheriv("aes-256-cbc", clave, iv);
      let idDecifrado = decipher.update(id, "hex", "utf-8");
      idDecifrado += decipher.final("utf-8");
      return parseInt(idDecifrado);
    } else {
      const decipher = crypto.createDecipheriv("aes-256-cbc", clave, iv);
      let txtDecifrado = decipher.update(id, "hex", "utf-8");
      txtDecifrado += decipher.final("utf-8");
      return txtDecifrado;
    }
  } catch (err) {
    return null;
  }
}

const generateKey = () => {
  const char =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let pass = "";

  for (let i = 0; i < 8; i++) {
    const index = Math.floor(Math.random() * char.length);
    pass += char.charAt(index);
  }
  return pass;
};

module.exports = {
  language,
  query,
  renderError,
  sendMessage,
  showMessage,
  cifrar,
  descifrar,
  isAjax,
  generateKey,
  theme,
  createAccessToken,
  authRequired,
  validateToken,
};
