import {
  obfuscatedBoard,
  paintBoardLetters,
  rowToASCII,
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
export function printPresentationGame(player1, player2) {
  printHeading("Hundir la Flota");
  printLine("Tipos de ships: ", player1.ships);
  printLine(`Leyenda: Agua ${setting.UTILS.FAIL}, Tocado: ${setting.UTILS.HIT} y Hundido ${setting.UTILS.SUNKEN}`);
  printHeading(player1.name);
  printLine(`**********${player1.name} tiene ${player1.bullets} Balas**********`);
  paintBoardLetters(player1.board, true);
  printLine("!!!!!!!!Colocando barcos.........");
  paintBoardLetters(player1.board);
  printHeading(player2.name);
  printLine(`**********${player2.name} tiene ${player2.bullets} Balas**********`);
  paintBoardLetters(player2.board, true);
  printLine("Colocando barcos.........");
  paintBoardLetters(player2.board);
  printLine("");
  printHeading("Comienza el juego");
  printLine("");
}

export function printAttackerFailedShot(defender, attacker, position) {
  printLine(`Tablero de ${attacker.name}`);
  paintBoardLetters(attacker.board);
  printLine(` ${attacker.name} Apunta y Dispara`);
  printLine(` UPSSS!!! Agua 💦 en la posición: ${rowToASCII(position.row)} | ${position.col}`);
  printLine(`---Tablero ofuscado de ${defender.name}---`);
  obfuscatedBoard(defender.board);
  printLine(`¡¡¡${attacker.name} despues de disparar te quedan ${attacker.bullets} Balas!!!`);
}

export function printAttackerHitShot(defender, attacker, position) {
  printLine(`Tablero de ${attacker.name}`);
  paintBoardLetters(attacker.board);
  printLine(` ${attacker.name} Apunta y Dispara`);
  printLine(`💥 Tocado en la position: ${rowToASCII(position.row)} | ${position.col}`);
  if (position.ship.lives == 0) {
    printLine(`🔥 Has Hundido ${position.ship.name} position: ${rowToASCII(position.row)} | ${position.col} `);
  }
  printLine("¡¡En el blanco!!, vuelve disparar");
  printLine(`---Tablero ofuscado de ${defender.name}---`);
  obfuscatedBoard(defender.board);
  printLine(`¡¡¡${attacker.name} despues de disparar te quedan ${attacker.bullets} Balas!!!`);
}

export function printPlayerTurn(attacker, defender) {
  printLine(`Ahora es el turno de ${attacker.name}.....`)
  printLine(`Ataca: ${attacker.name} (Vidas: ${attacker.calculateLivesShips()} Balas: ${attacker.bullets})`,`|| Defiende: ${defender.name} (Vidas: ${defender.calculateLivesShips()} Balas: ${defender.bullets})`);
}

export function attackerWins(attacker, defender) {
  printLine(`=================!!!!!!!!!!!!!!!!!!!!!!!Gana por K.O ${attacker.name}¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡================`);
  printLine(`Ganador: ${attacker.name} con (Vidas: ${attacker.calculateLivesShips()} Balas: ${attacker.bullets})`,`|| Perdedor: ${defender.name} con (Vidas: ${defender.calculateLivesShips()} Balas: ${defender.bullets})`);
  printLine(`Tablero de ${attacker.name} (Ganador)`);
  paintBoardLetters(attacker.board);
  printLine(`Tablero de ${defender.name} (Perdedor)`);
  paintBoardLetters(defender.board);
}

export function technicalWinner(winner, loser) {
  printLine(`===================!!!!!!!!!!!!!!!!!!!Ganador Técnico ${winner.name}¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡===================`);
  printLine(`Ganador: ${winner.name} con (Vidas: ${winner.calculateLivesShips()} Balas: ${winner.bullets})`,`|| Perdedor: ${loser.name} con (Vidas: ${loser.calculateLivesShips()} Balas: ${loser.bullets})`);
  printLine(`Tablero de ${winner.name} (Ganador)`);
  paintBoardLetters(winner.board);
  printLine(`Tablero de ${loser.name} (Perdedor)`);
  paintBoardLetters(loser.board);
}

export function tie(attacker, defender) {
  printLine(`============Hay empate entre ${attacker.name} (Vidas: ${attacker.calculateLivesShips()} Balas: ${attacker.bullets}`,` y ${defender.name} (Vidas: ${defender.calculateLivesShips()} Balas: ${defender.bullets})===========`);
  printLine(`Tablero de ${attacker.name}`);
  paintBoardLetters(attacker.board);
  printLine(`Tablero de ${defender.name}`);
  paintBoardLetters(defender.board);
  console.log("");
}
