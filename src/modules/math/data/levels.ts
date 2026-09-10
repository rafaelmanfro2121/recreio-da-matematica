import type { Level, Operation, OpMeta } from "../types";

export const OPS_META: Record<Operation, OpMeta> = {
  add: { label: "Somar", symbol: "+", tone: "add" },
  subtract: { label: "Subtrair", symbol: "−", tone: "subtract" },
  multiply: { label: "Multiplicar", symbol: "×", tone: "multiply" },
  divide: { label: "Dividir", symbol: "÷", tone: "divide" },
};

const ASK_WORDS: Record<Operation, string> = {
  add: "de mais",
  subtract: "de menos",
  multiply: "de vezes",
  divide: "de dividir",
};

function joinWords(words: string[]): string {
  if (words.length <= 1) return words[0] ?? "";
  if (words.length === 2) return `${words[0]} ou ${words[1]}`;
  return `${words.slice(0, -1).join(", ")} ou ${words[words.length - 1]}`;
}

export function askBubbleText(level: Level): string {
  return `Essa conta é ${joinWords(level.ops.map((o) => ASK_WORDS[o]))}?`;
}

export const LEVELS: Level[] = [
  {
    id: "add_sub",
    title: "Mais e Menos",
    symbolText: "+ −",
    ops: ["add", "subtract"],
    explainOps: ["add", "subtract"],
    tone: "add",
    description: "Leia a situação, descubra se é de mais ou de menos, e resolva!",
  },
  {
    id: "multiply",
    title: "Multiplicação",
    symbolText: "×",
    ops: ["multiply"],
    explainOps: ["multiply"],
    tone: "multiply",
    contrastNote:
      "Não confunda com a divisão: aqui você JUNTA grupos iguais para saber o total. Na divisão você faz o oposto — REPARTE um total em grupos iguais.",
    description: "Descubra quando usar a multiplicação!",
  },
  {
    id: "divide",
    title: "Divisão",
    symbolText: "÷",
    ops: ["divide"],
    explainOps: ["divide"],
    tone: "divide",
    contrastNote:
      "Não confunda com a multiplicação: aqui você REPARTE um total em grupos iguais. Na multiplicação você faz o oposto — JUNTA grupos iguais para saber o total.",
    description: "Agora é a vez de repartir tudo em partes iguais!",
  },
  {
    id: "pro",
    title: "Nível Pro",
    symbolText: "⭐",
    ops: ["add", "subtract", "multiply", "divide"],
    explainOps: ["add", "subtract", "multiply", "divide"],
    tone: "sun",
    description: "As quatro operações misturadas. Leia com atenção — você é craque!",
  },
];
