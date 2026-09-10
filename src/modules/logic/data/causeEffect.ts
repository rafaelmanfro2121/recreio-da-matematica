import type { Puzzle } from "../types";
import { pick, shuffle, uid } from "../engine/random";

interface Scenario {
  tier: number;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const SCENARIOS: Scenario[] = [
  {
    tier: 1,
    prompt: "Pedro deixou o sorvete em cima da mesa, bem no sol, por muito tempo.",
    options: ["O sorvete derrete", "O sorvete fica mais gelado", "O sorvete vira gelo duro", "Nada muda"],
    correctIndex: 0,
    explanation: "O calor do sol derrete o sorvete rapidinho.",
  },
  {
    tier: 1,
    prompt: "Ana regou a plantinha todos os dias e deu bastante luz do sol pra ela.",
    options: ["A planta cresce forte", "A planta murcha", "A planta vira pedra", "A planta some"],
    correctIndex: 0,
    explanation: "Água e sol são o que as plantas precisam para crescer fortes.",
  },
  {
    tier: 2,
    prompt: "Lucas esqueceu o guarda-chuva em casa bem quando começou a chover forte.",
    options: ["Ele vai se molhar", "Ele vai ficar bem sequinho", "A chuva para na hora", "Vai fazer sol de repente"],
    correctIndex: 0,
    explanation: "Sem guarda-chuva na chuva, é bem provável que ele se molhe.",
  },
  {
    tier: 2,
    prompt: "Marina estudou bastante para a prova a semana inteira.",
    options: ["Ela vai mal na prova", "Ela vai bem na prova", "A prova é cancelada", "Ela esquece tudo"],
    correctIndex: 1,
    explanation: "Estudar bastante ajuda a gente a se sair bem na prova.",
  },
  {
    tier: 2,
    prompt: "O menino deixou a porta da gaiola do passarinho aberta sem perceber.",
    options: ["O passarinho pode voar para fora", "O passarinho dorme mais", "A gaiola fica mais segura", "Nada acontece"],
    correctIndex: 0,
    explanation: "Com a porta aberta, o passarinho tem como sair voando.",
  },
  {
    tier: 3,
    prompt: "João empilhou muitos livros pesados em cima de uma mesinha bem fraquinha.",
    options: ["A mesinha pode quebrar", "A mesinha fica mais forte", "Os livros ficam mais leves", "Nada acontece"],
    correctIndex: 0,
    explanation: "Peso demais numa mesa fraca pode fazer ela quebrar.",
  },
  {
    tier: 3,
    prompt: "Sofia colocou o bolo no forno quente e esqueceu de olhar o relógio.",
    options: ["O bolo pode queimar", "O bolo fica cru", "O bolo fica geladinho", "O forno desliga sozinho sempre"],
    correctIndex: 0,
    explanation: "Ficar tempo demais no forno quente pode queimar o bolo.",
  },
  {
    tier: 3,
    prompt: "O menino deu corda demais no carrinho de brinquedo, além do que ele aguentava.",
    options: ["A mola pode quebrar", "O carrinho anda mais devagar", "O carrinho fica novo", "Nada muda"],
    correctIndex: 0,
    explanation: "Forçar demais a corda pode arrebentar a mola de dentro do brinquedo.",
  },
  {
    tier: 4,
    prompt: "Um grupo de formigas encontrou um pedacinho de açúcar caído no chão da cozinha.",
    options: [
      "Mais formigas aparecem para carregar o açúcar",
      "As formigas vão embora sem olhar",
      "O açúcar desaparece sozinho",
      "As formigas dormem perto dele",
    ],
    correctIndex: 0,
    explanation: "Formigas avisam as outras quando acham comida, e logo aparecem mais.",
  },
  {
    tier: 4,
    prompt: "Rafael não escovou os dentes por vários dias seguidos.",
    options: ["Pode aparecer cárie nos dentes", "Os dentes ficam mais brancos", "Os dentes crescem mais rápido", "Nada muda nunca"],
    correctIndex: 0,
    explanation: "Sem escovar, os restos de comida podem causar cárie nos dentes.",
  },
  {
    tier: 5,
    prompt: "A cidade ficou muitas semanas seguidas sem nenhuma chuva.",
    options: ["Os rios e lagos podem baixar de nível", "Os rios enchem mais rápido", "As plantas crescem mais fortes", "Nada muda no ambiente"],
    correctIndex: 0,
    explanation: "Sem chuva por muito tempo, a água dos rios e lagos vai diminuindo.",
  },
  {
    tier: 5,
    prompt: "Pedro guardou uma barra de chocolate no congelador e esqueceu lá por vários dias.",
    options: ["O chocolate fica durinho e gelado", "O chocolate derrete todo", "O chocolate vira suco", "O chocolate fica quentinho"],
    correctIndex: 0,
    explanation: "O congelador deixa as coisas bem geladas e duras, inclusive o chocolate.",
  },
];

export function generateCauseEffectPuzzle(difficulty: number): Puzzle {
  const eligible = SCENARIOS.filter((s) => s.tier <= difficulty + 1);
  const scenario = pick(eligible.length ? eligible : SCENARIOS.filter((s) => s.tier === 1));

  const indices = shuffle([0, 1, 2, 3]);
  const options = indices.map((i) => ({
    id: uid(),
    label: scenario.options[i],
    isCorrect: i === scenario.correctIndex,
  }));
  const correct = options.find((o) => o.isCorrect)!;

  return {
    id: uid(),
    type: "cause-effect",
    heading: "O que deve acontecer?",
    prompt: scenario.prompt,
    options: options.map(({ id, label }) => ({ id, label })),
    correctOptionId: correct.id,
    explanation: scenario.explanation,
    difficulty,
    columns: 1,
  };
}
