import { Players } from "./player.js";
import { attack, isVictory, randomPlayer } from "./function.js";
import {printHeading,printPresentationGame,printPlayerTurn,} from "./printer.js";
import { times } from "./setting.js";

const player1 = new Players("Alina");
const player2 = new Players("Rober");

//✅ presentación
export async function play() {
  printPresentationGame(player1, player2);
  await waitSeconds(times.timePromisesPresentation);
}

export async function loop() {
  let round = 0;
  let attacker;
  let defender;
  let { startAttacking, startDefending } = randomPlayer(player1, player2);

  while (player1.keepPlaying() && player2.keepPlaying()) {
    round++;
    printHeading(`RONDA: ${round}`);
    attacker = startAttacking;
    defender = startDefending;

    await playerTurn(attacker, defender);

    if (defender.keepPlaying()) {
      [attacker, defender] = [defender, attacker]; //swap atacante defensor
      await playerTurn(attacker, defender);
    }
  }
  printHeading(`El juego ha terminado en la ronda ${round} y el ganador es.....`);
  isVictory(attacker, defender);
}

async function playerTurn(attacker, defender) {
  printPlayerTurn(attacker, defender);
  attack(attacker, defender);
  await waitSeconds(times.timePromisesTurns);
}

async function waitSeconds(seconds) {
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, seconds * 1000);
  });
}
