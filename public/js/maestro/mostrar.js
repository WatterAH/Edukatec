function escribir(resultados) {
  var textAreas = document.getElementsByTagName("textarea");
  if (!resultados || resultados.length == 0) {
    for (let i = 0; i < textAreas.length; i++) {
      textAreas[i].value = "";
    }
  } else if (resultados.length == 4) {
    var notes = [];
    for (let i = 1; i <= textAreas.length; i++) {
      const note = document.getElementById("notes" + i);
      notes.push(note);
    }
    resultados.forEach((resultado) => {
      switch (resultado.id_materia) {
        case 1:
          notes[resultado.id_materia - 1].value = resultado.texto;
          break;
        case 2:
          notes[resultado.id_materia - 1].value = resultado.texto;
          break;
        case 3:
          notes[resultado.id_materia - 1].value = resultado.texto;
          break;
        case 4:
          notes[resultado.id_materia - 1].value = resultado.texto;
          break;
        default:
          break;
      }
    });
  } else if (resultados.length == 1) {
    resultados.forEach((resultado) => {
      if (resultado.id_materia == 5) {
        var notes5 = document.getElementById("notes5");
        notes5.value = resultado.texto;
      } else if (resultado.id_materia == 6) {
        var notes6 = document.getElementById("notes6");
        notes6.value = resultado.texto;
      }
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
      const tipo = resultados[i].sender == 2 ? "Tú" : "Coordinador";
      comentarios.innerHTML += `<b>${tipo}</b> <small class="text-muted">${resultados[i].date}</small><br />
        <p>${resultados[i].txt}</p>`;
    }
  }
}

function build(resultados) {
  var campos = document.getElementsByClassName("notes");
  if (typeof resultados == "undefined") {
    for (let i = 0; i < campos.length; i++) {
      campos[i].innerHTML =
        "Selecciona un alumno, ¡aquí aparecerá lo que hayas escrito!";
    }
  } else if (resultados.length == 0) {
    for (let i = 0; i < campos.length; i++) {
      campos[i].innerHTML =
        "Sin información. Escribir no nos llevará tanto tiempo.";
    }
  } else if (resultados.length == 4) {
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
            : "Sin información. Escribir no nos llevará tanto tiempo.";
          break;
        case 2:
          notes[resultado.id_materia - 1].innerHTML = resultado.texto
            ? resultado.texto
            : "Sin información. Escribir no nos llevará tanto tiempo.";
          break;
        case 3:
          notes[resultado.id_materia - 1].innerHTML = resultado.texto
            ? resultado.texto
            : "Sin información. Escribir no nos llevará tanto tiempo.";
          break;
        case 4:
          notes[resultado.id_materia - 1].innerHTML = resultado.texto
            ? resultado.texto
            : "Sin información. Escribir no nos llevará tanto tiempo.";
          break;
        default:
          break;
      }
    });
  } else if (resultados.length == 1) {
    resultados.forEach((resultado) => {
      if (resultado.id_materia == 5) {
        var notes5 = document.getElementById("notes5");
        notes5.innerHTML = resultado.texto
          ? resultado.texto
          : "Sin información. Escribir no nos llevará tanto tiempo.";
      } else if (resultado.id_materia == 6) {
        var notes6 = document.getElementById("notes6");
        notes6.innerHTML = resultado.texto
          ? resultado.texto
          : "Sin información. Escribir no nos llevará tanto tiempo.";
      }
    });
  }
}
