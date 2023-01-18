const { initializeArrayAttacks, BOATS } = require("./funciones.js");

const setting = require("./setting.js");

import {initializeArrayAttacks} from ".function.js"

export class Players {
  constructor(name) {
    this.name = name;
    /** @type {{icon:string, boat:{name: string, icon:string, lives: number, LENGTH: number}}[][]} */
    this.board = [];
    /** @type {{name: string, icon:string, lives: number, LENGTH: number}[]} */
    this.barcos = [];
    this.bullets = setting.UTILS.MAX_BULLETS;

    /** @type {string[]} */
    this.attacks = initializeArrayAttacks();

    this.initializeClass();
  }

  subtractBullets() {
    this.bullets--;
  }

  keepPlaying() {
    return this.bullets > 0 && this.calculateLivesShips() > 0;
  }

  bulletsRemain() {
    return this.bullets > 0;
  }

  initializeClass() {
    this.createBoard();
    this.playerShips();
    this.createAllShips();
  }

  calculateLivesShips() {
    const vidas_barcos_mapped = this.barcos.map((boat) => boat.lives);
    const total_vidas = vidas_barcos_mapped.reduce(
      (anterior, actual) => anterior + actual,
      0
    );
    return total_vidas;
  }

  createBoard() {
    for (let i = 0; i < setting.UTILS.ROWS; i++) {
      this.board[i] = [];
      for (let j = 0; j < setting.UTILS.COLS; j++) {
        const position = { icon: setting.UTILS.EMPTY, boat: null };
        this.board[i][j] = position;
      }
    }
  }

  playerShips() {
    BOATS.forEach((elem) => {
      const barco_actual = elem;
      for (let j = 0; j < barco_actual.count; j++) {
        var boat = {
          name: `${barco_actual.name} #${j}`,
          icon: barco_actual.icon,
          lives: barco_actual.lives,
          LENGTH: barco_actual.LENGTH,
        };
        this.barcos.push(boat);
      }
    });
  }

  createBoat(barquito) {
    let barcoCreado = false;
    while (!barcoCreado) {
      let direccion2 = this.direction();
      let posicionesValidas;
      if (direccion2 == 0) {
        posicionesValidas = this.horizontalValidPositions(barquito);
      } else {
        posicionesValidas = this.verticalValidPositions(barquito);
      }
      if (posicionesValidas.length == barquito.LENGTH) {
        barcoCreado = true;
        for (let i = 0; i < posicionesValidas.length; i++) {
          const icon = barquito.icon;
          const position = posicionesValidas[i];
          position.icon = icon;
          position.boat = barquito;
        }
      }
    }
  }

  createAllShips() {
    for (let i = 0; i < this.barcos.length; i++) {
      let barquito = this.barcos[i];
      this.createBoat(barquito);
    }
  }

  direction() {
    return Math.floor(Math.random() * 2);
  }

  /**
   * @param {{name: string;icon: string; lives: number;LENGTH: number;}} barquito
   */
  verticalValidPositions(barquito) {
    let posicionesValidas = [];
    const col = Math.floor(Math.random() * this.board.length);
    const row = Math.floor(
      Math.random() * (this.board.length - barquito.LENGTH + 1)
    );
    for (let i = 0; i < barquito.LENGTH; i++) {
      const position = this.board[row + i][col];
      if (!position.boat) {
        posicionesValidas.push(position);
      }
    }
    return posicionesValidas;
  }

  horizontalValidPositions(barquito) {
    let posicionesValidas = [];
    const row = Math.floor(Math.random() * this.board.length);
    const col = Math.floor(
      Math.random() * (this.board.length - barquito.LENGTH + 1)
    );
    for (let i = 0; i < barquito.LENGTH; i++) {
      const position = this.board[row][col + i];
      if (!position.boat) {
        posicionesValidas.push(position);
      }
    }
    return posicionesValidas;
  }
}
