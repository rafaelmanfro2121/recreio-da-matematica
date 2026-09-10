import type { Puzzle } from "../types";
import { pick, shuffle, uid } from "../engine/random";

interface Riddle {
  tier: number;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const RIDDLES: Riddle[] = [
  {
    tier: 1,
    prompt: "Tenho quatro patas e late bem alto. O que sou?",
    options: ["Gato", "Cachorro", "Passarinho", "Peixe"],
    correctIndex: 1,
    explanation: "Cachorros latem! Gatos miam e peixes nem fazem barulho fora d'água.",
  },
  {
    tier: 1,
    prompt: "Sou amarela, tenho casca e os macacos adoram me comer. O que sou?",
    options: ["Maçã", "Banana", "Uva", "Melancia"],
    correctIndex: 1,
    explanation: "A banana é amarela, tem casca e é a fruta favorita dos macacos nos desenhos.",
  },
  {
    tier: 1,
    prompt: "Tenho oito pernas e faço teia. O que sou?",
    options: ["Formiga", "Aranha", "Abelha", "Borboleta"],
    correctIndex: 1,
    explanation: "Só a aranha tem oito pernas e sabe tecer teia.",
  },
  {
    tier: 2,
    prompt: "Brilho no céu à noite e mudo de formato aos poucos. O que sou?",
    options: ["Sol", "Lua", "Nuvem", "Estrela"],
    correctIndex: 1,
    explanation: "A Lua muda de formato no céu — são as fases da lua!",
  },
  {
    tier: 2,
    prompt: "Tenho páginas, mas não sou uma árvore. Você me lê. O que sou?",
    options: ["Livro", "Janela", "Mesa", "Sapato"],
    correctIndex: 0,
    explanation: "O livro tem páginas cheias de histórias para você ler.",
  },
  {
    tier: 2,
    prompt: "Tenho dentes, mas não mordo. Ajudo a arrumar seu cabelo. O que sou?",
    options: ["Pente", "Escova de dente", "Garfo", "Tesoura"],
    correctIndex: 0,
    explanation: "O pente tem \"dentes\" que ajudam a desembaraçar o cabelo.",
  },
  {
    tier: 3,
    prompt: "Quanto mais eu seco as coisas, mais molhada eu fico. O que sou?",
    options: ["Toalha", "Guarda-chuva", "Esponja", "Sabonete"],
    correctIndex: 0,
    explanation: "A toalha fica molhada bem quando está secando outras coisas.",
  },
  {
    tier: 3,
    prompt: "Tenho ponteiros como um relógio, mas fico presa no seu pulso. O que sou?",
    options: ["Anel", "Relógio de pulso", "Pulseira", "Colar"],
    correctIndex: 1,
    explanation: "O relógio de pulso tem ponteiros e fica amarrado no seu braço.",
  },
  {
    tier: 3,
    prompt: "Nasço pequenininha, cresço um pouco todo dia, mas nunca ando de um lugar para o outro. O que sou?",
    options: ["Planta", "Pipoca", "Nuvem", "Sombra"],
    correctIndex: 0,
    explanation: "A planta cresce todo dia bem devagar, mas fica sempre no mesmo lugar.",
  },
  {
    tier: 4,
    prompt: "Tenho cidades, mas nenhuma casa; tenho montanhas, mas nenhuma pedra; tenho rios, mas nenhum peixe. O que sou?",
    options: ["Mapa", "Livro", "Globo", "Quadro"],
    correctIndex: 0,
    explanation: "O mapa mostra cidades, montanhas e rios desenhados, mas são só desenhos!",
  },
  {
    tier: 4,
    prompt: "Quanto mais você tira de mim, maior eu fico. O que sou?",
    options: ["Bolo", "Buraco", "Sombra", "Caixa"],
    correctIndex: 1,
    explanation: "Quando você cava e tira terra de um buraco, ele fica cada vez maior.",
  },
  {
    tier: 4,
    prompt: "Tenho um rosto e dois ponteiros, mas não tenho olhos nem boca. O que sou?",
    options: ["Boneco", "Relógio", "Robô", "Retrato"],
    correctIndex: 1,
    explanation: "O relógio tem \"rosto\" (o mostrador) e ponteiros, mas não tem olhos de verdade.",
  },
  {
    tier: 5,
    prompt: "Não tenho vida, mas posso morrer. Não tenho pulmões, mas preciso de ar. O que sou?",
    options: ["Fogo", "Vento", "Água", "Sombra"],
    correctIndex: 0,
    explanation: "O fogo precisa de ar para continuar aceso, e se apaga como se \"morresse\".",
  },
  {
    tier: 5,
    prompt: "Quanto mais eu tenho, menos você enxerga. O que sou?",
    options: ["Escuridão", "Luz", "Nuvem", "Fumaça"],
    correctIndex: 0,
    explanation: "Quanto mais escuridão, mais difícil fica de enxergar as coisas.",
  },
];

export function generateRiddlePuzzle(difficulty: number): Puzzle {
  const eligible = RIDDLES.filter((r) => r.tier <= difficulty + 1);
  const riddle = pick(eligible.length ? eligible : RIDDLES.filter((r) => r.tier === 1));

  const indices = shuffle([0, 1, 2, 3]);
  const options = indices.map((i) => ({ id: uid(), label: riddle.options[i], isCorrect: i === riddle.correctIndex }));
  const correct = options.find((o) => o.isCorrect)!;

  return {
    id: uid(),
    type: "riddle",
    heading: "Adivinha só...",
    prompt: riddle.prompt,
    options: options.map(({ id, label }) => ({ id, label })),
    correctOptionId: correct.id,
    explanation: riddle.explanation,
    difficulty,
    columns: 2,
  };
}
