import { setting, iconsShow } from "./setting.js";
import {
  printLine,
  printAttackerHitShot,
  printAttackerFailedShot,
  technicalAttackerWinner,
  technicalAdvocateWinner,
  attackerWins,
  tie
} from "./printer.js";

/**
 * @param {{icon:string, boat: {name: string, icon:string, lives: number, LENGTH: number} | null}[][]} board
 */
export function paintBoardLetters(board,emptyCell = false) {
  const showBoard = [];
  for (let row = 0; row < board.length; row++) {
    const letters = rowToASCII(row);
    showBoard[letters] = [];
    for (let col = 0; col < board.length; col++) {
      if (emptyCell) {
        showBoard[letters][col] = setting.UTILS.EMPTY
      }else {
        showBoard[letters][col] = board[row][col].icon; 
      }
    }
  }
  console.table(showBoard);
}
// esta funcion la uso para cambiar los números de las row por letras en las funciones de los tableros
export function rowToASCII(row) {
  row = parseInt(row);
  return String.fromCharCode("A".charCodeAt(0) + row);
}

//TODO✅ un array con 100 disparos, uso pasStart par que del 0 al 9 sean dos caracteres "00, 01 etc" lo necesito así
export function initializeArrayAttacks() {
  const arrayAttacks = [];
  const cell = "";
  for (var i = 0; i < 100; i++) {
   const cell = `${i}`.padStart(2, "0");
    arrayAttacks.push(cell);
  }
  return arrayAttacks;
}

//TODO✅ funcion que usa un array con todos los disparos, seleccionando uno al azar y al atacar borra ese disparo del array
/**
 * @param {Players} attacker
 * @param {Players} advocate
 */
export function attack(attacker, advocate) {
  // para evitar que continue cuando el advocate no tiene más posiciones donde atacar
  if (!advocate.attacks.length) return;
  if (!attacker.bulletsRemain()) return;
  if (!advocate.calculateLivesShips()) return;

  console.log("disparos que quedan antes de disparo", advocate.attacks);
  const attackPositionIndex = Math.floor(Math.random() * advocate.attacks.length);
  const attackedPosition = advocate.attacks[attackPositionIndex];
  advocate.attacks.splice(attackPositionIndex, 1);

  const row = attackedPosition[0];
  const col = attackedPosition[1];
  //console.log("disparo ataque normal",attackedPosition)
  //console.log("row", attackedPosition[0]);
  //console.log("col", attackedPosition[1]);
  //console.log("disparos que quedan",advocate.attacks);

  waterHeaddressSunken(advocate, row, col, attacker);
}

//TODO✅ ataque inteligente, necesito las posiciones alrededor de un disparo y comprobar si ya dispare en ellas
/**
 * @param {number} row
 * @param {number} col
 * @param {Players} attacker
 * @param {Players} advocate
 */
function smartAttack(row, col, attacker, advocate) {
  // mis guardianes
  // Comprobaciones para poder realizar un ataque correctamente
  // Sirve para no atacar cuando el advocate no tiene mas posiciones libres donde realizar el disparo
  if (!advocate.attacks.length) return;
  if (!attacker.bulletsRemain()) return;
  if (!advocate.calculateLivesShips()) return;

  const arrayPossibleShots = [];
  const maxColIndex = setting.UTILS.COLS - 1;
  const maxRowIndex = setting.UTILS.ROWS - 1;
  //✅calculo los posibles disparos alrededor de una posición atacada
  // arriba (col = col, row = row-1)
  if (row > 0) arrayPossibleShots.push(`${row - 1}${col}`);

  // derecha (col = col+1, row = row)
  if (col < maxColIndex) arrayPossibleShots.push(`${row}${col + 1}`);

  // abajo (col = col, row = row+1)
  if (row < maxRowIndex) arrayPossibleShots.push(`${row + 1}${col}`);

  // izquierda (col = col-1, row = row)
  if (col > 0) arrayPossibleShots.push(`${row}${col - 1}`);

  //console.log("disparos que quedan antes de disparo",advocate.attacks);
  //console.log()
  //console.log("arrayposDis",arrayPossibleShots);
  //✅ necesito los posibles disparos que quedan en advocate.attacks
  const result = advocate.attacks.filter((elem) =>
    arrayPossibleShots.includes(elem)
  );
  if (result.length != 0) {
    const attackPositionIndex = Math.floor(Math.random() * result.length);
    const attackedPosition = result[attackPositionIndex];
    //✅ consigo el indice para poder borrar ese ataque de advocate.attacks
    const shotAttack = advocate.attacks.indexOf(attackedPosition);
    advocate.attacks.splice(shotAttack, 1);
    //printLine("indice shotAttack",shotAttack)
    // printLine("posibles disparos filtrados", result);
    row = attackedPosition[0];
    col = attackedPosition[1];
    //printLine("position atacada ataque listo",attackedPosition)
    //printLine("disparos que quedan",advocate.attacks)
    waterHeaddressSunken(advocate, row, col, attacker);
  } else {
    attack(attacker, advocate);
  }
}

//TODO✅ Necesito que al atacar una posicion si es agua cambie el icono
//    ✅ Si toco barco lo mismo pero con su icono correspondiente
//    ✅ Además si tocas barco o lo hundes vuelves a disparar
//    ✅ Si es hundido cambiar el icono a hundido en toda la representacion del barco

/**
 * @param {Players} attacker
 * @param {Players} advocate
 */
function waterHeaddressSunken(advocate, row, col, attacker) {
  row = parseInt(row);
  col = parseInt(col);
  const position = advocate.board[row][col];

  //✅ resto una vida por cada disparo
  attacker.subtractBullets();

  if (!position.boat) {
    position.icon = setting.UTILS.FAIL;
    printAttackerFailedShot(advocate, row, col, attacker);
  } else {
    position.boat.lives--;
    position.icon = setting.UTILS.HIT;
    printAttackerHitShot(advocate, row, col, attacker);

    if (!position.boat.lives) {
      searchShipSink(advocate.board, position.boat);
      printLine(
        `${position.boat.name} position: ${rowToASCII(row)} | ${col} Hundido 🔥`
      );
      attack(attacker, advocate);
    } else {
      attack(attacker, advocate);
      //smartAttack(row, col, attacker, advocate);
    }
  }
}

//TODO✅ funcion que cuando un barco no tiene vidas cambia los iconos de la longitud de ese barco por el icono de hundido
/**
 * @param {{icon:string, boat:string}[][]} board
 */
function searchShipSink(board, boat) {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col].boat == boat) {
        board[row][col].icon = setting.UTILS.SUNKEN;
      }
    }
  }
}

//TODO✅ si los iconsShow estan en el tablero los cambio por HIDDEN
export function obfuscatedBoard(board) {
  const displayBoard = {};
  for (let row = 0; row < board.length; row++) {
    const letters = rowToASCII(row);
    displayBoard[letters] = [];
    for (let col = 0; col < board[row].length; col++) {
      const position = board[row][col];
      if (!iconsShow.includes(position.icon)) {
        // "NOTA PARA MI" includes retorna true o false
        displayBoard[letters][col] = setting.UTILS.HIDDEN;
      } else {
        displayBoard[letters][col] = position.icon;
      }
    }
  }
  console.table(displayBoard);
}
//TODO esta función solo la uso para pintar el tablero vacío al inicio del juego, 👀MIRAR SI PUEDO REFACTORIZARLA CON LA OTRA QUE TENGO
// export function paintBoardIcons(board) {
//   let displayBoard = [];
//   for (let row = 0; row < board.length; row++) {
//     const letters = rowToASCII(row);
//     displayBoard[letters] = [];
//     for (let col = 0; col < board[row].length; col++) {
//       displayBoard[letters][col] = setting.UTILS.EMPTY;
//     }
//   }
//   console.table(displayBoard);
// }

/**
 * @param {Players} attacker
 * @param {Players} advocate
 */

export function isVictory(attacker, advocate) {
  const livesPlayer1 = attacker.calculateLivesShips();
  const livesPlayer2 = advocate.calculateLivesShips();
  if (livesPlayer2 == 0) {
    attackerWins(advocate, attacker);
  } else if (livesPlayer2 < livesPlayer1){
    technicalAttackerWinner(advocate, attacker);
  } else if (livesPlayer1 < livesPlayer2){
    technicalAdvocateWinner(advocate, attacker);
  }else {
    tie(advocate,attacker)
  }
}

// if (livesPlayer1 < livesPlayer2) {
//   technicalAttackerWinner(advocate,attacker)

// } else if (livesPlayer2 < livesPlayer1) {
//   attackerWins(advocate,attacker)
// } else {
//   printLine(`Hay empate entre ${attacker.name} (Vidas: ${attacker.calculateLivesShips()} Balas: ${attacker.bullets})`, ` y ${advocate.name} (Vidas: ${advocate.calculateLivesShips()} Balas: ${advocate.bullets})`);
// }
