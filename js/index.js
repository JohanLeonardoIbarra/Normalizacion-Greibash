class Modelo {
  alfabeto;
  producciones;
  terminales;

  inicial = "";

  nulas = [];
  produccionesTerminales = [];

  alfabetoAuxiliar = [];
  produccionesAuxiliares = [];

  chomskyVar = 1;

  constructor(alfabeto, inicial, producciones, terminales) {
    this.inicial = inicial;
    this.alfabeto = alfabeto;
    this.producciones = producciones;
    this.terminales = terminales;
  }

  crearMatriz() {
    let matriz = [...this.alfabeto.keys()].map((x) => [
      this.alfabeto[x],
      this.producciones[x],
    ]);
    console.table(matriz);
    return matriz;
  }

  eliminarInutiles() {
    this.producciones = this.producciones.map((producciones) => {
      let individuales = producciones.split("/");
      individuales.map((produccion) => {
        if (produccion.split("").some((x) => !this.alfabeto.includes(x)))
          individuales = individuales.filter((x) => {
            //debugger;
            return (
              x != produccion ||
              x.split("").some((x) => !isNaN(Number.parseInt(x)))
            );
          });
      });
      return individuales.join("/");
    });
    console.log(this.producciones);
  }

  eliminarInalcanzables(inicial) {
    const depuradas = this.eliminarInalcanzablesR(inicial, []);
    let eliminadas = this.alfabeto.filter(
      (x) => !depuradas.join("").includes(x)
    );
    eliminadas.forEach((eliminada) => {
      const index = this.alfabeto.indexOf(eliminada);
      this.alfabeto.splice(index, 1);
      this.producciones.splice(index, 1);
    });
  }

  eliminarInalcanzablesR(inicial, anteriores, otras) {
    if (!inicial || !isNaN(Number.parseInt(inicial))) return anteriores;
    let producciones = this.producciones[this.alfabeto.indexOf(inicial)]
      .split("")
      .concat(otras)
      .filter(
        (x) => x != "/" && x != inicial && !anteriores.some((z) => x == z)
      );
    producciones = producciones.reduce((producciones, produccion) => {
      if (!producciones.includes(produccion)) {
        producciones.push(produccion);
      }
      return producciones;
    }, []);
    anteriores.push(inicial);
    return this.eliminarInalcanzablesR(
      producciones[0],
      anteriores,
      producciones
    );
  }

  eliminarUndefined() {
    this.producciones = this.producciones.map((produccion) => {
      return produccion
        .split("/")
        .filter((x) => x != "undefined")
        .join("/");
    });
  }

  eliminarNulos() {
    for (let terminal of this.nulas) {
      this.eliminarNulosG(terminal);
    }
  }

  eliminarNulosG(variable) {
    if (!this.alfabeto.includes(variable)) return;
    let borrar = true;
    for (let i = 0; i < this.producciones.length; i++) {
      let message = "";
      let producciones = this.producciones[i].split("/");
      for (let j = 0; j < producciones.length; j++) {
        if (producciones[j].includes(variable)) {
          let aux = "";
          let produccion = producciones[j].split("");
          for (let k = 0; k < produccion.length; k++) {
            let x = produccion[k] + "";
            if (x != variable) {
              aux += x;
            }
          }
          if (aux != "") {
            producciones[j] = producciones[j] + "/" + aux;
          }
        }
      }
      for (let j = 0; j < producciones.length; j++) {
        if (producciones[j] != "") {
          message += producciones[j] + "/";
        }
      }
      this.producciones[i] = message.substring(0, message.length - 1);
    }
    this.eliminarRepetidas();
  }

  eliminarRepetidas() {
    this.producciones = this.producciones.map((produccion) => {
      return produccion
        .split("/")
        .reduce((array, x) => {
          if (!array.includes(x)) {
            array.push(x);
          }
          return array;
        }, [])
        .join("/");
    });
  }

  eliminarUnitarias() {
    this.producciones = this.producciones.map((producciones) => {
      producciones.split("/").map((produccion) => {
        if (produccion.length === 1) {
          producciones = producciones
            .concat("/" + this.producciones[this.alfabeto.indexOf(produccion)])
            .split("/")
            .filter(
              (produccion) =>
                produccion.length > 1 || !isNaN(Number.parseInt(produccion))
            )
            .join("/");
        }
      });
      return producciones;
    });
    this.eliminarRepetidas();
  }

  buscarNulas() {
    let indices = [];
    for (let index in this.producciones) {
      if (this.producciones[index].includes("λ")) {
        indices.push(this.alfabeto[index]);
      }
    }
    this.nulas = indices;
  }

  chomsky() {
    this.producciones = this.producciones.map((producciones) => {
      let produccion = producciones.split("/");
      produccion = produccion.map((prod) => {
        if (prod.length > 2 && typeof prod.split(prod.length) != Number) {
          prod = this.chomskyRecursion(prod);
          console.log(prod);
        }
        return prod;
      });
      console.log(produccion);
      return produccion.join("/");
    });
    this.producciones = this.producciones.concat(this.produccionesAuxiliares);
  }

  chomskyRecursion(produccion) {
    let variable = "R" + this.chomskyVar;
    let produccionRecursiva = produccion.substring(1, produccion.length);
    let nuevaProduccion = produccion.substring(0, 1) + "R" + this.chomskyVar;
    this.chomskyVar++;
    if (produccionRecursiva.length > 2) {
      produccionRecursiva = this.chomskyRecursion(produccionRecursiva);
    }
    this.alfabeto.push(variable);
    this.produccionesAuxiliares.push(produccionRecursiva);
    return nuevaProduccion;
  }
}

const model = new Modelo(
  ["A", "B", "Z", "C", "D"],
  [
    "AB1C/DCB/B/E/F/G/AED/1",
    "CDBA/EC/2/λ",
    "AD/CD2A/DX/FG/3/λ",
    "AB3C/CDG/A/4/λ",
    "AB1/CD/XS/1/H",
  ],
  [1, 2, 3, 4]
);

//model.crearMatriz();
model.buscarNulas();
model.eliminarInutiles();
console.log("inutiles");
model.crearMatriz();
model.eliminarInalcanzables("B");
console.log("inalcanzabkes");
model.crearMatriz();
model.eliminarNulos();
console.log("nulos");
model.crearMatriz();
model.eliminarUnitarias();
model.eliminarUndefined();
console.log("unitarias");
model.crearMatriz();
model.chomsky();
console.log("despues de chomsky");
model.crearMatriz();
