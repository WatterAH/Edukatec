document.addEventListener("DOMContentLoaded", () => {
  let grupos = document.getElementById("grupos");
  grupos.addEventListener("change", () => {
    const selected = grupos.value;
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let response = JSON.parse(xhr.responseText);
        show(response);
      }
    };
    xhr.open(
      "GET",
      "/alumnosGrupo?grupo=" + encodeURIComponent(selected),
      true
    );
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.send();
  });
});

function show(resultados) {
  let alumnos = document.getElementById("alumno");
  alumnos.length = 0;
  let def = document.createElement("option");
  def.value = "";
  def.text = "Alumno";
  alumnos.appendChild(def);
  resultados.forEach((alumno) => {
    let option = document.createElement("option");
    option.text = alumno.name + " " + alumno.spaterno;
    option.value = alumno.id;
    alumnos.appendChild(option);
  });
}
