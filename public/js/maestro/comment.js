document.addEventListener("DOMContentLoaded", () => {
  let alumno = document.getElementById("alumno");
  let button = document.getElementById("comentar");
  let comm = document.getElementById("comentario");
  let div = document.getElementById("table");
  let tabla = div.dataset.report;

  button.addEventListener("click", () => {
    let selected = alumno.value;
    let txt = comm.value;
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let response = JSON.parse(xhr.responseText);
        comments(response);
      }
    };
    xhr.open("POST", "/commentM", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.send(
      "alumno=" +
        encodeURIComponent(selected) +
        "&txt=" +
        encodeURIComponent(txt) +
        "&tabla=" +
        encodeURIComponent(tabla)
    );
  });
});
