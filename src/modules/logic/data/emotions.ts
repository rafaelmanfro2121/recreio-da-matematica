/**
 * Emotional-intelligence puzzles — blended invisibly into the same puzzle
 * rotation as sequences/riddles/etc. Two flavors: recognizing how a character
 * in a short scenario likely feels, and choosing the kindest/most helpful
 * response to a friend. Distractors are never cruel or mocking — just less
 * ideal — and every explanation stays warm, whether the pick was right or not.
 */

import type { Puzzle } from "../types";
import { pick, shuffle, uid } from "../engine/random";

interface EmotionItem {
  tier: number;
  kind: "recognize" | "respond";
  scenario: string;
  correct: string;
  otherOptions: string[];
  explanation: string;
}

const ITEMS: EmotionItem[] = [
  {
    tier: 1,
    kind: "recognize",
    scenario: "O Lucas perdeu o brinquedo favorito dele no parque. Como ele deve estar se sentindo?",
    correct: "Triste",
    otherOptions: ["Com muita fome", "Cheio de sono", "Com calor"],
    explanation: "Perder algo especial deixa a gente triste — isso é super normal, e a tristeza passa com o tempo.",
  },
  {
    tier: 1,
    kind: "recognize",
    scenario: "A Sofia ganhou uma medalha na corrida da escola. Como ela deve estar se sentindo?",
    correct: "Feliz e orgulhosa",
    otherOptions: ["Com raiva", "Envergonhada", "Com medo"],
    explanation: "Conquistar algo depois de se esforçar deixa a gente feliz e orgulhoso — foi um trabalho dela!",
  },
  {
    tier: 1,
    kind: "recognize",
    scenario: "O cachorro late bem alto do nada perto do Miguel. Como ele deve estar se sentindo?",
    correct: "Assustado",
    otherOptions: ["Entediado", "Com sede", "Orgulhoso"],
    explanation: "Um susto de repente costuma deixar qualquer um assustado por um instante — é uma reação bem comum.",
  },
  {
    tier: 2,
    kind: "respond",
    scenario: "Seu amigo derrubou o lanche no chão e ficou sem nada para comer. O que você poderia fazer?",
    correct: "Dividir um pouco do seu lanche com ele",
    otherOptions: ["Rir da situação", "Fingir que não viu", "Contar para todo mundo"],
    explanation: "Dividir o lanche é um jeito gentil de ajudar — pequenos gestos assim fazem toda a diferença para quem está precisando.",
  },
  {
    tier: 2,
    kind: "recognize",
    scenario: "A Laura estudou a semana toda, mas tirou uma nota baixa na prova. Como ela deve estar se sentindo?",
    correct: "Desapontada",
    otherOptions: ["Super animada", "Com muito sono", "Enjoada"],
    explanation: "Se esforçar e não conseguir o resultado esperado deixa a gente desapontado — e tudo bem sentir isso antes de tentar de novo.",
  },
  {
    tier: 2,
    kind: "respond",
    scenario: "Um coleguinha novo está sozinho no recreio, sem saber com quem brincar. O que você poderia fazer?",
    correct: "Chamar ele para brincar com você",
    otherOptions: ["Ignorar e continuar brincando sozinho", "Esperar que outra pessoa chame", "Rir do jeito dele"],
    explanation: "Chamar alguém para brincar é uma das formas mais simples e bonitas de fazer um amigo se sentir bem-vindo.",
  },
  {
    tier: 3,
    kind: "recognize",
    scenario: "O time do Davi perdeu o jogo no último minuto. Como ele deve estar se sentindo?",
    correct: "Frustrado",
    otherOptions: ["Super calmo", "Com muita fome", "Entediado"],
    explanation: "Perder um jogo apertado no final costuma deixar a gente frustrado — mas isso não muda o quanto o time se esforçou.",
  },
  {
    tier: 3,
    kind: "respond",
    scenario: "Sua amiga está nervosa porque vai se apresentar na frente da turma. O que você poderia dizer para ela?",
    correct: '"Você vai se sair bem, eu acredito em você!"',
    otherOptions: ['"Todo mundo vai rir se você errar."', '"Isso não é nada demais, para de exagerar."', "Não dizer nada e ir embora"],
    explanation: "Uma palavra de incentivo antes de algo que dá nervoso ajuda muito — mostra que você está do lado da pessoa.",
  },
  {
    tier: 3,
    kind: "recognize",
    scenario: "A Beatriz esperou o ônibus escolar, mas ele passou direto sem parar. Como ela deve estar se sentindo?",
    correct: "Chateada",
    otherOptions: ["Orgulhosa", "Com muito sono", "Cheia de energia"],
    explanation: "Um imprevisto chato como esse deixa a gente chateado na hora — é uma reação bem natural.",
  },
  {
    tier: 4,
    kind: "respond",
    scenario: "Seu irmão mais novo quebrou o seu desenho sem querer e está com medo de você brigar. O que você poderia fazer?",
    correct: "Respirar fundo e explicar com calma que foi sem querer, tudo bem",
    otherOptions: ["Gritar com ele", "Quebrar um brinquedo dele também", "Ficar bravo o dia inteiro"],
    explanation: "Respirar fundo antes de reagir ajuda muito — mostra pro seu irmão que ele pode confiar em você mesmo quando algo dá errado.",
  },
  {
    tier: 4,
    kind: "recognize",
    scenario: "O Gabriel vai se mudar de cidade e vai deixar os amigos da escola. Como ele deve estar se sentindo?",
    correct: "Uma mistura de tristeza e ansiedade",
    otherOptions: ["Totalmente indiferente", "Com muita fome", "Com sono"],
    explanation: "Mudanças grandes na vida costumam trazer sentimentos misturados — tudo bem sentir mais de uma coisa ao mesmo tempo.",
  },
  {
    tier: 5,
    kind: "respond",
    scenario: "Um coleguinha te contou, em segredo, que está com medo de dormir sozinho no escuro. O que você poderia fazer?",
    correct: "Guardar o segredo dele e não contar para ninguém",
    otherOptions: ["Contar para a turma inteira", "Zoar ele na frente dos outros", "Fingir que não ouviu nada"],
    explanation: "Quando alguém confia um segredo à gente, guardar esse segredo é um jeito importante de mostrar respeito e cuidado.",
  },
];

const RECOGNIZE_HEADINGS = ["Vamos pensar juntos?", "Presta atenção nessa cena..."];
const RESPOND_HEADINGS = ["O que você faria?", "Me ajuda a pensar..."];

export function generateEmotionPuzzle(difficulty: number): Puzzle {
  const eligible = ITEMS.filter((it) => it.tier <= difficulty + 1);
  const item = pick(eligible.length ? eligible : ITEMS.filter((it) => it.tier === 1));

  const rawOptions = shuffle([item.correct, ...item.otherOptions]);
  const options = rawOptions.map((label) => ({ id: uid(), label }));
  const correct = options.find((o) => o.label === item.correct)!;

  return {
    id: uid(),
    type: "emotion",
    heading: pick(item.kind === "recognize" ? RECOGNIZE_HEADINGS : RESPOND_HEADINGS),
    prompt: item.scenario,
    options,
    correctOptionId: correct.id,
    explanation: item.explanation,
    difficulty,
    columns: 1,
  };
}
