const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "tlahuel.mendez.samuel.oswaldo@gmail.com",
    pass: "smtebgyhtxezhmpv",
  },
});

const options = (code, mail) => {
  const contenido = `
  <html>
    <head>
      <style>
        .card {
          background-color: #bbe5e3;
          border-radius: 10px;
          padding: 20px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <p>
          Se ha generado un codigo para la creación de una cuenta en nuestros servicios. <br />
          Usa este correo a la hora de llenar el formulario. <br />
          Código: <strong>${code}</strong>
        </p>
      </div>
    </body>
  </html>
  `;
  const mailOptions = {
    from: "Minerva",
    to: mail,
    subject: "Nueva cuenta",
    html: contenido,
  };
  return mailOptions;
};

const pass = (code, mail) => {
  const contenido = `
  <html>
    <head>
      <style>
        .card {
          background-color: #bbe5e3;
          border-radius: 10px;
          padding: 20px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <p>
          Solicitaste un código de recuperación de contraseña para este usuario en nuestros servicios. <br />
          Si no fuiste tú, puedes ignorar este correo. <br />
          Codigo: ${code}
        </p>
      </div>
    </body>
  </html>
  `;
  const mailOptions = {
    from: "Minerva",
    to: mail,
    subject: "Recuperación de contraseña",
    html: contenido,
  };
  return mailOptions;
};

module.exports = {
  transporter: transporter,
  options: options,
  pass: pass,
};
