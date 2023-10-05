document.addEventListener("DOMContentLoaded", () => {
  let alumnos = document.getElementById("alumno");
  let periodos = document.getElementById("periodo");
  let ciclos = document.getElementById("ciclo");
  let maestrosList = document.getElementById("maestros");

  alumnos.addEventListener("change", enviar);
  alumnos.addEventListener("change", maestros);
  periodos.addEventListener("change", enviar);
  ciclos.addEventListener("change", enviar);
  maestrosList.addEventListener("change", comentarios);

  function comentarios() {
    const alumno = alumnos.value;
    const maestro = maestrosList.value;
    const periodo = periodos.value;
    const ciclo = ciclos.value;
    const div = document.getElementById("table");
    const table_report = div.dataset.report;
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let response = JSON.parse(xhr.responseText);
        comments(response);
      }
    };
    xhr.open(
      "GET",
      "/comentarios?alumno=" +
        encodeURIComponent(alumno) +
        "&maestro=" +
        encodeURIComponent(maestro) +
        "&report=" +
        encodeURIComponent(table_report) +
        "&periodo=" +
        encodeURIComponent(periodo) +
        "&ciclo=" +
        encodeURIComponent(ciclo),
      true
    );
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.send();
  }

  function maestros() {
    const alumno = alumnos.value;
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let response = JSON.parse(xhr.responseText);
        maestrosDe(response);
      }
    };
    xhr.open("GET", "/maestroDe?alumno=" + encodeURIComponent(alumno), true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.send();
  }

  function enviar() {
    const alumno = alumnos.value;
    const periodo = periodos.value;
    const ciclo = ciclos.value;
    const div = document.getElementById("table");
    const table_report = div.dataset.report;
    const table_eval = div.dataset.eval;

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let response = JSON.parse(xhr.responseText);
        build(response.eval);
        if (!response.accepted.accepted) {
          document.getElementById("accepted").innerHTML = `
          <button onclick="aprobar('${response.accepted.id}')" class="btn btn-success">
            Aprobar
          </button>`;
        } else {
          document.getElementById(
            "accepted"
          ).innerHTML = `<button onclick="desaprobar('${response.accepted.id}')" class="btn btn-danger">
          Desaprobar
        </button>`;
        }
      }
    };
    xhr.open(
      "GET",
      "/reporteC?alumno=" +
        encodeURIComponent(alumno) +
        "&periodo=" +
        encodeURIComponent(periodo) +
        "&ciclo=" +
        encodeURIComponent(ciclo) +
        "&report=" +
        encodeURIComponent(table_report) +
        "&eval=" +
        encodeURIComponent(table_eval),
      true
    );
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.send();
  }
});
