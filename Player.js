import { setting, BOATS } from "./setting.js";


//DONE
export class Players {
  constructor(name) {
    this.name = name;
    /** @type {{icon:string, ship:{name: string, icon:string, lives: number, LENGTH: number}, row: number, col: number}[][]} */
    this.board = [];
    /** @type {{name: string, icon:string, lives: number, LENGTH: number}[]} */
    this.ships = [];
    this.bullets = setting.UTILS.MAX_BULLETS;
    /** @type {string[]} */
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

  //DONE necesito saber las vidas de los barcos para más tarde poder restarle esas vidas
  calculateLivesShips() {
    const livesBoatsMapped = this.ships.map((ship) => ship.lives);
    const totalLives = livesBoatsMapped.reduce((prev, curr) => prev + curr, 0);
    return totalLives;
  }

  //DONE creo un tablero 2d
  createBoard() {
    for (let i = 0; i < setting.UTILS.ROWS; i++) {
      this.board[i] = [];
      for (let j = 0; j < setting.UTILS.COLS; j++) {
        const position = { icon: setting.UTILS.EMPTY, ship: null, row: i, col: j };
        this.board[i][j] = position;
      }
    }
  }

  //DONE molde para los barcos con las propiedades que me interesan
  playerShips() {
    BOATS.forEach((elem) => {
      const currentShip = elem;
      for (let j = 0; j < currentShip.count; j++) {
        const ship = {
          name: `${currentShip.name} #${j}`,
          icon: currentShip.icon,
          lives: currentShip.lives,
          LENGTH: currentShip.LENGTH,
        };
        this.ships.push(ship);
      }
    });
  }

  //DONE me aseguro que los barcos no se pisan entre si
  createShip(ship) {
    let shipCreated = false;
    while (!shipCreated) {
      const directionRandom = this.direction();
      let validPositions;
      if (directionRandom == 0) {
        validPositions = this.horizontalValidPositions(ship);
      } else {
        validPositions = this.verticalValidPositions(ship);
      }
      if (validPositions.length == ship.LENGTH) {
        shipCreated = true;
        for (let i = 0; i < validPositions.length; i++) {
          const icon = ship.icon;
          const position = validPositions[i];
          position.icon = icon;
          position.ship = ship;
        }
      }
    }
  }

  //DONE pinto todos los barcos
  createAllShips() {
    this.ships.forEach((ship) => {
      this.createShip(ship);
    });
  }

  //DONE número aleatorio entre 0 y 1 para posteriormente identificar dirección
  direction() {
    return Math.floor(Math.random() * 2);
  }

  //DONE posiciones verticales válidas y aleatorias
  /**
   * @param {{name: string;icon: string; lives: number;LENGTH: number;}} allShips
   */
  verticalValidPositions(ship) {
    const validPositions = [];
    const col = Math.floor(Math.random() * this.board.length);
    const row = Math.floor(
      Math.random() * (this.board.length - ship.LENGTH + 1)
    );
    for (let i = 0; i < ship.LENGTH; i++) {
      const position = this.board[row + i][col];
      if (!position.ship) {
        validPositions.push(position);
      }
    }
    return validPositions;
  }

  //DONE posiciones horizontales válidas y aleatorias
  /**
   * @param {{name: string;icon: string; lives: number;LENGTH: number;}} allShips
   */
  horizontalValidPositions(ship) {
    const validPositions = [];
    const row = Math.floor(Math.random() * this.board.length);
    const col = Math.floor(
      Math.random() * (this.board.length - ship.LENGTH + 1)
    );
    for (let i = 0; i < ship.LENGTH; i++) {
      const position = this.board[row][col + i];
      if (!position.ship) {
        validPositions.push(position);
      }
    }
    return validPositions;
  }
}
