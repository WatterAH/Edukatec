const langs = [
  {
    value: "es",
    name: "Español",
  },
  {
    value: "en",
    name: "English",
  },
  {
    value: "pt",
    name: "Português",
  },
];

const temas = [
  {
    value: "light",
    name: "Claro",
  },
  {
    value: "dark",
    name: "Oscuro",
  },
];

const id_materia = (txt) => {
  txt.slice(0, 5);
  if (txt == "1") return 1;
  if (txt == "2") return 2;
  if (txt == "3") return 3;
  if (txt == "4") return 4;
  if (txt == "5") return 5;
  if (txt == "6") return 6;
};

const materias = (type) => {
  if (type == 1) return [1, 2, 3, 4];
  if (type == 2) return [5];
  if (type == 3) return [6];
};

module.exports = {
  langs,
  id_materia,
  materias,
  temas,
};
