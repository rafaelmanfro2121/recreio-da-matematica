# Recreio da Matemática

Um app educativo para crianças de 7 a 10 anos, com três mundos de jogos:

- 🧮 **Matemática** — problemas em forma de história (soma, subtração, multiplicação, divisão), questões em dinheiro (R$) e treino de tabuada.
- 🧩 **Desafios da Mente** — sequências, padrões, "o que não pertence ao grupo", enigmas e planejamento.
- ⚡ **Reflexo Rápido** — decisões rápidas e divertidas, no ritmo de um treino esportivo.

Funciona como PWA: pode ser instalado na tela inicial do celular e usado offline, sem depender do Claude.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
```

O deploy para o GitHub Pages acontece automaticamente a cada push na branch `main` (veja `.github/workflows/deploy.yml`).
