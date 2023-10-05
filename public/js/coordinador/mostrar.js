function build(resultados) {
  var campos = document.getElementsByClassName("notes");
  var comentarios = document.getElementById("comments");
  var maestros = document.getElementById("maestros");
  comentarios.innerHTML = "Seleccione un maestro.";
  maestros.selectedIndex = 0;
  if (typeof resultados == "undefined") {
    document.getElementById("accepted").innerHTML = "";
    for (let i = 0; i < campos.length; i++) {
      campos[i].innerHTML =
        "Selecciona un alumno, ¡si hay información aquí aparecerá su desempeño!";
    }
  } else if (resultados.length == 0) {
    for (let i = 0; i < campos.length; i++) {
      campos[i].innerHTML =
        "Parece que aún no se ha proporcionado información sobre este alumno.";
    }
  } else {
    var notes = [];
    for (let i = 1; i <= campos.length; i++) {
      const note = document.getElementById("notes" + i);
      notes.push(note);
    }
    resultados.forEach((resultado) => {
      switch (resultado.id_materia) {
        case 1:
          notes[resultado.id_materia - 1].innerHTML = resultado.texto
            ? resultado.texto
            : "Sin información. Puedes esperar, ¡o enviar un mensaje!";
          break;
        case 2:
          notes[resultado.id_materia - 1].innerHTML = resultado.texto
            ? resultado.texto
            : "Sin información. Puedes esperar, ¡o enviar un mensaje!";
          break;
        case 3:
          notes[resultado.id_materia - 1].innerHTML = resultado.texto
            ? resultado.texto
            : "Sin información. Puedes esperar, ¡o enviar un mensaje!";
          break;
        case 4:
          notes[resultado.id_materia - 1].innerHTML = resultado.texto
            ? resultado.texto
            : "Sin información. Puedes esperar, ¡o enviar un mensaje!";
          break;
        case 5:
          notes[resultado.id_materia - 1].innerHTML = resultado.texto
            ? resultado.texto
            : "Sin información. Puedes esperar, ¡o enviar un mensaje!";
          break;
        case 6:
          notes[resultado.id_materia - 1].innerHTML = resultado.texto
            ? resultado.texto
            : "Sin información. Puedes esperar, ¡o enviar un mensaje!";
          break;
        default:
          break;
      }
    });
  }
}

function maestrosDe(resultados) {
  let maestros = document.getElementById("maestros");
  while (maestros.options.length > 1) {
    maestros.remove(1);
  }
  if (!resultados || resultados.length == 0) {
    while (maestros.options.length > 1) {
      maestros.remove(1);
    }
  } else {
    resultados.forEach((resultado) => {
      let option = document.createElement("option");
      option.value = resultado.id;
      option.text = resultado.name + " " + resultado.lastname;
      maestros.appendChild(option);
    });
  }
}

function comments(resultados) {
  var comentarios = document.getElementById("comments");
  if (!resultados || resultados.length == 0) {
    comentarios.innerHTML = "No hay comentarios.";
  } else {
    comentarios.innerHTML = "";
    for (let i = 0; i < resultados.length; i++) {
      const tipo = resultados[i].sender == 1 ? "Tú" : "Maestro";
      comentarios.innerHTML += `<b>${tipo}</b> <small class="text-muted">${resultados[i].date}</small><br />
          <p>${resultados[i].txt}</p>`;
    }
  }
}

function mostrarGrupos(resultados) {
  var resultadosDiv = document.getElementById("resultados");

  var html = "";
  if (resultados.length > 0) {
    resultados.forEach((grupo) => {
      html += `<div class="col-sm-6 col-md-4 col-lg-3 col-xl-2">
                  <a href="#" onclick="handleClick('<%= grupos[i].name %>', '<%= grupos[i].id %>')">
                    <div class="card bg-warning mb-3">
                      <h4 class="card-text text-center">
                        <br /><br />
                        ${grupo.name}<br />
                        <br /><br />
                      </h4>
                    </div>
                  </a>
                </div>`;
    });
  }
  resultadosDiv.innerHTML = html;
}

function mostrarAlumnos(resultados) {
  var resultadosDiv = document.getElementById("resultados");

  var html = "";
  if (resultados.length > 0) {
    resultados.forEach((alumno) => {
      html += `<div class="col-sm-6 col-lg-4 col-xl-3" id="resultados">
        <a>
          <div
            class="card bg-warning"
            data-aos="fade-down"
            data-aos-duration="<%= (i + 1) * 150 %>"
            onclick="handleClick('${alumno.name}', '${alumno.id}')"
          >
            <div class="card-body text-center mb-3">
              <img
                src="img/alumno.png"
                widht="150px"
                height="150px"
                class="mb-1"
              /><br />
              <strong>
                ${alumno.name} ${alumno.spaterno} ${alumno.smaterno}<br />
              </strong>
            </div>
          </div>
        </a>
      </div>`;
    });
  } else {
    html = `<h1 class="text-center">Sin alumnos</h1>`;
  }
  resultadosDiv.innerHTML = html;
}

const aprobar = (id) => {
  const div = document.getElementById("table");
  const table_report = div.dataset.report;
  Swal.fire({
    title: "Aprobar",
    text: "¿Deseas aprobar este reporte?",
    showCancelButton: true,
    confirmButtonText: "Cambiar",
  }).then((result) => {
    if (result.isConfirmed) {
      data = {
        id,
        table_report,
      };
      return fetch("/aprobarRep", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((response) => {
        if (!response.ok) {
          response.text().then((text) => {
            Swal.fire({
              text: text,
              icon: "error",
            });
          });
        } else {
          response.text().then((text) => {
            Swal.fire({
              text: text,
              icon: "success",
            });
          });
          document.getElementById(
            "accepted"
          ).innerHTML = `<button onclick="desaprobar('${id}')" class="btn btn-danger">
          Desaprobar
        </button>`;
        }
      });
    }
  });
};

const desaprobar = (id) => {
  const div = document.getElementById("table");
  const table_report = div.dataset.report;
  Swal.fire({
    title: "Desprobar",
    text: "¿Deseas quitar la aprobación a este reporte?",
    showCancelButton: true,
    confirmButtonText: "Cambiar",
  }).then((result) => {
    if (result.isConfirmed) {
      data = {
        id,
        table_report,
      };
      return fetch("/desaprobarRep", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((response) => {
        if (!response.ok) {
          response.text().then((text) => {
            Swal.fire({
              text: text,
              icon: "error",
            });
          });
        } else {
          response.text().then((text) => {
            Swal.fire({
              text: text,
              icon: "success",
            });
          });
          document.getElementById("accepted").innerHTML = `
          <button onclick="aprobar('${id}')" class="btn btn-success">
            Aprobar
          </button>`;
        }
      });
    }
  });
};
