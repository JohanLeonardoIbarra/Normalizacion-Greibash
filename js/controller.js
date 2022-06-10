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

  if (alfabeto.split(",").includes("")||alfabeto.split(",").some(x => x.length > 1)) {
    alert("El alfabeto debe esta separado por comas");
    return;
  }
  if (inicial.length > 1 || !isNaN(Number.parseInt(inicial))) {
    alert("La variable inicial debe se una letra");
    return;
  }
  if (terminales.split(",").includes("")||terminales.split(",").some(x => x.length > 1 || isNaN(Number.parseInt(x)))) {
    alert("Las variables terminales deben ser numeros separados por comas");
    return;
  }
  const main = document.getElementById("first-view");
  main.classList.remove("animate__fadeIn");
  main.classList.add("animate__fadeOutLeft");

  const prods = document.getElementById("modal");
  prods.classList.toggle("hide");
  prods.classList.add("animate__fadeInRight");

  alfa = alfabeto.split(",");
  init = inicial;
  terminal = terminales.split(",");

  document.getElementById("imgbg").classList.remove("one");
  document.getElementById("imgbg").classList.add("two");
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
    document.getElementById("first-view").classList.add("hide");

    const prods = document.getElementById("modal");
    prods.classList.remove("animate__fadeInRight");
    prods.classList.add("animate__fadeOutLeft");
    setTimeout(() => {
      prods.classList.add("hide");
    }, 1000);

    const vista = document.getElementById("view");
    vista.classList.toggle("hide");
    vista.classList.add("animate__fadeInRight");

    document.getElementById("imgbg").classList.remove("two");
    document.getElementById("imgbg").classList.add("three");

    prod = producciones;
    app();
  });
};

const graficar = (resultados, descripcion, titulo) => {
  const results = document.getElementById("results");
  const div = document.createElement("div");
  div.setAttribute(
    "class",
    "w-[80%] my-6 animate__animated animate__fadeInDown"
  );
  div.setAttribute("id", "table"+c);
  div.innerHTML = template(resultados, descripcion, titulo);
  results.appendChild(div);
};

const resTemplate = (data) => {
  return `
  <tr class="text-center">
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
<table class="border border-solid border-blue-400 w-full">
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
    graficar(
      model.crearMatriz(),
      "Variables y sus producciones previas a iniciar el proceso de normalizacion siguiendo paso a paso hata llegar a la forma normal de Greibach",
      "Gramatica"
    );
  } else if (c === 1) {
    model.eliminarInutiles();
    c++;
    graficar(
      model.crearMatriz(),
      "Eliminacion de variables presentes en las producciones que no se encuentran en la gramatica",
      "Eliminacion de Producciones Inutiles"
    );
  } else if (c === 2) {
    model.eliminarInalcanzables();
    c++;
    graficar(
      model.crearMatriz(),
      "Eliminacion de variables que son inalcanzables desde la variable inicial del sistema",
      "Elminacion de Variables Inalcanzables"
    );
  } else if (c === 3) {
    model.eliminarNulos();
    c++;
    graficar(
      model.crearMatriz(),
      "Eliminacion de producciones que contienen elementos nulos junto con su respetivo ajuste en otras produccines.",
      "Eliminacion de Producciones Nulas"
    );
  } else if (c === 4) {
    model.eliminarUnitarias();
    model.eliminarUndefined();
    c++;
    graficar(
      model.crearMatriz(),
      "Eliminacion de producciones unitarias remplazando las por el valor de sus producciones",
      "Eliminacion de Producciones Unitarias"
    );
  } else if (c === 5) {
    model.chomsky();
    c++;
    graficar(
      model.crearMatriz(),
      "Normalizacion a la forma normal de chomsky generando variables con producciones de maximo 2 variables no terminales",
      "Forma Normal de Chomsky"
    );
  }
};

const nextBtn = document.getElementById("next");

nextBtn.addEventListener("click", () => {
  app();
  nextBtn.setAttribute("href", "#table"+c)
});
