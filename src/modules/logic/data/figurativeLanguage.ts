/**
 * Figurative-language puzzles — blended invisibly into the same puzzle
 * rotation as sequences/riddles/etc. Each item shows a common Brazilian
 * Portuguese figure of speech and asks what it really means. One distractor
 * is always the literal ("pé da letra") misreading, so the child practices
 * telling literal from figurative — framed as a fun guessing game, never a
 * test, with a warm explanation every time regardless of the answer.
 */

import type { Puzzle } from "../types";
import { pick, shuffle, uid } from "../engine/random";

interface Idiom {
  tier: number;
  saying: string;
  correct: string;
  literalMisreading: string;
  otherOptions: string[];
  explanation: string;
}

const IDIOMS: Idiom[] = [
  {
    tier: 1,
    saying: '"Está chovendo canivetes lá fora!"',
    correct: "Está chovendo muito forte",
    literalMisreading: "Canivetes estão caindo do céu",
    otherOptions: ["Vai fazer sol o dia todo", "Está nevando"],
    explanation: 'Ninguém quis dizer que facas caem do céu! "Chover canivetes" é só um jeito exagerado de dizer que a chuva está bem forte.',
  },
  {
    tier: 1,
    saying: '"O Pedro está com a cabeça nas nuvens hoje."',
    correct: "Ele está distraído, pensando em outra coisa",
    literalMisreading: "A cabeça dele está flutuando no céu",
    otherOptions: ["Ele está com sono", "Ele está com frio"],
    explanation: 'A cabeça do Pedro continua no lugar certo! "Cabeça nas nuvens" quer dizer que alguém está meio distraído, viajando no pensamento.',
  },
  {
    tier: 1,
    saying: '"Vou dar um pulo lá em casa mais tarde."',
    correct: "Vou visitar rapidinho",
    literalMisreading: "Vou literalmente pular até em casa",
    otherOptions: ["Vou dormir na sua casa", "Vou mudar de casa"],
    explanation: '"Dar um pulo" não é pular de verdade — é um jeito de dizer que a visita vai ser rápida.',
  },
  {
    tier: 2,
    saying: '"Fiquei de boca aberta com aquele mágico!"',
    correct: "Fiquei muito surpreso/admirado",
    literalMisreading: "A boca ficou aberta por horas",
    otherOptions: ["Fiquei com fome", "Fiquei com sono"],
    explanation: '"Ficar de boca aberta" é um jeito de mostrar surpresa — ninguém fica de boca aberta de verdade por muito tempo!',
  },
  {
    tier: 2,
    saying: '"Esse presente custou os olhos da cara!"',
    correct: "O presente foi muito caro",
    literalMisreading: "Alguém trocou o presente pelos próprios olhos",
    otherOptions: ["O presente veio de graça", "O presente era muito pequeno"],
    explanation: 'Ninguém trocou os olhos por nada! "Custar os olhos da cara" é só uma forma de dizer que algo custou muito dinheiro.',
  },
  {
    tier: 2,
    saying: '"Depois da bronca, ele ficou com a pulga atrás da orelha."',
    correct: "Ele ficou desconfiado",
    literalMisreading: "Uma pulga de verdade estava atrás da orelha dele",
    otherOptions: ["Ele ficou com coceira", "Ele ficou feliz"],
    explanation: 'Não tinha pulga nenhuma! "Pulga atrás da orelha" quer dizer que a pessoa ficou desconfiada, com um pé atrás.',
  },
  {
    tier: 3,
    saying: '"Antes da prova, senti borboletas no estômago."',
    correct: "Fiquei nervoso e ansioso",
    literalMisreading: "Borboletas de verdade estavam voando dentro da barriga",
    otherOptions: ["Fiquei com dor de barriga de comida", "Fiquei com muito sono"],
    explanation: 'Calma, nenhuma borboleta entra na barriga de ninguém! É um jeito bonito de descrever aquele friozinho de nervosismo antes de algo importante.',
  },
  {
    tier: 3,
    saying: '"Minha vó tem um coração de ouro."',
    correct: "Ela é uma pessoa muito boa e generosa",
    literalMisreading: "O coração dela é feito do metal ouro",
    otherOptions: ["Ela adora joias", "Ela é muito rica"],
    explanation: '"Coração de ouro" não é sobre metal — é sobre ter um jeito gentil e generoso com as pessoas.',
  },
  {
    tier: 3,
    saying: '"Depois do sumiço do cachorro, a casa ficou de cabeça para baixo."',
    correct: "A casa ficou uma bagunça, todo mundo agitado procurando",
    literalMisreading: "A casa virou de ponta-cabeça de verdade",
    otherOptions: ["A casa ficou bem quieta", "Todo mundo foi dormir cedo"],
    explanation: 'A casa não virou mesmo de cabeça pra baixo! É um jeito de dizer que ficou tudo bagunçado e agitado.',
  },
  {
    tier: 4,
    saying: '"Ele não tem papas na língua."',
    correct: "Ele fala a verdade sem enrolar",
    literalMisreading: "Ele não gosta de comer papinha",
    otherOptions: ["Ele fala muito baixinho", "Ele não gosta de conversar"],
    explanation: '"Não ter papas na língua" não tem nada a ver com comida — é sobre falar direto, sem enrolação.',
  },
  {
    tier: 4,
    saying: '"Precisamos pisar em ovos com esse assunto."',
    correct: "Precisamos ter muito cuidado, é um assunto delicado",
    literalMisreading: "Precisamos literalmente pisar em cima de ovos",
    otherOptions: ["Precisamos fazer uma omelete", "Precisamos ter pressa"],
    explanation: 'Não tem ovo nenhum no chão! "Pisar em ovos" é falar com cuidado sobre algo delicado, para não magoar ninguém.',
  },
  {
    tier: 5,
    saying: '"Aquele susto me deixou de cabelo em pé."',
    correct: "Fiquei com muito medo ou surpreso",
    literalMisreading: "Cada fio de cabelo ficou reto e duro para sempre",
    otherOptions: ["Fiquei com o cabelo bagunçado do vento", "Fiquei animado para pentear o cabelo"],
    explanation: 'O cabelo pode até arrepiar um pouquinho de susto, mas "ficar de cabelo em pé" é sobre o medo ou a surpresa, não sobre o penteado.',
  },
  {
    tier: 5,
    saying: '"Não adianta chorar sobre o leite derramado."',
    correct: "Não adianta ficar triste por algo que já aconteceu e não tem mais solução",
    literalMisreading: "É proibido chorar perto de leite no chão",
    otherOptions: ["É melhor limpar o leite rapidinho", "É bom sempre usar copo com tampa"],
    explanation: 'Ninguém está falando de leite de verdade! É um jeito de dizer: já aconteceu, então melhor seguir em frente em vez de ficar remoendo.',
  },
];

export function generateFigurativePuzzle(difficulty: number): Puzzle {
  const eligible = IDIOMS.filter((it) => it.tier <= difficulty + 1);
  const idiom = pick(eligible.length ? eligible : IDIOMS.filter((it) => it.tier === 1));

  const rawOptions = shuffle([idiom.correct, idiom.literalMisreading, ...idiom.otherOptions]);
  const options = rawOptions.map((label) => ({ id: uid(), label }));
  const correct = options.find((o) => o.label === idiom.correct)!;

  return {
    id: uid(),
    type: "figurative",
    heading: "Do jeito que a gente fala...",
    prompt: `${idiom.saying}\nO que isso quer dizer de verdade?`,
    options,
    correctOptionId: correct.id,
    explanation: idiom.explanation,
    difficulty,
    columns: 1,
  };
}
