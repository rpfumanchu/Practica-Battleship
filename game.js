import {
  attack,
  isVictory,
} from "./function.js";
import { Players } from "./player.js";
import { printHeading, printLine,printPresentationGame} from "./printer.js";

const player1 = new Players("Alina");
const player2 = new Players("Rober");

export async function play() {
    printPresentationGame(player1,player2)
  await waitSeconds(1);
}

export async function loop() {
  let turno = 0;
  printLine(turno);
  let attacker;
  let advocate;

  while (player1.keepPlaying() && player2.keepPlaying()) {
    turno++;
    printHeading(`TURNO: ${turno}`);
    attacker = player2;
    advocate = player1;
    await turno_player(attacker, advocate);

    if (advocate.keepPlaying()) {
      [attacker, advocate] = [advocate, attacker];
      await turno_player(attacker, advocate);
    }
  }
  printHeading(`El juego ha terminado en el turno ${turno} y el ganador es.....`);
  isVictory(attacker, advocate);
}

async function turno_player(attacker, advocate) {
  printLine(`Ataca: ${attacker.name}(Vidas: ${attacker.calculateLivesShips()} Balas: ${attacker.bullets})`,`Defiende: ${advocate.name} (Vidas: ${advocate.calculateLivesShips()} Balas: ${advocate.bullets})`);
  attack(attacker, advocate);
  await waitSeconds(0);
}

async function waitSeconds(seconds) {
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, seconds * 1000);
  });
}