import { obfuscatedBoard, paintBoardLetters, rowToASCII,paintBoardIcons } from "./function.js";
import { setting } from "./setting.js";

export function printHeading(text) {
  const pad = "=".repeat(text.length);
  console.log(`====================${pad}====================`);
  console.log(`=================== ${text} ===================`);
  console.log(`====================${pad}====================`);
}

export function printLine(...text) {
  console.log(...text);
  console.log("");
}

export function printHitShot(advocate, row, col, attacker) {
  printLine(`     Tablero de ${attacker.name}`);
  paintBoardLetters(attacker.board);
  printLine(` ${attacker.name} Apunta y Dispara`);
  console.log(`Tocado en la position: ${rowToASCII(row)} | ${col}`);
  console.log("En el blanco, vuelve disparar");
  printLine(`---Tablero ofuscado de ${advocate.name}---`);
  obfuscatedBoard(advocate.board);
  printLine(
    `¡¡¡${attacker.name} despues de disparar te quedan ${attacker.bullets} Balas!!!`
  );
}

export function printFailedShot(advocate, row, col, attacker) {
  printLine(`     Tablero de ${attacker.name}`);
  paintBoardLetters(attacker.board);
  printLine(` ${attacker.name} Apunta y Dispara`);
  console.log(`UPSSS!!! Agua en la posición: ${rowToASCII(row)} | ${col}`);
  printLine(`---Tablero ofuscado de ${advocate.name}---`);
  obfuscatedBoard(advocate.board);
  printLine(
    `¡¡¡${attacker.name} despues de disparar te quedan ${attacker.bullets} Balas!!!`
  );
}


export function printPresentationGame(player1,player2) {
  printLine("");
  printHeading("Hundir la Flota");
  printLine("Tipos de Barcos: ", player1.barcos);
  printLine(
    `Leyenda: Agua ${setting.UTILS.FAIL}, Tocado: ${setting.UTILS.HIT} y Hundido ${setting.UTILS.SUNKEN}`
  );
  printHeading(player1.name);
  printLine(`**********player1 tiene ${player1.bullets} Balas**********`);
  paintBoardIcons(player1.board);
  printLine("Colocando barcos.........");
  paintBoardLetters(player1.board);

  printHeading(player2.name);
  printLine(`**********player2 tiene ${player2.bullets} Balas**********`);
  paintBoardIcons(player2.board);

  printLine("Colocando barcos.........");
  paintBoardLetters(player2.board);
  printLine("");
  printHeading("Comienza el juego");
}
