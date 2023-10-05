const changePass = () => {
  Swal.fire({
    title: "Cambiar contraseña",
    html: `
            <input id="input1" class="swal2-input" placeholder="Contraseña anterior">
            <input id="input2" class="swal2-input" placeholder="Nueva contraseña">
        `,
    showCancelButton: true,
    confirmButtonText: "Cambiar",
    showLoaderOnConfirm: true,
    preConfirm: () => {
      const pass1 = document.getElementById("input1").value;
      const pass2 = document.getElementById("input2").value;
      const data = { pass1, pass2 };
      return fetch("/changePassM", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((response) => {
        if (!response.ok) {
          response.text().then((text) => {
            Swal.fire({
              text: text,
              icon: "error",
            });
          });
        } else {
          response.text().then((text) => {
            Swal.fire({
              text: text,
              icon: "success",
            });
          });
        }
      });
    },
  });
};
