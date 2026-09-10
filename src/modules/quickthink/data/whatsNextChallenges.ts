/**
 * "O que vem a seguir" generators — a short described sequence of steps or
 * events, asking what naturally comes next. Sports/routine themed to match
 * the module, plain text + emoji, under the round timer.
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
    prompt: "✅ Você já aqueceu o corpo. ✅ Já alongou as pernas. O que vem a seguir num treino?",
    correct: "Começar o treino",
    wrongs: ["Ir dormir", "Tomar café da manhã", "Assistir TV"],
    reason: "Depois de aquecer e alongar, o corpo já está pronto pra treinar.",
  },
  {
    prompt: "⚽ Numa jogada de gol: o jogador recebe o passe, corre com a bola, chuta forte e... o que vem a seguir?",
    correct: "A bola entra e o time comemora",
    wrongs: ["O jogo recomeça do zero sem motivo", "O goleiro faz um gol", "O jogo acaba ali"],
    reason: "Depois do chute certeiro, vem a comemoração do gol.",
  },
  {
    prompt: "✅ Você acordou cedo. ✅ Tomou um bom café da manhã. O que vem a seguir antes do jogo?",
    correct: "Vestir o uniforme e ir pro campo",
    wrongs: ["Voltar a dormir", "Comer de novo", "Ficar deitado o dia todo"],
    reason: "Depois do café, é hora de se arrumar e ir jogar.",
  },
  {
    prompt: "🏁 Numa corrida: primeiro é a largada, depois vem o meio do percurso... o que vem a seguir?",
    correct: "A chegada na linha final",
    wrongs: ["A largada de novo", "Voltar pro início", "Parar no meio do caminho"],
    reason: "Depois do meio do percurso, o próximo passo é chegar na linha final.",
  },
  {
    prompt: "🏀 Numa jogada: o time rouba a bola e corre em contra-ataque... o que vem a seguir?",
    correct: "Arremessar pra cesta",
    wrongs: ["Voltar a defender sem motivo", "Passar pro adversário", "Sentar no banco"],
    reason: "Depois do contra-ataque, o passo natural é arremessar pra cesta.",
  },
  {
    prompt: "🏊 Numa prova de nado: apito inicial, mergulho na água, nado até a metade... o que vem a seguir?",
    correct: "Terminar o percurso até a borda",
    wrongs: ["Sair da piscina no meio", "Voltar pro início", "Ficar parado boiando"],
    reason: "Depois de nadar a metade, o próximo passo é terminar o percurso.",
  },
  {
    prompt: "✅ O time se reuniu. ✅ O técnico explicou o plano. O que vem a seguir?",
    correct: "Todo mundo vai pro campo jogar",
    wrongs: ["Todos vão embora", "O jogo já acabou", "Ninguém joga"],
    reason: "Depois do plano explicado, é hora de colocar em prática no campo.",
  },
  {
    prompt: "🚴 Numa prova de ciclismo: largada, subida da montanha, descida rápida... o que vem a seguir?",
    correct: "A reta final até a chegada",
    wrongs: ["Outra largada", "Parar no meio do caminho", "Voltar pro início da subida"],
    reason: "Depois da descida, vem a reta final até a linha de chegada.",
  },
  {
    prompt: "🎾 Num set de tênis: saque, troca de bolas na rede, um jogador erra... o que vem a seguir?",
    correct: "O outro jogador ganha o ponto",
    wrongs: ["O jogo recomeça do zero", "Os dois saem da quadra", "Ninguém ganha o ponto"],
    reason: "Quando um jogador erra, o ponto vai pro outro jogador.",
  },
  {
    prompt: "✅ O jogo acabou. ✅ Os times se cumprimentaram. O que vem a seguir?",
    correct: "Tomar água e descansar",
    wrongs: ["Começar outro jogo do zero", "Ir dormir no campo", "Sair correndo sem motivo"],
    reason: "Depois do jogo, o corpo pede água e descanso.",
  },
  {
    prompt: "🤸 Numa apresentação de ginástica: a atleta corre e salta na trave... o que vem a seguir?",
    correct: "Ela faz a aterrissagem com equilíbrio",
    wrongs: ["Ela começa tudo de novo", "Ela sai correndo da quadra", "Ela para parada no ar"],
    reason: "Depois do salto, o próximo passo é a aterrissagem com equilíbrio.",
  },
  {
    prompt: "🏖️ Numa jogada de vôlei de praia: o time recebe o saque e levanta a bola... o que vem a seguir?",
    correct: "Alguém ataca a bola por cima da rede",
    wrongs: ["Todo mundo sai da quadra", "O jogo é cancelado", "A bola fica parada no ar"],
    reason: "Depois de levantar, o próximo passo natural é atacar por cima da rede.",
  },
];

export const NEXT_STEP_GENERATORS: ChallengeGenerator[] = SCENARIOS.map(
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
