/**
 * The full roster of Modo Foco mini-games. Each entry pairs a component with
 * the metadata the session flow needs (title/instructions shown once before
 * it starts, category for sampling 3-from-3-different-categories, and the
 * attentionType used only for the jargon-free summary labels).
 */
import { TargetHunt } from "../games/TargetHunt";
import { SpotDifference } from "../games/SpotDifference";
import { FollowBall } from "../games/FollowBall";
import { GreenGoRedStop } from "../games/GreenGoRedStop";
import { ColorWord } from "../games/ColorWord";
import { MasterSays } from "../games/MasterSays";
import { LightSequence } from "../games/LightSequence";
import { WhatsMissing } from "../games/WhatsMissing";
import { ReverseOrder } from "../games/ReverseOrder";
import { ListenTarget } from "../games/ListenTarget";
import { SecretCount } from "../games/SecretCount";
import { FocusMathSequence } from "../games/FocusMathSequence";
import { CompletePattern } from "../games/CompletePattern";
import { StatueChallenge } from "../games/StatueChallenge";
import { MirrorMovement } from "../games/MirrorMovement";
import type { MiniGameDef } from "../types";

export const GAME_REGISTRY: MiniGameDef[] = [
  // Visual / seletiva
  {
    id: "target-hunt",
    title: "Caça ao Alvo",
    instructions: "Ache no campo a bola igual à que aparecer em destaque.",
    category: "visual",
    attentionType: "selective",
    emoji: "🎯",
    component: TargetHunt,
  },
  {
    id: "spot-difference",
    title: "Jogo dos Erros",
    instructions: "Dois times quase iguais! Toque em tudo que for diferente no Time B.",
    category: "visual",
    attentionType: "selective",
    emoji: "🔍",
    component: SpotDifference,
  },
  {
    id: "follow-ball",
    title: "Siga a Bola",
    instructions: "Olha bem onde a bola fica escondida enquanto os potes trocam de lugar.",
    category: "visual",
    attentionType: "selective",
    emoji: "⚽",
    component: FollowBall,
  },

  // Controle de impulso
  {
    id: "green-go-red-stop",
    title: "Verde Vai, Vermelho Para",
    instructions: "Toque só quando o sinal do juiz estiver verde. No vermelho, segura a mão!",
    category: "impulse",
    attentionType: "impulse",
    emoji: "🚦",
    component: GreenGoRedStop,
  },
  {
    id: "color-word",
    title: "Diga a Cor",
    instructions: "Toque na cor da TINTA da palavra, não na cor que ela diz.",
    category: "impulse",
    attentionType: "impulse",
    emoji: "🎨",
    component: ColorWord,
  },
  {
    id: "master-says",
    title: "O Mestre Mandou",
    instructions: "Só faça a ação se o Mestre tiver mandado. Sem a palavra mágica, fica paradinho!",
    category: "impulse",
    attentionType: "impulse",
    emoji: "🎽",
    component: MasterSays,
  },

  // Memória de trabalho
  {
    id: "light-sequence",
    title: "Sequência Luminosa",
    instructions: "Decore a ordem que as luzes acendem e repita tocando na mesma ordem.",
    category: "memory",
    attentionType: "memory",
    emoji: "💡",
    component: LightSequence,
  },
  {
    id: "whats-missing",
    title: "O Que Sumiu?",
    instructions: "Decore tudo que está no campo, depois descubra o que sumiu.",
    category: "memory",
    attentionType: "memory",
    emoji: "❓",
    component: WhatsMissing,
  },
  {
    id: "reverse-order",
    title: "Ordem ao Contrário",
    instructions: "Decore os números na ordem, depois toque neles de trás pra frente.",
    category: "memory",
    attentionType: "memory",
    emoji: "🔢",
    component: ReverseOrder,
  },

  // Auditiva / sustentada
  {
    id: "listen-target",
    title: "Escuta Atenta",
    instructions: "Ouça com atenção e toque em \"Ouvi o apito!\" só quando ouvir o som certo.",
    category: "auditory",
    attentionType: "sustained",
    emoji: "👂",
    component: ListenTarget,
  },
  {
    id: "secret-count",
    title: "Contagem Secreta",
    instructions: "Conte os gols em silêncio na sua cabeça e diga quantos foram no final.",
    category: "auditory",
    attentionType: "sustained",
    emoji: "🤫",
    component: SecretCount,
  },

  // Raciocínio e matemática
  {
    id: "focus-math-sequence",
    title: "Sequência de Foco",
    instructions: "Resolva cada probleminha de bola e mantenha sua barra de foco cheia.",
    category: "reasoning",
    attentionType: "selective",
    emoji: "🧮",
    component: FocusMathSequence,
  },
  {
    id: "complete-pattern",
    title: "Complete o Padrão",
    instructions: "Descubra a regrinha e toque na peça que completa o padrão.",
    category: "reasoning",
    attentionType: "selective",
    emoji: "🧩",
    component: CompletePattern,
  },

  // Corpo / fora da tela
  {
    id: "statue-challenge",
    title: "Desafio de Estátua",
    instructions: "Quando mandar congelar, não toque em nada até o tempo acabar!",
    category: "body",
    attentionType: "impulse",
    emoji: "🗿",
    component: StatueChallenge,
  },
  {
    id: "mirror-movement",
    title: "Movimento Espelho",
    instructions: "Faça o movimento, decore a ordem e depois repita tocando nos ícones.",
    category: "body",
    attentionType: "memory",
    emoji: "🪞",
    component: MirrorMovement,
  },
];
