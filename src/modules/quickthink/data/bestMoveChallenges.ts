/**
 * "Melhor jogada" generators — a short sports/game scenario in plain text +
 * emoji, with a few choices. No real game engine, just quick-decision text
 * scenarios themed around sports so it feels transferable to real play.
 */

import type { BuiltChallenge, ChallengeGenerator } from "../types";
import { buildOptions } from "./utils";

type Scenario = {
  prompt: string;
  correct: string;
  wrongs: [string, string, string];
  reason: string;
};

const SCENARIOS: Scenario[] = [
  {
    prompt: "⚽ Sua dupla está sozinha e livre perto do gol, mas você está longe. Qual a melhor jogada?",
    correct: "Passar a bola pra dupla",
    wrongs: ["Chutar de longe mesmo", "Segurar a bola parado", "Passar pro time adversário"],
    reason: "Passar pra quem está livre e perto do gol é a jogada mais segura.",
  },
  {
    prompt: "🏀 Faltam 2 segundos, seu time está perdendo por 1 ponto e você está livre pra arremessar. O que fazer?",
    correct: "Arremessar na cesta",
    wrongs: ["Segurar a bola até o tempo acabar", "Passar pro adversário", "Sentar no banco"],
    reason: "Com pouco tempo e a cesta livre, arremessar é a chance de vencer.",
  },
  {
    prompt: "🏓 A bolinha vem alta e devagar do seu lado direito. Qual a melhor resposta?",
    correct: "Rebater com calma pro outro lado",
    wrongs: ["Deixar a bola cair", "Fechar os olhos", "Correr pra trás"],
    reason: "Bola alta e devagar dá tempo de mirar e rebater com calma.",
  },
  {
    prompt: "🏃 É a sua vez de correr no revezamento e o colega está chegando perto. O que fazer?",
    correct: "Pegar o bastão e sair correndo",
    wrongs: ["Esperar ele descansar", "Sentar no chão", "Correr na direção contrária"],
    reason: "No revezamento, pegar o bastão rápido e sair é o que ganha tempo.",
  },
  {
    prompt: "🎯 Você já jogou 2 dardos sem acertar o centro. O terceiro está na sua mão. O que fazer?",
    correct: "Respirar, mirar com calma e lançar",
    wrongs: ["Jogar sem olhar", "Desistir da rodada", "Jogar pra trás"],
    reason: "Respirar e mirar com calma aumenta as chances de acertar.",
  },
  {
    prompt: "🏐 A bola de vôlei vem forte pro seu campo e ninguém mais está perto dela. O que fazer?",
    correct: "Se posicionar e rebater a bola",
    wrongs: ["Deixar a bola cair", "Chutar a bola", "Virar de costas"],
    reason: "Se posicionar rápido pra rebater evita perder o ponto.",
  },
  {
    prompt: "♟️ No tabuleiro, seu adversário deixou uma peça importante livre pra você capturar. O que fazer?",
    correct: "Capturar a peça livre",
    wrongs: ["Mover outra peça sem motivo", "Desistir do jogo", "Passar a vez sem jogar"],
    reason: "Quando dá pra capturar uma peça livre, essa é a jogada mais esperta.",
  },
  {
    prompt: "🏊 Você está quase alcançando quem nada na sua frente, perto da chegada. O que fazer?",
    correct: "Acelerar o ritmo até a borda",
    wrongs: ["Parar pra descansar", "Nadar pro lado errado", "Sair da piscina"],
    reason: "Perto da chegada, acelerar é o que faz a diferença.",
  },
  {
    prompt: "🥅 Você é o goleiro e o adversário vai bater um pênalti. O que fazer?",
    correct: "Ficar atento pra ver de que lado ele vai chutar",
    wrongs: ["Fechar os olhos", "Sair do gol andando", "Sentar no chão"],
    reason: "Ficar atento ajuda a reagir rápido pro lado certo.",
  },
  {
    prompt: "🏸 A peteca vem bem perto da rede, baixinho. Qual a melhor jogada?",
    correct: "Dar uma batida curta e leve",
    wrongs: ["Bater com toda força pra trás", "Deixar cair", "Virar de costas pra rede"],
    reason: "Perto da rede, uma batida curta e leve controla melhor a jogada.",
  },
  {
    prompt: "🎳 Faltam só 2 pinos de boliche, um de cada lado da pista. O que fazer?",
    correct: "Mirar bem no meio pra pegar os dois",
    wrongs: ["Jogar a bola pra fora da pista", "Fechar os olhos e jogar", "Não jogar essa rodada"],
    reason: "Mirar no meio dá chance de acertar os dois pinos de lado.",
  },
  {
    prompt: "🏒 Seu time tem o disco perto do gol adversário e um colega está livre e mais perto do gol. O que fazer?",
    correct: "Passar o disco pro colega livre",
    wrongs: ["Chutar o disco pra fora", "Parar de jogar", "Passar pro goleiro adversário"],
    reason: "Passar pra quem está livre e mais perto do gol aumenta a chance de ponto.",
  },
];

export const BEST_MOVE_GENERATORS: ChallengeGenerator[] = SCENARIOS.map(
  (scenario): ChallengeGenerator =>
    (optionCount: number): BuiltChallenge => {
      const { options, correctIndex } = buildOptions(scenario.correct, scenario.wrongs, optionCount);
      return {
        prompt: scenario.prompt,
        options,
        correctIndex,
        reason: scenario.reason,
      };
    },
);
