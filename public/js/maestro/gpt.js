function revisar(num) {
  const textarea = document.getElementById("notes" + num);
  const txt = textarea.value;
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let response = xhr.responseText;
      textarea.value = "";
      if (response) {
        type(response, textarea);
      }
    }
  };
  xhr.open("GET", "/revisarGPT?txt=" + encodeURIComponent(txt), true);
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhr.send();
}

function reducir(num) {
  const textarea = document.getElementById("notes" + num);
  const txt = textarea.value;
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let response = xhr.responseText;
      textarea.value = "";
      if (response) {
        type(response, textarea);
      }
    }
  };
  xhr.open("GET", "/reducirGPT?txt=" + encodeURIComponent(txt), true);
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhr.send();
}

function deshacer(num) {
  const textarea = document.getElementById("notes" + num);
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let response = xhr.responseText;
      textarea.value = "";
      if (response) {
        type(response, textarea);
      }
    }
  };
  xhr.open("GET", "/deshacerGPT?", true);
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhr.send();
}

function type(respuesta, textarea, index = 0) {
  textarea.value += respuesta[index];
  index++;
  if (index < respuesta.length) {
    setTimeout(() => type(respuesta, textarea, index), 50);
  }
}
