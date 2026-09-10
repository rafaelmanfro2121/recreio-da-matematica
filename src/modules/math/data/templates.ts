/**
 * Word-problem template bank. Ported verbatim (copy and pedagogy) from the
 * proven old vanilla-JS build — do not rewrite the Portuguese text or the
 * "reason" explanations, they are precise, tested descriptions of which
 * clue word signals which operation.
 */
import { pick, randInt } from "../engine/random";
import type { NumberFormat, Operation, WordProblemTemplate } from "../types";

interface NameEntry {
  name: string;
  g: "f" | "m";
}

const NAMES: NameEntry[] = [
  { name: "Maria", g: "f" },
  { name: "João", g: "m" },
  { name: "Ana", g: "f" },
  { name: "Pedro", g: "m" },
  { name: "Sofia", g: "f" },
  { name: "Lucas", g: "m" },
  { name: "Laura", g: "f" },
  { name: "Miguel", g: "m" },
  { name: "Júlia", g: "f" },
  { name: "Davi", g: "m" },
  { name: "Beatriz", g: "f" },
  { name: "Gabriel", g: "m" },
];

const OBJECTS: string[] = [
  "biscoitos",
  "figurinhas",
  "bolinhas de gude",
  "lápis",
  "balas",
  "adesivos",
  "carrinhos",
  "flores",
  "maçãs",
  "livros",
  "bonecos",
  "chocolates",
  "balões",
  "botões",
];

export function formatMoney(cents: number): string {
  const reais = Math.floor(cents / 100);
  const centavos = cents % 100;
  return `R$ ${reais},${String(centavos).padStart(2, "0")}`;
}

const CENT_OPTIONS = [0, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90];

function priceCents(minReais: number, maxReais: number): number {
  return randInt(minReais, maxReais) * 100 + pick(CENT_OPTIONS);
}

export function formatOperand(value: number, format: NumberFormat): string {
  return format === "money" ? formatMoney(value) : String(value);
}

function pickTwoDistinctNames(): [NameEntry, NameEntry] {
  const a = pick(NAMES);
  let b = pick(NAMES);
  while (b.name === a.name) b = pick(NAMES);
  return [a, b];
}

function pronoun(p: NameEntry): string {
  return p.g === "f" ? "ela" : "ele";
}

export const TEMPLATES: Record<Operation, WordProblemTemplate[]> = {
  add: [
    () => {
      const p = pick(NAMES);
      const obj = pick(OBJECTS);
      const a = randInt(4, 22);
      const b = randInt(2, 18);
      return {
        text: `${p.name} tinha ${a} ${obj}. De presente, ${pronoun(p)} ganhou mais ${b} ${obj}.`,
        question: `Com quantos ${obj} ${p.name} ficou?`,
        a,
        b,
        answer: a + b,
        reason: `Quando "ganhamos mais" alguma coisa, a quantidade aumenta — por isso essa conta é de SOMA (+).`,
      };
    },
    () => {
      const [p1, p2] = pickTwoDistinctNames();
      const obj = pick(OBJECTS);
      const a = randInt(3, 20);
      const b = randInt(3, 20);
      return {
        text: `${p1.name} tem ${a} ${obj} e ${p2.name} tem ${b} ${obj}.`,
        question: `Quantos ${obj} os dois têm juntos?`,
        a,
        b,
        answer: a + b,
        reason: `A palavra "juntos" mostra que estamos juntando duas quantidades — por isso essa conta é de SOMA (+).`,
      };
    },
    () => {
      const obj = pick(OBJECTS);
      const a = randInt(5, 25);
      const b = randInt(2, 15);
      return {
        text: `Na caixa tinha ${a} ${obj}. Alguém colocou mais ${b} ${obj} dentro dela.`,
        question: `Quantos ${obj} tem na caixa agora?`,
        a,
        b,
        answer: a + b,
        reason: `Quando colocamos mais alguma coisa dentro, a quantidade aumenta — por isso essa conta é de SOMA (+).`,
      };
    },
    () => {
      const a = randInt(6, 25);
      const b = randInt(2, 15);
      return {
        text: `Na festa tinham ${a} crianças brincando. Depois, chegaram mais ${b} crianças.`,
        question: `Quantas crianças tem na festa agora?`,
        a,
        b,
        answer: a + b,
        reason: `"Chegar mais" quer dizer que a quantidade aumentou — por isso essa conta é de SOMA (+).`,
      };
    },
    () => {
      const p = pick(NAMES);
      const a = priceCents(2, 9);
      const b = priceCents(1, 8);
      return {
        text: `${p.name} tem ${formatMoney(a)} guardado e ganhou mais ${formatMoney(b)} de mesada.`,
        question: `Quanto dinheiro ${pronoun(p)} tem agora?`,
        a,
        b,
        answer: a + b,
        aFormat: "money",
        bFormat: "money",
        answerFormat: "money",
        reason: `Quando "ganhamos mais" dinheiro, a quantidade aumenta — por isso essa conta é de SOMA (+).`,
      };
    },
    () => {
      const a = priceCents(1, 6);
      const b = priceCents(1, 6);
      return {
        text: `Um doce custa ${formatMoney(a)} e um suco custa ${formatMoney(b)}.`,
        question: `Quanto você gasta para comprar os dois juntos?`,
        a,
        b,
        answer: a + b,
        aFormat: "money",
        bFormat: "money",
        answerFormat: "money",
        reason: `A palavra "juntos" mostra que estamos somando dois valores — por isso essa conta é de SOMA (+).`,
      };
    },
  ],
  subtract: [
    () => {
      const p = pick(NAMES);
      const obj = pick(OBJECTS);
      const a = randInt(6, 25);
      const b = randInt(1, Math.min(a - 1, 18));
      return {
        text: `${p.name} tinha ${a} ${obj} e comeu ${b}.`,
        question: `Com quantos ${obj} ${p.name} ficou?`,
        a,
        b,
        answer: a - b,
        reason: `Quando "comemos" ou "usamos" parte de alguma coisa, a quantidade diminui — por isso essa conta é de SUBTRAÇÃO (−).`,
      };
    },
    () => {
      const p = pick(NAMES);
      const obj = pick(OBJECTS);
      const a = randInt(6, 25);
      const b = randInt(1, Math.min(a - 1, 18));
      return {
        text: `${p.name} tinha ${a} ${obj} e perdeu ${b} no caminho da escola.`,
        question: `Com quantos ${obj} ${p.name} ficou?`,
        a,
        b,
        answer: a - b,
        reason: `"Perder" significa que a quantidade diminui — por isso essa conta é de SUBTRAÇÃO (−).`,
      };
    },
    () => {
      const p = pick(NAMES);
      const obj = pick(OBJECTS);
      const a = randInt(8, 28);
      const b = randInt(1, Math.min(a - 1, 15));
      return {
        text: `${p.name} tinha ${a} ${obj} e deu ${b} para um amigo.`,
        question: `Com quantos ${obj} ${p.name} ficou?`,
        a,
        b,
        answer: a - b,
        reason: `Quando "damos" parte de alguma coisa para alguém, ficamos com menos — por isso essa conta é de SUBTRAÇÃO (−).`,
      };
    },
    () => {
      const a = randInt(10, 30);
      const b = randInt(1, Math.min(a - 1, 15));
      return {
        text: `Na sala de aula tinham ${a} alunos. ${b} alunos saíram para o recreio.`,
        question: `Quantos alunos ficaram na sala?`,
        a,
        b,
        answer: a - b,
        reason: `Quando alguém "sai", o grupo fica menor — por isso essa conta é de SUBTRAÇÃO (−).`,
      };
    },
    () => {
      const p = pick(NAMES);
      const extra = priceCents(1, 8);
      const b = priceCents(1, 7);
      const a = b + extra;
      return {
        text: `${p.name} tinha ${formatMoney(a)} e gastou ${formatMoney(b)} numa lanchonete.`,
        question: `Quanto dinheiro sobrou com ${pronoun(p)}?`,
        a,
        b,
        answer: a - b,
        aFormat: "money",
        bFormat: "money",
        answerFormat: "money",
        reason: `Quando "gastamos" dinheiro, a quantidade diminui — por isso essa conta é de SUBTRAÇÃO (−).`,
      };
    },
    () => {
      const p = pick(NAMES);
      const extra = priceCents(1, 8);
      const b = priceCents(1, 7);
      const a = b + extra;
      return {
        text: `${p.name} tinha ${formatMoney(a)} e emprestou ${formatMoney(b)} para o irmão.`,
        question: `Quanto dinheiro sobrou com ${pronoun(p)}?`,
        a,
        b,
        answer: a - b,
        aFormat: "money",
        bFormat: "money",
        answerFormat: "money",
        reason: `Quando "damos" ou emprestamos dinheiro, ficamos com menos — por isso essa conta é de SUBTRAÇÃO (−).`,
      };
    },
  ],
  multiply: [
    () => {
      const p = pick(NAMES);
      const obj = pick(OBJECTS);
      const a = randInt(2, 9);
      const b = randInt(2, 9);
      return {
        text: `${p.name} comprou ${a} pacotes com ${b} ${obj} em cada pacote.`,
        question: `Quantos ${obj} ${p.name} comprou ao todo?`,
        a,
        b,
        answer: a * b,
        reason: `Quando temos vários grupos com a MESMA quantidade, usamos MULTIPLICAÇÃO (×) para somar rapidinho.`,
      };
    },
    () => {
      const obj = pick(OBJECTS);
      const a = randInt(2, 9);
      const b = randInt(2, 9);
      return {
        text: `Tem ${a} caixas, cada uma com ${b} ${obj} dentro.`,
        question: `Quantos ${obj} tem no total?`,
        a,
        b,
        answer: a * b,
        reason: `Várias caixas com a MESMA quantidade dentro é um caso de MULTIPLICAÇÃO (×).`,
      };
    },
    () => {
      const a = randInt(2, 9);
      const b = randInt(2, 9);
      return {
        text: `No jardim há ${a} fileiras de flores, com ${b} flores em cada fileira.`,
        question: `Quantas flores há no jardim?`,
        a,
        b,
        answer: a * b,
        reason: `Grupos iguais que se repetem (fileiras) formam uma MULTIPLICAÇÃO (×).`,
      };
    },
    () => {
      const obj = pick(OBJECTS);
      const a = randInt(2, 9);
      const b = randInt(2, 9);
      return {
        text: `${a} amigos ganharam ${b} ${obj} cada um.`,
        question: `Quantos ${obj} foram distribuídos ao todo?`,
        a,
        b,
        answer: a * b,
        reason: `Quando cada pessoa recebe a MESMA quantidade, usamos MULTIPLICAÇÃO (×).`,
      };
    },
    () => {
      const qty = randInt(2, 6);
      const price = priceCents(1, 9);
      return {
        text: `Você comprou ${qty} chocolates. Cada chocolate custa ${formatMoney(price)}.`,
        question: `Quanto você gastou ao todo?`,
        a: qty,
        b: price,
        answer: qty * price,
        aFormat: "count",
        bFormat: "money",
        answerFormat: "money",
        reason: `Quando cada item custa o MESMO valor, usamos MULTIPLICAÇÃO (×) para saber o total.`,
      };
    },
  ],
  divide: [
    () => {
      const p = pick(NAMES);
      const obj = pick(OBJECTS);
      const b = randInt(2, 9);
      const q = randInt(2, 9);
      const a = b * q;
      return {
        text: `${p.name} tem ${a} ${obj} para dividir igualmente entre ${b} amigos.`,
        question: `Quantos ${obj} cada amigo vai receber?`,
        a,
        b,
        answer: q,
        reason: `Quando repartimos algo em partes IGUAIS, usamos DIVISÃO (÷).`,
      };
    },
    () => {
      const b = randInt(2, 9);
      const q = randInt(2, 9);
      const a = b * q;
      return {
        text: `${a} alunos formaram grupos de ${b} pessoas cada.`,
        question: `Quantos grupos foram formados?`,
        a,
        b,
        answer: q,
        reason: `Separar um total em grupos do MESMO tamanho é uma DIVISÃO (÷).`,
      };
    },
    () => {
      const p = pick(NAMES);
      const obj = pick(OBJECTS);
      const b = randInt(2, 9);
      const q = randInt(2, 9);
      const a = b * q;
      return {
        text: `${p.name} tem ${a} ${obj} e quer guardar ${b} em cada caixa.`,
        question: `De quantas caixas ${pronoun(p)} vai precisar?`,
        a,
        b,
        answer: q,
        reason: `Quando repartimos um total em partes iguais, usamos DIVISÃO (÷).`,
      };
    },
    () => {
      const obj = pick(OBJECTS);
      const b = randInt(2, 9);
      const q = randInt(2, 9);
      const a = b * q;
      return {
        text: `${a} ${obj} serão repartidos igualmente entre ${b} crianças.`,
        question: `Quantos ${obj} cada criança vai receber?`,
        a,
        b,
        answer: q,
        reason: `"Repartir igualmente" é sempre uma DIVISÃO (÷).`,
      };
    },
  ],
};
