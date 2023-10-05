document.addEventListener("DOMContentLoaded", () => {
  let alumnos = document.getElementById("alumno");
  alumnos.addEventListener("change", () => {
    const selected = alumnos.value;
    const div = document.getElementById("table");
    const table_report = div.dataset.report;
    const table_eval = div.dataset.eval;
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let response = JSON.parse(xhr.responseText);
        build(response.eval);
        if (typeof response.accepted == "undefined") {
          document.getElementById("accepted").innerHTML = "";
        } else if (!response.accepted) {
          document.getElementById("accepted").innerHTML =
            "Oops. Aún no aceptan este reporte.";
        } else {
          document.getElementById("accepted").innerHTML =
            "¡Enhorabuena! Se aprobó este reporte.";
        }
      }
    };
    xhr.open(
      "GET",
      "/reporteM?alumno=" +
        encodeURIComponent(selected) +
        "&report=" +
        encodeURIComponent(table_report) +
        "&eval=" +
        encodeURIComponent(table_eval),
      true
    );
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.send();
  });
});
