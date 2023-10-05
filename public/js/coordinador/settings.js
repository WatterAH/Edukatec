var ciclo = document.getElementById("ciclo");
var date = new Date();
var año = date.getFullYear();
var fecha_uno = año - 1;
var fecha_dos = año + 1;
var option_one = document.createElement("option");
var option_second = document.createElement("option");

option_one.text = fecha_uno + "-" + año;
option_one.value = 1;
option_second.text = año + "-" + fecha_dos;
option_second.value = 2;

ciclo.appendChild(option_one);
ciclo.appendChild(option_second);

const send = () => {
  document.getElementById("lang").submit();
};

const temaa = () => {
  document.getElementById("tema").submit();
};

const confirm = () => {
  const value = document.getElementById("periodos").value;
  if (value) {
    Swal.fire({
      title: "¿Estas segur@?",
      text: "Una vez confirmado, no podras cambiar el Periodo " + value,
      icon: "warning",
      showDenyButton: true,
      confirmButtonText: "Estoy seguro",
      denyButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        document.getElementById("periodo").submit();
      }
    });
  }
};
