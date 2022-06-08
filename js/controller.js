let alfa = [];
let init = "";
let terminal = [];
let prod = [];

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
      <th class="w-[70%]"><input type="text" name="prod${count}" onkeyup="this.value = this.value.toUpperCase()" required placeholder="AB/CDA/T2T/1..." /></th></tr>`;
    count++;
  });
  const form = document.getElementById("formulario-producciones");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const producciones = [...Array(count).keys()].map((x) => {
      return data.get("prod" + x);
    });
    document.getElementById("modal").classList.toggle("run-left2");

    document.getElementById("view").classList.toggle("hide");
    document.getElementById("view").classList.add("show2");
    prod = producciones;
    app();
  });
};

const graficar = (resultados) => {
  const results = document.getElementById("results");
  results.innerHTML += template(resultados);
};

const resTemplate = (data) => {
  return `
  <tr>
    <td>${data[0]}</td>
    <td>${data[1]}</td>
  <tr/>
`;
};

const template = (data, desc, title) => {
  return `<div class="message px-[10%] fade">
  <h1 class="text-5xl">${title}</h1>
  <p class="text-xl">${desc}</p>
</div>
<table class="border border-solid border-blue-400 w-[80%] fade">
  <thead>
    <tr>
      <th>Variable No Terminal</th>
      <th>Producciones</th>
    </tr>
  </thead>
  <tbody id="notation">
    ${data.map((x) => resTemplate(x)).join("")}
  </tbody>
</table>
<hr>`;
};

let model;
let c = 0;

const app = () => {
  if (c === 0) {
    model = new Modelo(alfa, init, prod, terminal);
    model.buscarNulas();
    c++;
    graficar(model.crearMatriz());
  } else if (c === 1) {
    model.eliminarInutiles();
    c++;
    graficar(model.crearMatriz());
  } else if (c === 2) {
    model.eliminarInalcanzables();
    c++;
    graficar(model.crearMatriz());
  } else if (c === 3) {
    model.eliminarNulos();
    c++;
    graficar(model.crearMatriz());
  } else if (c === 4) {
    model.eliminarUnitarias();
    model.eliminarUndefined();
    c++;
    graficar(model.crearMatriz());
  } else if (c === 5) {
    model.chomsky();
    c++;
    graficar(model.crearMatriz());
  }
};

const nextBtn = document.getElementById("next");

nextBtn.addEventListener("click", () => {
  app();
});
