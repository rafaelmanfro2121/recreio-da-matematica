import type { Puzzle } from "../types";
import { pick, sample, shuffle, uid } from "../engine/random";

interface OddCandidate {
  label: string;
  /** How subtle the mismatch is — higher tiers fit closer to the category. */
  tier: number;
  note: string;
}

interface OddOneOutGroup {
  category: string;
  members: string[];
  odd: OddCandidate[];
}

const GROUPS: OddOneOutGroup[] = [
  {
    category: "frutas",
    members: ["🍎 maçã", "🍌 banana", "🍇 uva", "🍊 laranja", "🍓 morango", "🍉 melancia"],
    odd: [
      { label: "🚗 carro", tier: 1, note: "Carro é um veículo, não uma fruta." },
      { label: "🐶 cachorro", tier: 1, note: "Cachorro é um animal, não uma fruta." },
      { label: "🥕 cenoura", tier: 3, note: "Cenoura é um legume, não uma fruta." },
      { label: "🥔 batata", tier: 3, note: "Batata é um legume, não uma fruta." },
    ],
  },
  {
    category: "bichos que voam",
    members: ["🦅 águia", "🦜 papagaio", "🦋 borboleta", "🐝 abelha", "🦇 morcego"],
    odd: [
      { label: "🐟 peixe", tier: 1, note: "Peixe nada na água, não voa." },
      { label: "🐘 elefante", tier: 1, note: "Elefante é grande demais para voar." },
      { label: "🐢 tartaruga", tier: 2, note: "Tartaruga anda bem devagar no chão." },
      { label: "🐧 pinguim", tier: 4, note: "Pinguim é uma ave, mas não consegue voar." },
    ],
  },
  {
    category: "meios de transporte",
    members: ["🚗 carro", "🚌 ônibus", "🚲 bicicleta", "🚂 trem", "✈️ avião"],
    odd: [
      { label: "🏠 casa", tier: 1, note: "Casa não anda, é onde a gente mora." },
      { label: "🍎 maçã", tier: 1, note: "Maçã é uma fruta, não serve para andar." },
      { label: "🐴 cavalo", tier: 3, note: "Cavalo é um animal, não uma máquina." },
    ],
  },
  {
    category: "instrumentos musicais",
    members: ["🎸 violão", "🥁 tambor", "🎹 piano", "🎺 trompete", "🎻 violino"],
    odd: [
      { label: "⚽ bola", tier: 1, note: "Bola é para jogar, não para tocar música." },
      { label: "📚 livro", tier: 1, note: "Livro é para ler, não faz música." },
      { label: "🎤 microfone", tier: 3, note: "Microfone ajuda a cantar, mas não é um instrumento." },
    ],
  },
  {
    category: "formas geométricas",
    members: ["Círculo", "Quadrado", "Triângulo", "Retângulo", "Pentágono"],
    odd: [
      { label: "Cachorro", tier: 1, note: "Cachorro é um animal, não uma forma." },
      { label: "Banana", tier: 1, note: "Banana é uma fruta, não uma forma." },
      { label: "Bola", tier: 3, note: "Bola é um objeto redondo, não o nome de uma forma." },
    ],
  },
  {
    category: "objetos de cozinha",
    members: ["🍳 frigideira", "🥄 colher", "🍽️ prato", "🔪 faca", "🥣 tigela"],
    odd: [
      { label: "⚽ bola", tier: 1, note: "Bola é um brinquedo, não fica na cozinha." },
      { label: "📱 celular", tier: 1, note: "Celular não é usado para cozinhar." },
      { label: "🧦 meia", tier: 3, note: "Meia é uma roupa, não um utensílio de cozinha." },
    ],
  },
  {
    category: "coisas de dia frio",
    members: ["⛄ boneco de neve", "🧣 cachecol", "🧤 luva", "🧊 gelo", "🥶 friozinho"],
    odd: [
      { label: "🏖️ praia", tier: 1, note: "Praia a gente aproveita quando está quente." },
      { label: "☀️ sol forte", tier: 2, note: "Sol forte é coisa de dia quente." },
      { label: "🍦 sorvete", tier: 3, note: "Sorvete costuma ser mais lembrado no calor." },
    ],
  },
  {
    category: "refeições do dia",
    members: ["Café da manhã", "Almoço", "Jantar", "Lanche da tarde"],
    odd: [
      { label: "Futebol", tier: 1, note: "Futebol é um esporte, não uma refeição." },
      { label: "Dormir", tier: 2, note: "Dormir é descansar, não é hora de comer." },
      { label: "Escovar os dentes", tier: 3, note: "Isso a gente faz depois de comer, não é uma refeição." },
    ],
  },
  {
    category: "meios de comunicação",
    members: ["📱 celular", "💻 computador", "📺 televisão", "📻 rádio"],
    odd: [
      { label: "🍕 pizza", tier: 1, note: "Pizza é comida, não serve para se comunicar." },
      { label: "🚗 carro", tier: 1, note: "Carro é para andar, não para se comunicar." },
      { label: "📖 livro", tier: 3, note: "Livro é de papel — não usa eletricidade como os outros." },
    ],
  },
  {
    category: "animais aquáticos",
    members: ["🐟 peixe", "🐙 polvo", "🦈 tubarão", "🐬 golfinho", "🦑 lula"],
    odd: [
      { label: "🐦 pássaro", tier: 1, note: "Pássaro voa no céu, não vive na água." },
      { label: "🐿️ esquilo", tier: 1, note: "Esquilo vive nas árvores, não na água." },
      { label: "🐸 sapo", tier: 4, note: "Sapo vive na água e fora dela — mas não é considerado um bicho aquático." },
    ],
  },
];

export function generateOddOneOutPuzzle(difficulty: number): Puzzle {
  const group = pick(GROUPS);
  const eligibleOdd = group.odd.filter((o) => o.tier <= difficulty + 1);
  const odd = pick(eligibleOdd.length ? eligibleOdd : group.odd.filter((o) => o.tier === 1));
  const same = sample(group.members, 3);

  const options = shuffle([...same, odd.label]).map((label) => ({ id: uid(), label }));
  const correct = options.find((o) => o.label === odd.label)!;

  return {
    id: uid(),
    type: "odd-one-out",
    heading: "Qual é diferente?",
    prompt: `Três desses fazem parte do mesmo grupo. Qual não combina com os outros?`,
    options,
    correctOptionId: correct.id,
    explanation: odd.note,
    difficulty,
    columns: 2,
  };
}
