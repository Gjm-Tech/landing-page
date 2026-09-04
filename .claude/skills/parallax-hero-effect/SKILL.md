---
name: parallax-hero-effect
description: Como implementar o elemento decorativo 3D do hero com efeito de paralaxe no scroll (equivalente à "moeda" do template de referência Revio), incluindo o comportamento exato observado em vídeo e a regra de ocultação no mobile. Use ao construir ou ajustar a seção hero da Home.
---

# Efeito de paralaxe do hero

Análise feita quadro a quadro a partir do vídeo de referência enviado pelo usuário (desktop + mobile) e do template Revio.

## Comportamento observado (desktop)

1. Um elemento decorativo 3D (na referência: uma moeda com face verde-menta e borda em degradê coral, vista em ângulo) fica posicionado na base do hero, atrás/entre dois cards flutuantes — parcialmente coberto pelo card da esquerda.
2. Ao rolar a página, ele se move em velocidade **diferente e mais lenta** que o resto do conteúdo (scroll a uma taxa reduzida, ex.: ~0.4–0.5x da velocidade real do scroll) — parallax clássico via `transform`.
3. Por causa dessa defasagem, ele continua visível mesmo depois que o fundo escuro do hero já saiu de cena — "atravessa" visualmente por cima do header fixo e chega a sobrepor o início da seção clara seguinte, antes de desaparecer de vez.
4. É puramente decorativo, numa camada acima do conteúdo (`z-index` alto), sem interferir em cliques (`pointer-events: none`). Não é o ícone de nenhum feature card — mesmo passando visualmente por cima do grid de features durante a transição, ele é um elemento independente.

## Comportamento observado (mobile)

**O elemento não existe no mobile.** Nos frames mobile analisados, os dois cards do hero aparecem simplesmente empilhados verticalmente, sem o elemento 3D e sem nenhum efeito de paralaxe associado a ele. Isso deve ser tratado como remoção completa via media query — não apenas ocultação visual (`opacity: 0` ainda deixaria o elemento no fluxo/DOM ocupando espaço ou custando performance).

## Adaptação para GJM Tech — DECIDIDO: moeda

O elemento é uma **moeda** (definido pelo usuário em 2026-09-04). Histórico das versões
descartadas, para não voltar atrás: moeda do Revio → lâmpada → **moeda de novo**, agora
tematizada como dinheiro (face verde com cifrão "R$"), ligando com "Controle de Caixa".

Implementação atual em `src/index.html` (`#hero-decor`):

- Desenhada como **SVG inline**, não como arquivo de imagem — respeita a regra do
  `CLAUDE.md` de não gerar nem baixar assets, e já funciona sem depender de nada externo.
- Vista em ângulo: duas elipses sobrepostas (a de baixo, mais escura, faz a espessura).
  Face em degradê `--accent-mint` → `--accent-green`, friso interno, brilho especular
  branco e "R$" em verde escuro.
- Verde e não menta/coral (os tokens originais do Revio) porque ela precisa ter contraste
  **nos dois fundos**: o hero escuro e o card claro onde ela vai parar.

## Ponto de parada: a moeda VIRA o ícone do card

O elemento **não desce a página inteira**. Ele desce com o atraso do paralaxe até pousar
**dentro do ícone** do primeiro card de funcionalidades (`#dock-moeda`, no card "Controle
de caixa"), encolhe até o tamanho da caixa do ícone e **assume o lugar dele** — o chip
colorido e o desenho original somem. Depois disso a moeda não se move mais em relação à
página.

Como está implementado (`initHeroParallax` em `src/scripts/main.js`):

- `measure()` calcula, em coordenadas absolutas da página, o vetor entre o centro da moeda
  em repouso e o centro do ícone de destino, mais a escala final:
  `escalaFinal = (largura do ícone * DOCK_FILL) / largura da moeda`. Medir em vez de
  cravar um número faz o efeito sobreviver a mudanças de tamanho no CSS.
- `render()` converte o scroll em um progresso `0 → 1`, travado em 1:
  `progresso = min(scrollY * PARALLAX_SPEED / dy, 1)`. É o `min` que faz a moeda parar.
- Passando de `DOCK_SWAP_AT` (0.97), o ícone de destino ganha a classe `is-taken`, que
  zera a opacidade do SVG original e deixa o fundo do chip transparente. A classe é
  removida ao rolar de volta para cima, e em `disable()`.
- O trajeto é remedido no `resize` (com debounce) e no `load`, porque fontes e imagens que
  chegam depois deslocam o ícone de destino.

Para trocar o card de destino, basta mover o `id="dock-moeda"` para o `.feature-card__icon`
de outro card — o cálculo se adapta sozinho.

## Posição de repouso: não pode cobrir texto

Regra do usuário: o elemento **não fica na frente de nenhum texto**. Por isso a moeda
descansa *abaixo* dos dois cards do hero (`bottom: -126px`), encostada na base deles, e
deslocada para a esquerda (`left: 14%`) para sair da largura da legenda centralizada que
vem logo abaixo. Ao mexer no tamanho dos cards ou dessa legenda, conferir de novo se ela
continua livre.

### Se o usuário fornecer um asset próprio

`src/scripts/main.js` (`initHeroDecorAsset`) tenta carregar **`assets/hero/moeda.png`**.
Se o arquivo existir, ele substitui o SVG inline automaticamente; se não existir, o SVG permanece
e nenhum erro é exibido. Ou seja: basta o usuário colocar o arquivo nesse caminho, sem tocar no código.

## Implementação técnica (vanilla JS, sem dependências)

```js
// Implementação real: src/scripts/main.js > initHeroParallax()
const decor = document.getElementById('hero-decor');
const desktop = window.matchMedia('(min-width: 768px)');
const speed = 0.45; // < 1 = mais lento que o scroll real (efeito de "atraso")
let ticking = false;

const render = () => {
  decor.style.transform = `translateY(${window.scrollY * speed}px)`;
  ticking = false;
};

const onScroll = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(render); // evita jank
};

// Só liga no desktop, e desliga se o usuário pedir "reduzir movimento".
// O listener de `change` do matchMedia religa/desliga ao redimensionar.
if (desktop.matches) window.addEventListener('scroll', onScroll, { passive: true });
```

> O posicionamento base usa a propriedade `translate` (`translate: -50% 0`) e o paralaxe usa
> `transform`. São propriedades separadas em CSS moderno e **compõem** — por isso o JS pode
> sobrescrever `transform` livremente sem quebrar a centralização.

```css
.hero-decor {
  position: absolute;
  z-index: 5; /* acima do fundo do hero */
  pointer-events: none;
  will-change: transform;
}

@media (max-width: 767px) {
  .hero-decor {
    display: none; /* remove completamente no mobile, conforme observado */
  }
}
```

> Usar `requestAnimationFrame` (ou throttle) no listener de scroll se a página acumular outras animações simultâneas, para evitar jank.
