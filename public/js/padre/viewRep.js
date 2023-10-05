document.addEventListener("DOMContentLoaded", () => {
  const hijos = document.getElementById("hijos");
  hijos.addEventListener("change", send);
  const reportes = document.getElementById("reportes");
  reportes.addEventListener("change", send);
  const periodos = document.getElementById("periodos");
  periodos.addEventListener("change", send);
  const pdf = document.getElementById("pdf");
  pdf.addEventListener("click", generarPDF);

  function send() {
    const hijo = hijos.value;
    const table = reportes.value;
    const period = periodos.value;
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let response = JSON.parse(xhr.responseText);
        build(response);
      }
    };
    xhr.open(
      "GET",
      "/reportParent?hijo=" +
        encodeURIComponent(hijo) +
        "&report=" +
        encodeURIComponent(table) +
        "&period=" +
        encodeURIComponent(period),
      true
    );
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.send();
  }

  function generarPDF() {
    const hijo = hijos.value;
    const table = reportes.value;
    const period = periodos.value;
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let blob = new Blob([xhr.response], { type: "application/pdf" });
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "reporte.pdf";
        link.click();
        window.URL.revokeObjectURL(link.href);
      }
    };
    xhr.open(
      "GET",
      "/pdf?hijo=" +
        encodeURIComponent(hijo) +
        "&report=" +
        encodeURIComponent(table) +
        "&period=" +
        encodeURIComponent(period),
      true
    );
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.responseType = "blob";
    xhr.send();
  }
});

function build(respuesta) {
  var campos = document.getElementsByClassName("notes");
  if (typeof respuesta == "undefined" || respuesta.length == 0) {
    for (let i = 0; i < campos.length; i++) {
      campos[i].innerHTML =
        "¡Vaya! Parece que no hay reportes, ¡Más suerte para la próxima!";
    }
  } else {
    var notes = [];
    for (let i = 1; i <= campos.length; i++) {
      const note = document.getElementById("notes" + i);
      notes.push(note);
    }
    respuesta.forEach((resultado) => {
      switch (resultado.id_materia) {
        case 1:
          notes[resultado.id_materia - 1].innerHTML = resultado.texto;
          break;
        case 2:
          notes[resultado.id_materia - 1].innerHTML = resultado.texto;
          break;
        case 3:
          notes[resultado.id_materia - 1].innerHTML = resultado.texto;
          break;
        case 4:
          notes[resultado.id_materia - 1].innerHTML = resultado.texto;
          break;
        case 5:
          notes[resultado.id_materia - 1].innerHTML = resultado.texto;
          break;
        case 6:
          notes[resultado.id_materia - 1].innerHTML = resultado.texto;
          break;
        default:
          break;
      }
    });
  }
}
