/**
 * Lesson text and comprehension-check quiz content, ported verbatim from the
 * proven old build.
 */
import { pick } from "../engine/random";
import { balancedOps } from "../engine/generateQuestion";
import type { LessonContent, Operation, QuizCue, QuizItem } from "../types";

export const LESSON: Record<Operation, LessonContent> = {
  add: {
    title: "Soma (+)",
    whatItIs: "Somar é JUNTAR duas quantidades para descobrir quanto existe NO TOTAL.",
    whenToUse:
      "Use a SOMA quando a quantidade AUMENTA: alguém ganha mais, chega mais gente, ou você junta duas coisas.",
    keywords: ["ganhou", "a mais", "juntos", "ao todo", "chegaram", "colocou mais"],
    example: {
      text: "Você tem 3 bolinhas de gude. Seu amigo te dá mais 2 de presente.",
      question: "Quantas bolinhas você tem agora?",
      a: 3,
      b: 2,
      answer: 5,
    },
    moneyNote: "Funciona igual com dinheiro: R$ 3,00 + R$ 2,50 = R$ 5,50.",
  },
  subtract: {
    title: "Subtração (−)",
    whatItIs: "Subtrair é TIRAR uma quantidade de outra para descobrir quanto SOBROU.",
    whenToUse:
      "Use a SUBTRAÇÃO quando a quantidade DIMINUI: alguém come, perde, gasta, dá pra outra pessoa, ou sai do lugar.",
    keywords: ["comeu", "perdeu", "gastou", "deu", "saíram", "sobrou"],
    example: {
      text: "Você tem 5 balas. Você come 2 balas.",
      question: "Quantas balas sobraram?",
      a: 5,
      b: 2,
      answer: 3,
    },
    moneyNote: "Funciona igual com dinheiro: R$ 5,00 − R$ 2,50 = R$ 2,50.",
  },
  multiply: {
    title: "Multiplicação (×)",
    whatItIs: "Multiplicar é somar a MESMA quantidade VÁRIAS VEZES, de um jeito mais rápido.",
    whenToUse: "Use a MULTIPLICAÇÃO quando você tem VÁRIOS GRUPOS DO MESMO TAMANHO e quer saber o total.",
    keywords: ["cada", "cada um", "pacotes de", "fileiras de", "vezes"],
    example: {
      text: "Você tem 3 pacotes de figurinhas, com 4 figurinhas em cada pacote.",
      question: "Quantas figurinhas você tem ao todo?",
      a: 3,
      b: 4,
      answer: 12,
    },
    moneyNote: "Funciona igual com dinheiro: 3 balas de R$ 1,50 cada = R$ 4,50 ao todo.",
  },
  divide: {
    title: "Divisão (÷)",
    whatItIs: "Dividir é REPARTIR uma quantidade em partes IGUAIS.",
    whenToUse:
      "Use a DIVISÃO quando você quer separar um total em grupos iguais, ou descobrir quanto cada um vai receber.",
    keywords: ["dividir entre", "repartir", "cada um vai receber", "em grupos de"],
    example: {
      text: "Você tem 12 balas para dividir igualmente entre 3 amigos.",
      question: "Quantas balas cada amigo vai receber?",
      a: 12,
      b: 3,
      answer: 4,
    },
  },
};

const CUES: Record<Operation, QuizCue[]> = {
  add: [
    { text: "Você GANHOU mais 3 figurinhas de presente.", keyword: "ganhou mais" },
    { text: "CHEGARAM mais 5 convidados na festa.", keyword: "chegaram mais" },
    { text: "Você JUNTOU suas bolinhas de gude com as do seu amigo.", keyword: "juntou" },
    { text: "Alguém COLOCOU mais brinquedos dentro da caixa.", keyword: "colocou mais" },
  ],
  subtract: [
    { text: "Você COMEU 2 biscoitos do pacote.", keyword: "comeu" },
    { text: "Você PERDEU uma bolinha de gude no caminho da escola.", keyword: "perdeu" },
    { text: "Você DEU 3 figurinhas para um amigo.", keyword: "deu" },
    { text: "Alguns alunos SAÍRAM da sala para o recreio.", keyword: "saíram" },
  ],
  multiply: [
    { text: "Você tem 4 pacotes, e CADA UM tem 3 balas dentro.", keyword: "cada um" },
    { text: "São 5 FILEIRAS de flores, com 2 flores em CADA fileira.", keyword: "cada fileira" },
    { text: "CADA UM dos 3 amigos ganhou 4 figurinhas.", keyword: "cada um" },
    { text: "Tem 6 caixas, e CADA caixa tem 2 brinquedos.", keyword: "cada caixa" },
  ],
  divide: [
    { text: "Você quer DIVIDIR suas balas IGUALMENTE entre 3 amigos.", keyword: "dividir igualmente" },
    { text: "Você vai REPARTIR os biscoitos em partes iguais.", keyword: "repartir em partes iguais" },
    { text: "Você quer saber quanto CADA amigo vai RECEBER se repartir tudo.", keyword: "cada... vai receber" },
    { text: "Você vai separar os alunos em GRUPOS do mesmo tamanho.", keyword: "grupos do mesmo tamanho" },
  ],
};

export const LESSON_QUIZ_LENGTH = 6;

export function generateQuizRound(ops: Operation[]): QuizItem[] {
  return balancedOps(ops, LESSON_QUIZ_LENGTH).map((op) => ({ operation: op, ...pick(CUES[op]) }));
}
