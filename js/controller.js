//const greibach = new Modelo();

// document.getElementById("next").addEventListener("click", (e) => {
//   print();
// });

// const print = () => {
//   const tabla = document.getElementById("notation");
//   tabla.innerHTML = `
//         <td>
//             A
//         <td/>
//         <td>
//             ASDFDFG
//         <td/>
//     `;
// };

let alfa = [];
let init = "";
let terminal = [];
let pro = [];

const formulario = document.getElementById("variables");

formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(formulario);
  let alfabeto = data.get("alfabeto");
  let inicial = data.get("inicial");
  let terminales = data.get("terminales");

  if (!alfabeto.includes(",")) {
    alert("El alfabeto debe esta separado por comas");
    return;
  }
  if (inicial.length > 1 || !isNaN(Number.parseInt(inicial))) {
    alert("La variable inicial debe se una letra");
    return;
  }
  if (
    !terminales.includes(",") ||
    terminales.split(",").some((x) => isNaN(Number.parseInt(x)))
  ) {
    alert("Las variables terminales deben ser numeros separados por comas");
    return;
  }
  document.getElementById("first-view").classList.add("run-left");
  document.getElementById("modal").classList.toggle("hide");
  document.getElementById("modal").classList.add("show");

  alfa = alfabeto.split(",");
  init = inicial;
  terminal = terminales.split(",");

  document.body.classList.add("two");
  agregarProducciones();
});

const formProd = document.getElementById("formulario-producciones");

formProd.addEventListener("submit", (event) => {
  event.preventDefault();
});

const agregarProducciones = () => {
  const produccionesTabla = document.getElementById("producciones-tabla");
  let count = 0;
  alfa.forEach((terminal) => {
    produccionesTabla.innerHTML += `<tr>
      <th class="w-[30%]"><input class="text-center" type="text" value="${terminal}" readonly/></th>
      <th class="w-[70%]"><input type="text" name="prod${count}" required placeholder="AB/CDA/T2T/1..." /></th></tr>`;
    count++;
  });
  const form = document.getElementById("formulario-producciones");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const producciones = [...Array(count).keys()].map((x) => {
      return data.get("prod" + x);
    });
    console.log(producciones);
  });
};

document.body.classList.add("one");
