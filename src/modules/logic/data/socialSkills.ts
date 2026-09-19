/**
 * Social/emotional "what would you do?" mini-scenarios — woven into the same
 * puzzle rotation as sequences, riddles, etc. (see engine/generatePuzzle.ts).
 * They must never read as a separate "behavior lesson": same card, same
 * ChoiceGrid, same mascot. The one difference is mechanical, not visual —
 * every option is a valid choice (`noWrongAnswer`), so there's no red/green
 * verdict. Each option gets its own warm, game-guide-voiced line that
 * validates the pick and offers a light nudge, in kid-recognizable settings
 * (escola, quadra, treino, parquinho). No clinical language, ever.
 */

import type { Puzzle } from "../types";
import { pick, shuffle, uid } from "../engine/random";

interface SocialOption {
  kind: "evasive" | "assertive" | "impulsive";
  label: string;
  feedback: string;
}

interface SocialScenario {
  category: string;
  scenario: string;
  options: SocialOption[];
}

const SCENARIOS: SocialScenario[] = [
  // 1. Iniciar uma conversa/brincadeira com alguém que não conhece bem
  {
    category: "iniciar-conversa",
    scenario:
      "Você chegou cedo na escola e vê uma criança nova sentada sozinha, mexendo numa cartinha de Pokémon. Vocês nunca conversaram antes.",
    options: [
      {
        kind: "evasive",
        label: "Fica quieto e espera alguém puxar assunto primeiro",
        feedback:
          "Sem pressa nenhuma! Esperar também é uma estratégia válida — só não esquece que, às vezes, o primeiro 'oi' abre um jogo novo inteirinho.",
      },
      {
        kind: "assertive",
        label: "Chega perto e pergunta: 'Nossa, que carta é essa? Posso ver?'",
        feedback:
          "Isso aí! Perguntar sobre o que a pessoa está curtindo é tipo abrir um portal direto pra conversa. Level up desbloqueado.",
      },
      {
        kind: "impulsive",
        label: "Pega a carta da mão dela sem avisar, só pra olhar de perto",
        feedback:
          "Você foi com tudo, isso é coragem! Só que da próxima vez, pergunta antes de pegar — assim a amizade já começa numa boa.",
      },
    ],
  },
  {
    category: "iniciar-conversa",
    scenario:
      "No intervalo, um menino que você só conhece de vista está treinando embaixadinha sozinho perto da quadra. Você queria treinar junto.",
    options: [
      {
        kind: "evasive",
        label: "Fica só olhando de longe, torcendo pra ele te chamar",
        feedback:
          "Torcer também é gostoso, mas ó: pode ser que ele esteja esperando alguém chamar pra jogar junto também! Vale tentar o primeiro passo.",
      },
      {
        kind: "assertive",
        label: "Vai até ele e fala: 'Ei, posso treinar junto? Bora ver quem aguenta mais!'",
        feedback:
          "Isso! Chamar pra um desafio é um jeito show de puxar conversa sem enrolação nenhuma. Combo de coragem + educação.",
      },
      {
        kind: "impulsive",
        label: "Entra correndo e chuta a bola pra longe sem falar nada, só pra chamar atenção",
        feedback:
          "Você tem energia de sobra, adorei! Só que chutar sem avisar pode assustar — chamar com palavras primeiro rende um resultado ainda melhor.",
      },
    ],
  },
  {
    category: "iniciar-conversa",
    scenario: "No parquinho, tem uma criança que você nunca viu balançando sozinha, bem devagar, meio sem graça.",
    options: [
      {
        kind: "evasive",
        label: "Vai pro outro brinquedo e finge que não viu",
        feedback:
          "De boa, ninguém é obrigado a puxar assunto toda hora! Mas se um dia topar arriscar, um parquinho compartilhado rende boas histórias.",
      },
      {
        kind: "assertive",
        label: "Senta no balanço do lado e pergunta o nome dela, contando o seu também",
        feedback: "Mandou bem! Trocar nome é tipo o aperto de mão de um jogo novo — depois disso, tudo fica mais fácil.",
      },
      {
        kind: "impulsive",
        label: "Grita de longe: 'Vem aqui, bora brincar!' sem chegar perto",
        feedback:
          "Gostei da empolgação! Só que gritar de longe às vezes intimida — chegando mais perto e com a voz mais tranquila, a call pega ainda melhor.",
      },
    ],
  },

  // 2. Cumprimentar um amigo
  {
    category: "cumprimentar",
    scenario:
      "Você vê seu melhor amigo do outro lado do corredor da escola depois do fim de semana. Ele te vê e sorri, andando na sua direção.",
    options: [
      {
        kind: "evasive",
        label: "Só acena de longe e desvia pra não parar pra conversar",
        feedback: "Um aceno já é um cumprimento válido! Mas um 'toca aqui' rapidinho deixa o encontro ainda mais gostoso, se der.",
      },
      {
        kind: "assertive",
        label: "Estica a mão pro 'toca aqui' e já pergunta como foi o fim de semana dele",
        feedback: "Isso é nível craque de cumprimento! Gesto + pergunta = combo perfeito pra começar bem o papo.",
      },
      {
        kind: "impulsive",
        label: "Sai correndo e dá um abraço apertado de surpresa, quase derrubando ele",
        feedback:
          "Sua empolgação é contagiante! Só vale ir com um pouco mais de calma no abraço-surpresa, assim ninguém quase cai no chão.",
      },
    ],
  },
  {
    category: "cumprimentar",
    scenario: "Chegando no treino, um colega do time te vê e levanta a mão pra um 'toca aqui'.",
    options: [
      {
        kind: "evasive",
        label: "Finge que não percebeu e vai direto se trocar",
        feedback:
          "Tudo bem ter dias mais na sua! Mas retribuir um 'toca aqui' é rapidinho e deixa todo mundo do time mais unido.",
      },
      {
        kind: "assertive",
        label: "Bate a mão dele e completa com um 'e aí, bora treinar!'",
        feedback: "Aí sim! Retribuir o gesto com uma frase animada é o combo perfeito de time. Level up de parceria.",
      },
      {
        kind: "impulsive",
        label: "Bate a mão com muita força, meio sem querer",
        feedback: "Gostei da energia! Só ajusta a força da próxima vez — um toque leve já passa toda a vibe positiva.",
      },
    ],
  },
  {
    category: "cumprimentar",
    scenario: "Seu primo, que você não vê há um tempo, chega na sua casa e abre os braços pra um abraço.",
    options: [
      {
        kind: "evasive",
        label: "Fica parado, sem saber muito bem o que fazer",
        feedback:
          "Ficar sem graça no começo é super normal! Um abraço rapidinho ou um 'toca aqui' já resolve, sem precisar pensar demais.",
      },
      {
        kind: "assertive",
        label: "Retribui o abraço rapidinho e já pergunta se ele quer jogar alguma coisa",
        feedback: "Isso! Abraço + convite pra brincar é receita clássica de reencontro daora.",
      },
      {
        kind: "impulsive",
        label: "Pula em cima dele igual um furacão, quase derrubando os dois",
        feedback:
          "Adorei a alegria toda! Só ir com um pouco menos de impulso da próxima vez, pra ninguém sair machucado no meio da festa.",
      },
    ],
  },

  // 3. Lidar com perder um jogo/disputa sem desanimar
  {
    category: "perder-sem-desanimar",
    scenario: "Seu time perdeu o jogo de futebol do recreio por um gol de diferença, bem no último minuto.",
    options: [
      {
        kind: "evasive",
        label: "Fica quieto no canto, sem falar com ninguém pelo resto do dia",
        feedback:
          "Ficar quieto um pouquinho pra digerir a perda é normal. Só não esquece de voltar pro grupo depois — seus amigos sentem sua falta!",
      },
      {
        kind: "assertive",
        label: "Respira fundo, parabeniza o outro time e já pensa no próximo jogo",
        feedback: "Isso é nível mestre de jogo limpo! Parabenizar quem ganhou é uma das jogadas mais fortes que existem.",
      },
      {
        kind: "impulsive",
        label: "Chuta a bola longe e reclama que o juiz roubou",
        feedback:
          "A decepção bateu forte, entendo! Só que descontar na bola não muda o placar — respirar fundo antes ajuda a soltar essa raiva de um jeito mais tranquilo.",
      },
    ],
  },
  {
    category: "perder-sem-desanimar",
    scenario: "Você estava ganhando o jogo de tabuleiro até a última rodada, quando seu amigo vira o jogo e ganha.",
    options: [
      {
        kind: "evasive",
        label: "Guarda o jogo rápido e diz que não quer mais jogar",
        feedback:
          "Dá vontade de fechar tudo mesmo quando a virada dói! Só que topar mais uma rodada pode ser sua chance de virar o jogo de volta.",
      },
      {
        kind: "assertive",
        label: "Fala 'boa, você me pegou!' e pergunta se ele topa outra partida",
        feedback: "Isso sim é atitude de campeão! Reconhecer a boa jogada e topar a revanche mostra o quanto você manja do jogo.",
      },
      {
        kind: "impulsive",
        label: "Bate a mão na mesa e diz que o jogo é furada",
        feedback:
          "Perder no fim dói de verdade, eu entendo. Mas descontar no jogo não muda o resultado — guardar essa energia ajuda a jogar ainda melhor da próxima vez.",
      },
    ],
  },
  {
    category: "perder-sem-desanimar",
    scenario: "Na aula de educação física, você chegou em segundo lugar numa corrida que treinou bastante pra ganhar.",
    options: [
      {
        kind: "evasive",
        label: "Some pro fundo da quadra e evita olhar pra galera",
        feedback: "Dá vontade de sumir um pouco mesmo, tudo bem sentir isso. Mas voltar pro grupo rapidinho mostra o quanto você é forte por dentro.",
      },
      {
        kind: "assertive",
        label: "Cumprimenta quem ganhou e pensa no que pode treinar pra melhorar",
        feedback: "Isso é level up de verdade! Pensar no próximo treino em vez de só no resultado é o que faz a gente evoluir.",
      },
      {
        kind: "impulsive",
        label: "Fala que a corrida não valeu porque o outro saiu na frente",
        feedback:
          "Dá uma raiva mesmo quando a gente treina tanto! Só que questionar a corrida não muda o resultado — esse gás todo pode virar ainda mais velocidade no próximo treino.",
      },
    ],
  },

  // 4. Pedir pra entrar numa brincadeira em grupo já em andamento
  {
    category: "entrar-no-grupo",
    scenario: "Um grupo de colegas já está jogando pique-pega há um tempo no recreio. Parece divertido e você quer entrar.",
    options: [
      {
        kind: "evasive",
        label: "Fica de longe olhando, esperando ser chamado",
        feedback:
          "Observar antes de entrar é uma boa estratégia! Mas o grupo pode nem ter percebido que você quer jogar — perguntar destrava isso rapidinho.",
      },
      {
        kind: "assertive",
        label: "Chega perto e pergunta: 'Posso jogar com vocês também?'",
        feedback: "Isso! Perguntar antes de entrar é a senha mágica pra qualquer brincadeira em grupo. Quase sempre a resposta é 'sim, bora!'.",
      },
      {
        kind: "impulsive",
        label: "Entra correndo no meio da brincadeira sem avisar ninguém",
        feedback: "Adorei a vontade de já entrar na ação! Só que combinar antes evita confusão — assim todo mundo já sabe que você tá no jogo.",
      },
    ],
  },
  {
    category: "entrar-no-grupo",
    scenario: "Um grupo está brincando de roda cantada no parquinho, todo mundo de mãos dadas cantando.",
    options: [
      {
        kind: "evasive",
        label: "Fica sentado no banco olhando, sem falar nada",
        feedback:
          "Assistir um pouco antes de entrar é normal, ajuda a pegar o jeito da brincadeira. Quando quiser, é só perguntar — a roda quase sempre abre espaço!",
      },
      {
        kind: "assertive",
        label: "Pergunta pra alguém do grupo: 'Cabe mais um? Posso entrar na roda?'",
        feedback: "Boa! Perguntar se cabe mais um é super educado e quase ninguém diz não pra isso. Combo perfeito pra entrar numa roda nova.",
      },
      {
        kind: "impulsive",
        label: "Se enfia no meio da roda sem pedir, quebrando as mãos que estavam dadas",
        feedback:
          "Sua vontade de participar é ótima! Só que entrar sem avisar pode confundir a brincadeira toda — pedir antes deixa tudo mais redondo (literalmente!).",
      },
    ],
  },
  {
    category: "entrar-no-grupo",
    scenario: "Na hora do intervalo do treino, um grupo está fazendo embaixadinha em círculo, um passando a bola pro outro.",
    options: [
      {
        kind: "evasive",
        label: "Fica esperando alguém perceber que você quer jogar também",
        feedback: "Esperar o convite é uma opção, só que às vezes ele demora! Levantar a mão e perguntar é rapidinho e resolve na hora.",
      },
      {
        kind: "assertive",
        label: "Levanta a mão e fala: 'Deixa eu entrar no rodízio também?'",
        feedback: "Isso aí! Pedir pra entrar no rodízio é jogo limpo total — mostra que você quer jogar respeitando quem já tava lá.",
      },
      {
        kind: "impulsive",
        label: "Rouba a bola de alguém do círculo pra começar a jogar logo",
        feedback:
          "Sua vontade de jogar é gás puro! Só que pegar a bola sem pedir pode fazer o grupo se sentir invadido — pedir antes garante que todo mundo continue se divertindo junto.",
      },
    ],
  },

  // 5. Reagir a uma provocação leve de forma segura, sem se fechar
  {
    category: "provocacao-leve",
    scenario: "Um colega faz uma piadinha sobre o seu lanche na frente de outras pessoas: 'Que lanche estranho, hein!'",
    options: [
      {
        kind: "evasive",
        label: "Guarda o lanche na mochila e fica quieto pelo resto do recreio",
        feedback:
          "Tudo bem querer só guardar o lanche e seguir o dia! Mas seu lanche não fez nada de errado — não precisa se esconder por causa de uma piadinha.",
      },
      {
        kind: "assertive",
        label: "Responde na boa: 'Eu gosto, e é super gostoso — quer experimentar?'",
        feedback:
          "Isso é nível avançado de segurança! Responder com bom humor, sem se abalar, tira toda a graça da provocação — e ainda mostra o quanto você é tranquilo.",
      },
      {
        kind: "impulsive",
        label: "Responde na mesma moeda, zoando alguma coisa dele de volta bem mais forte",
        feedback:
          "Entendo a vontade de revidar na hora! Só que devolver mais forte pode esquentar as coisas — respirar e responder com leveza costuma resolver melhor e mais rápido.",
      },
    ],
  },
  {
    category: "provocacao-leve",
    scenario: "Durante o jogo, alguém fala: 'Nossa, você chuta igual boneco de neve derretendo!' e ri.",
    options: [
      {
        kind: "evasive",
        label: "Para de jogar e fica de cara fechada no canto da quadra",
        feedback:
          "Ficar chateado às vezes é inevitável, tudo bem sentir isso. Mas sair do jogo faz você perder a diversão — respirar fundo e continuar jogando costuma valer mais a pena.",
      },
      {
        kind: "assertive",
        label: "Ri junto e devolve numa boa: 'Pelo menos eu tento, bora ver seu próximo chute!'",
        feedback: "Isso sim é jogo de cintura de verdade! Rir junto e devolver a brincadeira sem drama mostra que provocação nenhuma te abala.",
      },
      {
        kind: "impulsive",
        label: "Empurra a bola com força na direção da pessoa, meio de brincadeira meio de raiva",
        feedback:
          "A vontade de reagir na hora é normal! Só que empurrar com raiva pode virar mal-entendido — uma resposta com palavras costuma resolver sem ninguém se machucar.",
      },
    ],
  },
  {
    category: "provocacao-leve",
    scenario: "Um colega diz: 'Aposto que eu balanço mais alto que você, você é muito devagar!'",
    options: [
      {
        kind: "evasive",
        label: "Desce do balanço e vai pra outro lugar sem falar nada",
        feedback:
          "Se afastar quando algo incomoda é uma opção válida! Mas essa provocação era bem levinha — dava pra continuar curtindo o balanço numa boa.",
      },
      {
        kind: "assertive",
        label: "Fala rindo: 'Pode ser, mas hoje eu tô numa boa só curtindo o balanço!'",
        feedback: "Boa! Levar na esportiva e continuar no seu ritmo mostra segurança total — nem toda provocação precisa virar competição.",
      },
      {
        kind: "impulsive",
        label: "Começa a balançar o mais forte possível pra provar que é mais rápido",
        feedback:
          "Topar o desafio tem sua emoção, adorei a competitividade! Só que forçar demais pode ser perigoso — dá pra mostrar que é forte sem precisar arriscar se machucar.",
      },
    ],
  },
];

const HEADINGS = [
  "O que você faria?",
  "Sua vez de jogar essa!",
  "Level up social — bora lá!",
  "Pensa rápido, e aí?",
  "Sua missão, se aceitar...",
];

export function generateSocialPuzzle(difficulty: number): Puzzle {
  const scenario = pick(SCENARIOS);
  const shuffledOptions = shuffle(scenario.options);
  const options = shuffledOptions.map((o) => ({ id: uid(), label: o.label }));

  const optionFeedback: Record<string, string> = {};
  shuffledOptions.forEach((o, i) => {
    optionFeedback[options[i].id] = o.feedback;
  });

  const assertiveIndex = shuffledOptions.findIndex((o) => o.kind === "assertive");

  return {
    id: uid(),
    type: "social",
    heading: pick(HEADINGS),
    prompt: scenario.scenario,
    options,
    correctOptionId: options[assertiveIndex]!.id,
    explanation: "",
    optionFeedback,
    noWrongAnswer: true,
    difficulty,
    columns: 1,
  };
}
