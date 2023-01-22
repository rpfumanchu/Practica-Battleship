import { setting, iconsShow } from "./setting.js";
import {
  printLine,
  printAttackerHitShot,
  printAttackerFailedShot,
  technicalWinner,
  attackerWins,
  tie
} from "./printer.js";

/**
 * @param {{icon:string, ship: {name: string, icon:string, lives: number, LENGTH: number} | null, row: number, col: number}[][]} board
 */
export function paintBoardLetters(board, emptyCell = false) {
  const showBoard = [];
  for (let row = 0; row < board.length; row++) {
    const letters = rowToASCII(row);
    showBoard[letters] = [];
    for (let col = 0; col < board[row].length; col++) {
      if (emptyCell) {
        showBoard[letters][col] = setting.UTILS.EMPTY;
      } else {
        showBoard[letters][col] = board[row][col].icon;
      }
    }
  }
  console.table(showBoard);
}

//NOTE esta funcion la uso para cambiar los números de las row por letras en las funciones de los tableros
export function rowToASCII(row) {
  row = parseInt(row);
  return String.fromCharCode("A".charCodeAt(0) + row);
}

/**
 * @param {{icon:string, ship: {name: string, icon:string, lives: number, LENGTH: number} | null, row: number, col: number}[][]} board
 * @return {{icon:string, ship: {name: string, icon:string, lives: number, LENGTH: number} | null, row: number, col: number}[]}
 */
export function getPossiblePositionsToShoot(board) {
  const flat_board = board.flat();
  const filtered_board = flat_board.filter(position => !iconsShow.includes(position.icon));
  return filtered_board;
} 

//DONE funcion que usa un array con todos los disparos, seleccionando uno al azar y al atacar borra ese disparo del array
/**
 * @param {Players} attacker
 * @param {Players} defender
 */
export function attack(attacker, defender) {
  //NOTE para evitar que continue cuando el defender no tiene más posiciones donde atacar
  if (!attacker.bulletsRemain()) return;
  if (!defender.calculateLivesShips()) return;

  const possiblePositionsToShoot = getPossiblePositionsToShoot(defender.board);
  const attackPositionIndex = Math.floor(Math.random() * possiblePositionsToShoot.length);
  const attackedPosition = possiblePositionsToShoot[attackPositionIndex];
  
  waterTouchedSunken(defender, attacker, attackedPosition);
}

//DONE ataque inteligente, necesito las posiciones alrededor de un disparo y comprobar si ya dispare en ellas
/**
 * @param {number} row
 * @param {number} col
 * @param {Players} attacker
 * @param {Players} defender
 */
function smartAttack(position, attacker, defender) {
  
  /*NOTE mis guardianesComprobaciones para poder realizar un ataque correctamente.Sirve para no atacar cuando el defender no tiene mas posiciones libres donde realizar el disparo*/
  if (!attacker.bulletsRemain()) return;
  if (!defender.calculateLivesShips()) return;

  const arrayPossibleShots = [];
  const maxColIndex = setting.UTILS.COLS - 1;
  const maxRowIndex = setting.UTILS.ROWS - 1;
  //DONE calculo los posibles disparos alrededor de una posición atacada

  //NOTE arriba (col = col, row = row-1)
  if (position.row > 0) arrayPossibleShots.push(defender.board[position.row - 1][position.col]);

  //NOTE derecha (col = col+1, row = row)
  if (position.col < maxColIndex) arrayPossibleShots.push(defender.board[position.row][position.col + 1]);

  //NOTE abajo (col = col, row = row+1)
  if (position.row < maxRowIndex) arrayPossibleShots.push(defender.board[position.row + 1][position.col]);

  //NOTE izquierda (col = col-1, row = row)
  if (position.col > 0) arrayPossibleShots.push(defender.board[position.row][position.col - 1]);

  const possiblePositionsToShoot = getPossiblePositionsToShoot(defender.board);

  //DONE necesito los posibles disparos que quedan en el tablero del defensor
  const result = possiblePositionsToShoot.filter(posicion => arrayPossibleShots.includes(posicion));

  if (result.length != 0) {
    const attackPositionIndex = Math.floor(Math.random() * result.length);
    const attackedPosition = result[attackPositionIndex];
    
    waterTouchedSunken(defender, attacker, attackedPosition);
  } else {
    attack(attacker, defender);
  }
}

/*DONE Necesito que al atacar una posicion si es agua cambie el iconoSi toco barco lo mismo pero con su icono correspondiente. Además si tocas barco o lo hundes vuelves a disparar. Si es hundido cambiar el icono a hundido en toda la representacion del barco*/
/**
 * @param {Players} attacker
 * @param {Players} defender
 * @param {{icon:string, ship: {name: string, icon:string, lives: number, LENGTH: number} | null, row: number, col: number}} position
 */
function waterTouchedSunken(defender, attacker, position) {
  //✅ resto una vida por cada disparo
  attacker.subtractBullets();

  if (!position.ship) {
    position.icon = setting.UTILS.FAIL;
    printAttackerFailedShot(defender, attacker, position);
  } else {
    position.ship.lives--;
    position.icon = setting.UTILS.HIT;
    printAttackerHitShot(defender, attacker, position);

    if (!position.ship.lives) {
      searchShipSink(defender.board, position.ship);
      //NOTE si lo hundo el siguiente ataque sera norma
      attack(attacker, defender);
    } else {
      smartAttack(position, attacker, defender);  
    }
  }
}

//DONE funcion que cuando un barco no tiene vidas cambia los iconos de la longitud de ese barco por el icono de hundido
/**
 * @param {{icon:string, ship: {name: string, icon:string, lives: number, LENGTH: number} | null, row: number, col: number}[][]} board
 * @param {{name: string, icon:string, lives: number, LENGTH: number} | null} ship
 */
function searchShipSink(board, ship) {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col].ship == ship) {
        board[row][col].icon = setting.UTILS.SUNKEN;
      }
    }
  }
}

//DONE si los iconsShow estan en el tablero los cambio por HIDDEN
export function obfuscatedBoard(board) {
  const displayBoard = {};
  for (let row = 0; row < board.length; row++) {
    const letters = rowToASCII(row);
    displayBoard[letters] = [];
    for (let col = 0; col < board[row].length; col++) {
      const position = board[row][col];
      //NOTE "NOTA PARA MI" includes retorna true o false
      if (!iconsShow.includes(position.icon)) {
        displayBoard[letters][col] = setting.UTILS.HIDDEN;
      } else {
        displayBoard[letters][col] = position.icon;
      }
    }
  }
  console.table(displayBoard);
}

//DONE para determinar si una victoria es por k.o tecnica "es decir se agotan las balas el que más vidas tenga" o empate
/**
 * @param {Players} attacker
 * @param {Players} defender
 */
export function isVictory(attacker, defender) {
  const livesAttacker = attacker.calculateLivesShips();
  const livesDefender = defender.calculateLivesShips();
  if (livesDefender == 0) {
    attackerWins(attacker, defender);
  } else if (livesDefender < livesAttacker) {
    technicalWinner(attacker, defender);
  } else if (livesAttacker < livesDefender) {
    technicalWinner(defender, attacker);
  } else {
    tie(attacker, defender);
  }
}
//DONE quiero que en cada ejecución el turno del jugador que empiza atacando sea aleatorio
export function randomPlayer(player1, player2) {
  let startAttacking;
  let startDefending;
  const numRandom = Math.floor(Math.random() * 2);
  if (numRandom == 0) {
    startAttacking = player1;
    startDefending = player2;
  } else {
    startAttacking = player2;
    startDefending = player1;
  }
  return { startAttacking, startDefending };
}
