import { setting,BOATS } from "./setting.js";
import { initializeArrayAttacks } from "./function.js";

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
    const livesBoatsMapped = this.ships.map((boat) => boat.lives);
    const totalLives = livesBoatsMapped.reduce(
      (anterior, actual) => anterior + actual,0);
    return totalLives;
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
      const currentShip = elem;
      for (let j = 0; j < currentShip.count; j++) {
        let boat = {
          name: `${currentShip.name} #${j}`,
          icon: currentShip.icon,
          lives: currentShip.lives,
          LENGTH: currentShip.LENGTH,
        };
        this.ships.push(boat);
      }
    });
  }

  createBoat(allShips) {
    let boatCreated = false;
    while (!boatCreated) {
      let directionRandom = this.direction();
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

  createAllShips() {
    for (let i = 0; i < this.ships.length; i++) {
      let allShips = this.ships[i];
      this.createBoat(allShips);
    }
  }

  direction() {
    return Math.floor(Math.random() * 2);
  }

  /**
   * @param {{name: string;icon: string; lives: number;LENGTH: number;}} allShips
   */
  verticalValidPositions(allShips) {
    let validPositions = [];
    const col = Math.floor(Math.random() * this.board.length);
    const row = Math.floor(
      Math.random() * (this.board.length - allShips.LENGTH + 1)
    );
    for (let i = 0; i < allShips.LENGTH; i++) {
      const position = this.board[row + i][col];
      if (!position.boat) {
        validPositions.push(position);
      }
    }
    return validPositions;
  }

  horizontalValidPositions(allShips) {
    let validPositions = [];
    const row = Math.floor(Math.random() * this.board.length);
    const col = Math.floor(
      Math.random() * (this.board.length - allShips.LENGTH + 1)
    );
    for (let i = 0; i < allShips.LENGTH; i++) {
      const position = this.board[row][col + i];
      if (!position.boat) {
        validPositions.push(position);
      }
    }
    return validPositions;
  }
}
