document.addEventListener("DOMContentLoaded", () => {
  const alumno = document.getElementById("alumno");
  const div = document.getElementById("table");
  const table_report = div.dataset.report;
  const table_eval = div.dataset.eval;
  alumno.addEventListener("change", () => {
    const selected = alumno.value;
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        escribir(response.eval);
        comments(response.comentarios);
      }
    };
    xhr.open(
      "GET",
      "/recuperar?alumno=" +
        encodeURIComponent(selected) +
        "&report=" +
        encodeURIComponent(table_report) +
        "&eval=" +
        encodeURIComponent(table_eval),
      true
    );
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest"); // Agrega este encabezado
    xhr.send();
  });
});
