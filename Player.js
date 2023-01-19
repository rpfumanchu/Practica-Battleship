import { setting,BOATS } from "./setting.js";
import { initializeArrayAttacks } from "./function.js";

//TODO✅
export class Players {
  constructor(name) {
    this.name = name;
    /** @type {{icon:string, boat:{name: string, icon:string, lives: number, LENGTH: number}}[][]} */
    this.board = [];
    /** @type {{name: string, icon:string, lives: number, LENGTH: number}[]} */
    this.ships = [];
    this.bullets = setting.UTILS.MAX_BULLETS;
    /** @type {string[]} */
    this.attacks = initializeArrayAttacks();
    this.initializeClass();
  }

  subtractBullets() {
    this.bullets--;
  }

  // condición para seguir jugando
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

  //TODO✅ necesito saber las vidas de los barcos para más tarde poder restarle esas vidas
  calculateLivesShips() {
    const livesBoatsMapped = this.ships.map((boat) => boat.lives);
    const totalLives = livesBoatsMapped.reduce(
      (anterior, actual) => anterior + actual,0);
    return totalLives;
  }

  //TODO✅
  createBoard() {
    for (let i = 0; i < setting.UTILS.ROWS; i++) {
      this.board[i] = [];
      for (let j = 0; j < setting.UTILS.COLS; j++) {
        const position = { icon: setting.UTILS.EMPTY, boat: null };
        this.board[i][j] = position;
      }
    }
  }

  //TODO✅
  playerShips() {
    BOATS.forEach((elem) => {
      const currentShip = elem;
      for (let j = 0; j < currentShip.count; j++) {
        const boat = {
          name: `${currentShip.name} #${j}`,
          icon: currentShip.icon,
          lives: currentShip.lives,
          LENGTH: currentShip.LENGTH,
        };
        this.ships.push(boat);
      }
    });
  }


  //TODO ✅
  createBoat(allShips) {
    let boatCreated = false;
    while (!boatCreated) {
      const directionRandom = this.direction();
      let validPositions;
      if (directionRandom == 0) {
        validPositions = this.horizontalValidPositions(allShips);
      } else {
        validPositions = this.verticalValidPositions(allShips);
      }
      if (validPositions.length == allShips.LENGTH) {
        boatCreated = true;
        for (let i = 0; i < validPositions.length; i++) {
          const icon = allShips.icon;
          const position = validPositions[i];
          position.icon = icon;
          position.boat = allShips;
        }
      }
    }
  }

  //TODO✅
  createAllShips() {
    for (let i = 0; i < this.ships.length; i++) {
      const allShips = this.ships[i];
      this.createBoat(allShips);
    }
  }

  //TODO✅ número aleatorio entre 0 y 1 para posteriormente identificar dirección
  direction() {
    return Math.floor(Math.random() * 2);
  }

  //TODO✅ posiciones verticales válidas y aleatorias
  /**
   * @param {{name: string;icon: string; lives: number;LENGTH: number;}} allShips
   */
  verticalValidPositions(allShips) {
    const validPositions = [];
    const col = Math.floor(Math.random() * this.board.length);
    const row = Math.floor(Math.random() * (this.board.length - allShips.LENGTH + 1));
    for (let i = 0; i < allShips.LENGTH; i++) {
      const position = this.board[row + i][col];
      if (!position.boat) {
        validPositions.push(position);
      }
    }
    return validPositions;
  }

  //TODO✅ posiciones horizontales válidas y aleatorias
  /**
   * @param {{name: string;icon: string; lives: number;LENGTH: number;}} allShips
   */
  horizontalValidPositions(allShips) {
    const validPositions = [];
    const row = Math.floor(Math.random() * this.board.length);
    const col = Math.floor(Math.random() * (this.board.length - allShips.LENGTH + 1));
    for (let i = 0; i < allShips.LENGTH; i++) {
      const position = this.board[row][col + i];
      if (!position.boat) {
        validPositions.push(position);
      }
    }
    return validPositions;
  }
}
