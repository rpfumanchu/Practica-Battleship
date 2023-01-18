const setting = require("./setting.js");
const {  printLine, printHeading } = require("./printer.js");

const BOATS = [
  setting.SHIPS.lancha,
  setting.SHIPS.crucero,
  setting.SHIPS.submarino,
  setting.SHIPS.buque,
  setting.SHIPS.portaaviones,
];

const iconsShow = [
  setting.UTILS.FAIL,
  setting.UTILS.SUNKEN,
  setting.UTILS.HIT,
];

/**
 * @param {{icon:string, boat: {name: string, icon:string, lives: number, LENGTH: number} | null}[][]} board
 */
function paintBoardLetters(board) {
  const showBoard = {};
  for (let row = 0; row < board.length; row++) {
    const letters = rowToASCII(row);
    showBoard[letters] = [];
    for (let col = 0; col < board.length; col++) {
      showBoard[letters][col] = board[row][col].icon;
    }
  }
  console.table(showBoard);
}

function rowToASCII(row) {
  row = parseInt(row);
  return String.fromCharCode("A".charCodeAt(0) + row);
}

// function collision(locations, player) {
//   for (var i = 0; i < player.barcos.length; i++) {
//     let barquito = player.barcos;

//     for (var j = 0; j < locations.length; j++) {
//       if (barquito.indexOf(locations[j]) >= 0) {
//         return true;
//       }
//     }
//   }
//   return false;
// }

function initializeArrayAttacks() {
  const arrayAttacks = [];
  let cell = "";
  for (var i = 0; i < 100; i++) {
    cell = `${i}`.padStart(2, "0");
    arrayAttacks.push(cell);
  }

  return arrayAttacks;
}

/**
 * @param {Players} attacker
 * @param {Players} advocate
 */
function attack(attacker, advocate) {
  
  // para evitar que continue cuando el advocate no tiene más posiciones donde atacar
  if(!advocate.attacks.length) return;
  if(!attacker.bulletsRemain()) return;
  if(!advocate.calculateLivesShips()) return;

  console.log("disparos que quedan antes de disparo",advocate.attacks);
  var attackPositionIndex = Math.floor(Math.random() * advocate.attacks.length);
  let attackedPosition = advocate.attacks[attackPositionIndex];
  advocate.attacks.splice(attackPositionIndex, 1);

  let row = attackedPosition[0];
  let col = attackedPosition[1];
  console.log("disparo ataque normal",attackedPosition)
  //console.log("row", attackedPosition[0]);
  //console.log("col", attackedPosition[1]);
  console.log("disparos que quedan",advocate.attacks);

  waterHeaddressSunken(advocate, row, col, attacker)
}

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
  if(!advocate.attacks.length) return;
  if(!attacker.bulletsRemain()) return;
  if(!advocate.calculateLivesShips()) return;

  arrayPossibleShots = []
  const maxColIndex = setting.UTILS.COLS-1;
  const maxRowIndex = setting.UTILS.ROWS-1;
  //✅calculo los posibles disparos alrededor de una posición atacada
  // arriba (col = col, row = row-1)
  if(row > 0) arrayPossibleShots.push(`${row-1}${col}`);

  // derecha (col = col+1, row = row)
  if(col < maxColIndex) arrayPossibleShots.push(`${row}${col+1}`);

  // abajo (col = col, row = row+1)
  if(row < maxRowIndex) arrayPossibleShots.push(`${row+1}${col}`);

  // izquierda (col = col-1, row = row)
  if(col > 0) arrayPossibleShots.push(`${row}${col-1}`);

  //console.log("disparos que quedan antes de disparo",advocate.attacks);
  //console.log()
  //console.log("arrayposDis",arrayPossibleShots);
  // necesito los posibles disparos que quedan en advocate.attacks
  let result = advocate.attacks.filter((elem) => arrayPossibleShots.includes(elem));
  if (result.length != 0) {
    const attackPositionIndex = Math.floor(Math.random() * result.length);
    const attackedPosition = result[attackPositionIndex];
    // consigo el indice para poder borrar ese ataque de advocate.attacks
    const disparoAtaque = advocate.attacks.indexOf(attackedPosition);
    advocate.attacks.splice(disparoAtaque,1)
    //printLine("indice disparoAtaque",disparoAtaque)
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
//    ✅ Si es undido cambiar el icono a hundido en toda la representacion del barco         

/**
 * @param {Players} attacker
 * @param {Players} advocate
 */
function waterHeaddressSunken(advocate, row, col, attacker) {
  row = parseInt(row);
  col = parseInt(col);
  const position = advocate.board[row][col];

  //✅resto una vida por cada disparo
  attacker.subtractBullets();

  if (!position.boat) {
    position.icon = setting.UTILS.FAIL;
    printLine(`     Tablero de ${attacker.name}`)
    paintBoardLetters(attacker.board)
    printLine(` ${attacker.name} Apunta y Dispara`);
    console.log(`UPSSS!!! Agua en la posición: ${rowToASCII(row)} | ${col}`);
    printLine(`---Tablero ofuscado de ${advocate.name}---`)
    obfuscatedBoard(advocate.board);
    printLine(`¡¡¡${attacker.name} despues de disparar te quedan ${attacker.bullets} Balas!!!`);

  } else {
    position.boat.lives--;
    position.icon = setting.UTILS.HIT;
    printLine(`     Tablero de ${attacker.name}`)
    paintBoardLetters(attacker.board)
    printLine(` ${attacker.name} Apunta y Dispara`);
    console.log(`Tocado en la position: ${rowToASCII(row)} | ${col}`);
    console.log("En el blanco, vuelve disparar");
    printLine(`---Tablero ofuscado de ${advocate.name}---`)
    obfuscatedBoard(advocate.board);
    printLine(`¡¡¡${attacker.name} despues de disparar te quedan ${attacker.bullets} Balas!!!`);
    
    if (!position.boat.lives) {
      searchShipSink(advocate.board, position.boat);
      printLine(`${position.boat.name} position: ${rowToASCII(row)} | ${col} Hundido`);
      attack(attacker, advocate);
    } else {
      smartAttack(row, col, attacker, advocate);
    }
  }
}

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


//includes retorna true o false
function obfuscatedBoard(board) {
  let displayBoard = {};
  for (let row = 0; row < board.length; row++) {
    const letters = rowToASCII(row);
    displayBoard[letters] = [];
    for (let col = 0; col < board[row].length; col++) {
      const position = board[row][col];
      if (!iconsShow.includes(position.icon)) {
        displayBoard[letters][col] = setting.UTILS.HIDDEN;
      } else {
        displayBoard[letters][col] = position.icon;
      }
    }
  }
  console.table(displayBoard);
}

function paintBoardIcons(board) {
  let displayBoard = [];
  for (let row = 0; row < board.length; row++) {
    displayBoard[row] = [];
    for (let col = 0; col < board[row].length; col++) {
      const position = board[row][col];
      displayBoard[row][col] = position.icon;
    }
  }
  console.table(displayBoard);
}

/**
 * @param {Players} player1
 * @param {Players} player2
 */
function isVictory(attacker, advocate) {
  const livesPlayer1 = attacker.calculateLivesShips();
  const livesPlayer2 = advocate.calculateLivesShips();
  if (livesPlayer1 < livesPlayer2) {
    console.log(`Gana ${advocate.name}`);
    printLine("");
    printLine(`Tablero de ${advocate.name}`)
    paintBoardLetters(advocate.board)
    printLine(`---Tablero ofuscado de ${attacker.name}---`)
    obfuscatedBoard(attacker.board);
  } else if (livesPlayer2 < livesPlayer1) {
    console.log(`Gana ${attacker.name}`);
    printLine("");
    printLine(`Tablero de ${attacker.name}`)
    paintBoardLetters(attacker.board)
    printLine(`---Tablero ofuscado de ${advocate.name}---`)
    obfuscatedBoard(advocate.board);
  } else {
    printLine(`Hay empate entre ${attacker.name} (Vidas: ${attacker.calculateLivesShips()} Balas: ${attacker.bullets})`, ` y ${advocate.name} (Vidas: ${advocate.calculateLivesShips()} Balas: ${advocate.bullets})`);
  }
}

module.exports = {
  initializeArrayAttacks,
  attack,
  smartAttack,
  obfuscatedBoard,
  paintBoardIcons,
  isVictory,
  paintBoardLetters,
  BOATS,
};
