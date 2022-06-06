//const greibach = new Modelo();

document.getElementById("next").addEventListener("click", (e) => {
  print();
});

const print = () => {
  const tabla = document.getElementById("notation");
  tabla.innerHTML = `
        <td>
            A
        <td/>
        <td>
            ASDFDFG
        <td/>
    `;
};

const formulario = document.getElementById("variables");

formulario.addEventListener("submit", (event) => {
  event.preventDefault();
});
