import { 
  obfuscatedBoard,
  paintBoardLetters,
  rowToASCII,
  //paintBoardIcons
} from "./function.js";
import { setting } from "./setting.js";

export function printHeading(text) {
  const pad = "=".repeat(text.length);
  console.log(`====================${pad}====================`);
  console.log(`=================== ${text} ===================`);
  console.log(`====================${pad}====================`);
}

export function printLine(...text) {
  console.log("");
  console.log(...text);
}

export function printAttackerHitShot(advocate, row, col, attacker) {
  printLine(`     Tablero de ${attacker.name}`);
  paintBoardLetters(attacker.board);
  printLine(` ${attacker.name} Apunta y Dispara`);
  console.log(`💥 Tocado en la position: ${rowToASCII(row)} | ${col}`);
  console.log(" !!En el blanco, vuelve disparar");
  printLine(`---Tablero ofuscado de ${advocate.name}---`);
  obfuscatedBoard(advocate.board);
  printLine(
    `¡¡¡${attacker.name} despues de disparar te quedan ${attacker.bullets} Balas!!!`
  );
}

export function printAttackerFailedShot(advocate, row, col, attacker) {
  printLine(`     Tablero de ${attacker.name}`);
  paintBoardLetters(attacker.board);
  printLine(` ${attacker.name} Apunta y Dispara`);
  console.log(` UPSSS!!! Agua 💦 en la posición: ${rowToASCII(row)} | ${col}`);
  printLine(`---Tablero ofuscado de ${advocate.name}---`);
  obfuscatedBoard(advocate.board);
  printLine(
    `¡¡¡${attacker.name} despues de disparar te quedan ${attacker.bullets} Balas!!!`
  );
}


export function printPresentationGame(player1,player2) {
  printHeading("Hundir la Flota");
  printLine("Tipos de ships: ", player1.ships);
  printLine(`Leyenda: Agua ${setting.UTILS.FAIL}, Tocado: ${setting.UTILS.HIT} y Hundido ${setting.UTILS.SUNKEN}`);
  printHeading(player1.name);
  printLine(`**********player1 tiene ${player1.bullets} Balas**********`);
  //paintBoardIcons(player1.board);
  paintBoardLetters(player1.board,true)
  printLine("!!!!!!!!Colocando barcos.........");
  paintBoardLetters(player1.board);
  printHeading(player2.name);
  printLine(`**********player2 tiene ${player2.bullets} Balas**********`);
  //paintBoardIcons(player2.board);
  paintBoardLetters(player2.board,true)
  printLine("Colocando ships.........");
  paintBoardLetters(player2.board);
  printLine("");
  printHeading("Comienza el juego");
}

export function technicalAttackerWinner(advocate,attacker) {
  printLine(`===================!!!!!!!!!!!!!!!!!!!Ganador Técnico ${attacker.name}¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡===================`);
  printLine(`Tablero de ${attacker.name}`)
  paintBoardLetters(attacker.board)
  printLine(`---Tablero ofuscado de ${advocate.name}---`)
  obfuscatedBoard(advocate.board);
  
}

export function attackerWins(advocate,attacker) {
  printLine(`=================!!!!!!!!!!!!!!!!!!!!!!!Gana por K.O ${attacker.name}¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡================`);
  printLine(`Tablero de ${attacker.name}`)
  paintBoardLetters(attacker.board)
  printLine(`---Tablero ofuscado de ${advocate.name}---`)
  obfuscatedBoard(advocate.board);
}

export function technicalAdvocateWinner(advocate,attacker) {
  printLine(`===================!!!!!!!!!!!!!!!!!!!Ganador Técnico ${advocate.name}¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡===================`);
  printLine(`Tablero de ${advocate.name}`)
  paintBoardLetters(advocate.board)
  printLine(`---Tablero ofuscado de ${attacker.name}---`)
  obfuscatedBoard(attacker.board);
}

export function tie(advocate,attacker) {
  printLine(`============Hay empate entre ${attacker.name} (Vidas: ${attacker.calculateLivesShips()} Balas: ${attacker.bullets})`,` y ${advocate.name} (Vidas: ${advocate.calculateLivesShips()} Balas: ${advocate.bullets})===========`
    );
  console.log("");
}