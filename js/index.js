class Modelo {
  alfabeto;
  producciones;
  terminales;

  nulas = [];

  alfabetoEliminado = [];
  produccionesEliminadas = [];

  alfabetoEliminadoT = [];
  produccionesEliminadasT = [];

  constructor(alfabeto, producciones, terminales) {
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
          individuales = individuales.filter((x) => x != produccion);
      });
      return individuales.join("/");
    });
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
    if (!inicial) return anteriores;
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
            .filter((produccion) => produccion.length > 1)
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
    let indice = 0;
    const chomsky = [];
    for (let producciones of this.producciones) {
      let individuales = producciones.split("/");
      for (let produccion of individuales) {
        if (produccion.length < 3) {
          chomsky.push(produccion);
        }else{
            
        }
        console.log(individuales.join("/"));
        indice++;
      }
    }
  }
}

const model = new Modelo(
  ["A", "B", "Z", "C", "D"],
  [
    "AB/DC/B/E/F/G/AED",
    "CD/EC/λ",
    "AD/CDA/DX/FG/λ",
    "ABC/CDG/A/λ",
    "AB/CD/XS/H",
  ],
  [1, 2, 3, 4]
);

model.crearMatriz();
model.buscarNulas();
model.eliminarInutiles();
model.eliminarInalcanzables("B");
model.eliminarNulos();
model.eliminarUnitarias();
model.crearMatriz();
model.chomsky();
console.log("despues de chomsky");
model.crearMatriz();
