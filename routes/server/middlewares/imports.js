const app = require("express")();

//SESION
const session = require("../session");
app.use(session);

//AUTH
const auth_teach = require("../../maestro/auth");
const auth_coord = require("../../coordinador/auth");
const auth_parent = require("../../padre/auth");
app.use(auth_teach);
app.use(auth_coord);
app.use(auth_parent);

//RUTAS
const rutas_server = require("../rutas");
app.use(rutas_server);

//COORDINADOR
const entidades = require("../../coordinador/entidades");
const registros = require("../../coordinador/registros");
const verC = require("../../coordinador/ver");
const commentC = require("../../coordinador/comentarios");
const settings = require("../../coordinador/settings");
app.use(settings);
app.use(entidades);
app.use(registros);
app.use(verC);
app.use(commentC);

//MAESTRO
const creacion = require("../../maestro/creacion");
const verM = require("../../maestro/ver");
const commentM = require("../../maestro/comentarios");
const gpt = require("../../maestro/GPT");
const settingsM = require("../../maestro/settings");
app.use(gpt);
app.use(creacion);
app.use(verM);
app.use(commentM);
app.use(settingsM);

//PADRE
const padre = require("../../padre/methods");
app.use(padre);

//REGISTER
const register = require("../register");
app.use(register);

//FORGOT PASS
const forgotpass = require("../password");
app.use(forgotpass);

module.exports = app;
