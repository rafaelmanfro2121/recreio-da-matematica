import type { Puzzle } from "../types";
import { pick, shuffle, uid } from "../engine/random";

interface Goal {
  tier: number;
  prompt: string;
  steps: string[];
}

const GOALS: Goal[] = [
  {
    tier: 1,
    prompt: "Qual é a ordem certa para fazer um sanduíche de manteiga?",
    steps: ["Pegar duas fatias de pão", "Passar manteiga no pão", "Juntar as fatias e comer"],
  },
  {
    tier: 1,
    prompt: "Qual é a ordem certa para escovar os dentes?",
    steps: ["Pegar a escova e passar a pasta", "Escovar os dentes com carinho", "Enxaguar a boca com água"],
  },
  {
    tier: 1,
    prompt: "Qual é a ordem certa para amarrar o cadarço do tênis?",
    steps: ["Cruzar as duas pontas do cadarço", "Dar um laço em cada ponta", "Puxar para apertar o nó"],
  },
  {
    tier: 2,
    prompt: "Qual é a ordem certa para se arrumar antes de dormir?",
    steps: ["Vestir o pijama", "Escovar os dentes", "Ir para a cama"],
  },
  {
    tier: 2,
    prompt: "Qual é a ordem certa para plantar uma sementinha?",
    steps: ["Colocar terra no vaso", "Colocar a sementinha na terra", "Regar com um pouco de água"],
  },
  {
    tier: 3,
    prompt: "Qual é a ordem certa para fazer um suco de laranja?",
    steps: ["Cortar a laranja ao meio", "Espremer a laranja", "Colocar o suco no copo"],
  },
  {
    tier: 3,
    prompt: "Qual é a ordem certa para sair de casa para a escola?",
    steps: ["Tomar café da manhã", "Vestir o uniforme", "Colocar a mochila nas costas", "Sair de casa"],
  },
  {
    tier: 4,
    prompt: "Qual é a ordem certa para montar uma pipa e soltar?",
    steps: [
      "Montar a estrutura da pipa",
      "Amarrar a linha na pipa",
      "Levar a pipa para um lugar aberto",
      "Soltar a pipa no vento",
    ],
  },
  {
    tier: 4,
    prompt: "Qual é a ordem certa para fazer um bolo simples?",
    steps: ["Misturar os ingredientes na tigela", "Colocar a massa na forma", "Assar no forno", "Esperar esfriar para comer"],
  },
  {
    tier: 5,
    prompt: "Qual é a ordem certa para organizar uma festa de aniversário?",
    steps: [
      "Escolher a data e convidar os amigos",
      "Decorar a casa",
      "Preparar o bolo e os doces",
      "Receber os convidados e comemorar",
    ],
  },
];

function stepsLabel(steps: string[]): string {
  return steps.map((s, i) => `${i + 1}. ${s}`).join("  →  ");
}

function isSameOrder(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((step, i) => step === b[i]);
}

function wrongOrderings(steps: string[], count: number): string[][] {
  const results: string[][] = [];
  let guard = 0;
  while (results.length < count && guard < 60) {
    guard++;
    const candidate = shuffle(steps);
    if (isSameOrder(candidate, steps)) continue;
    if (results.some((r) => isSameOrder(r, candidate))) continue;
    results.push(candidate);
  }
  return results;
}

export function generatePlanningPuzzle(difficulty: number): Puzzle {
  const eligible = GOALS.filter((g) => g.tier <= difficulty + 1);
  const goal = pick(eligible.length ? eligible : GOALS.filter((g) => g.tier === 1));

  const wrongCount = difficulty >= 3 ? 3 : 2;
  const wrongs = wrongOrderings(goal.steps, wrongCount);

  const optionOrders = shuffle([goal.steps, ...wrongs]);
  const options = optionOrders.map((order) => ({ id: uid(), label: stepsLabel(order), isCorrect: isSameOrder(order, goal.steps) }));
  const correct = options.find((o) => o.isCorrect)!;

  return {
    id: uid(),
    type: "planning",
    heading: "Pense nos passos...",
    prompt: goal.prompt,
    options: options.map(({ id, label }) => ({ id, label })),
    correctOptionId: correct.id,
    explanation: `A ordem certa é: ${stepsLabel(goal.steps)}.`,
    difficulty,
    columns: 1,
  };
}
