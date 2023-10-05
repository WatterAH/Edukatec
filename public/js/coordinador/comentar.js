document.addEventListener("DOMContentLoaded", () => {
  let alumnos = document.getElementById("alumno");
  let maestrosList = document.getElementById("maestros");
  let button = document.getElementById("comentar");
  let comm = document.getElementById("comentario");

  button.addEventListener("click", () => {
    let alumno = alumnos.value;
    let maestro = maestrosList.value;
    let txt = comm.value;
    const div = document.getElementById("table");
    let table_report = div.dataset.report;
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let response = JSON.parse(xhr.responseText);
        comments(response);
      }
    };
    xhr.open("POST", "/commentC", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.send(
      "alumno=" +
      encodeURIComponent(alumno) +
      "&txt=" +
      encodeURIComponent(txt) +
      "&maestro=" +
      encodeURIComponent(maestro) +
      "&tabla=" +
      encodeURIComponent(table_report)
    );
  });
});
