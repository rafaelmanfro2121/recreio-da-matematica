/**
 * Central bank of feedback phrases. Tone rules: never say "errado" or "falhou" —
 * always effort-first, always invite another try. Picked randomly so the mascots
 * don't repeat themselves round after round.
 */

function pick(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)];
}

const CORRECT_PHRASES = [
  "Isso aí! Mandou bem.",
  "Boa! Você acertou em cheio.",
  "Show de bola!",
  "Exato! Continua assim.",
  "Muito bem, essa foi rápida!",
  "Certinho! Você tá voando.",
  "Perfeito!",
  "Isso mesmo, parabéns!",
];

const TRY_AGAIN_PHRASES = [
  "Quase lá! Vamos tentar de outro jeito?",
  "Foi por pouco! Dá uma olhada de novo.",
  "Essa foi enroladinha mesmo. Bora de novo?",
  "Ainda não foi dessa vez, mas você já entendeu o caminho.",
  "Sem problema, errar faz parte de aprender. Tenta mais uma vez!",
  "Quase! Respira e olha com calma de novo.",
  "Essa pegou todo mundo às vezes. Vamos repetir?",
];

const LEVEL_COMPLETE_PHRASES = [
  "Fase completa! Você tá cada vez melhor nisso.",
  "Mandou muito bem nessa fase!",
  "Uhul, fase concluída com estilo!",
  "Você terminou! Que orgulho.",
];

const LEVEL_COMPLETE_PERFECT_PHRASES = [
  "Perfeito! Você acertou tudo!",
  "Nota mil! Zero erros nessa fase!",
  "Impecável! Você é craque nisso.",
];

const EFFORT_PHRASES = [
  "Gostei de como você pensou nessa.",
  "Você tá se esforçando bastante, dá pra ver.",
  "Continua tentando, isso é o que importa.",
  "Cada tentativa te deixa mais rápido nisso.",
];

const STREAK_PHRASES = ["Você tá numa sequência boa!", "Olha essa sequência de acertos!", "Ritmo excelente!"];

export function correctPhrase(): string {
  return pick(CORRECT_PHRASES);
}

export function tryAgainPhrase(): string {
  // Mixed with the effort-first phrases so encouragement isn't purely about
  // whether the answer was right — trying hard counts too.
  return pick([...TRY_AGAIN_PHRASES, ...EFFORT_PHRASES]);
}

export function levelCompletePhrase(perfect: boolean): string {
  return pick(perfect ? LEVEL_COMPLETE_PERFECT_PHRASES : LEVEL_COMPLETE_PHRASES);
}

export function effortPhrase(): string {
  return pick(EFFORT_PHRASES);
}

export function streakPhrase(): string {
  return pick(STREAK_PHRASES);
}
