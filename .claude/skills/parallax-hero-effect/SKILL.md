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

## Adaptação para GJM Tech — DECIDIDO: lâmpada

O elemento é uma **lâmpada**. Histórico das versões, para não ficar rodando em círculo:
moeda do Revio → lâmpada → moeda com "R$" → **lâmpada de novo** (definido pelo usuário em
2026-09-04, e é esta que vale).

Implementação atual em `src/index.html` (`#hero-decor`):

- Desenhada como **SVG inline**, não como arquivo de imagem — respeita a regra do
  `CLAUDE.md` de não gerar nem baixar assets, e já funciona sem depender de nada externo.
- Vidro em degradê `--accent-mint` → `--brand-primary`, filamento em `--accent-coral`,
  rosca em cinza metálico, halo azul via `radialGradient`.

## O palco do hero tem TRÊS cards

Mudança estrutural pedida pelo usuário: além dos dois cards de conteúdo, existe um
**terceiro card vazio no meio**, que serve só de destino para a lâmpada.

```
[ Controle de caixa ]  [ vazio: destino ]  [ Controle de estoque ]
      escuro              translúcido            claro
```

- Grid em `1fr 0.58fr 1fr` no desktop (`home.css`), `max-width: 1040px`.
- O card do meio (`.hero-card--slot`, `#dock-lampada`) é **translúcido** de propósito:
  a lâmpada fica ATRÁS dos três cards, e é através dele que ela continua visível.
- Ele **não flutua**, ao contrário dos vizinhos. Se flutuasse, a lâmpada — posicionada em
  relação ao palco e não ao card — descolaria dele ao pousar.
- No mobile ele é `display: none`: um card vazio empilhado não faz sentido, e a lâmpada
  também não existe ali.

## Comportamento: nasce grande atrás, pousa dentro do card

1. **Em repouso** a lâmpada é grande (`clamp(150px, 16vw, 232px)`), centralizada, ancorada
   ao topo do palco (`top: -152px`) — ou seja, nasce no vão entre a headline e a fileira
   de cards. O `margin-top` do palco foi aumentado para `clamp(56px, 12vw, 176px)`
   exatamente para abrir esse vão sem que ela encoste no título.
2. **z-index 1**: atrás dos três cards (que estão no 3) e à frente do fundo do hero.
   `.hero__intro` recebeu `position: relative; z-index: 2` para o texto ficar por cima.
3. **Ao rolar** ela desce mais devagar que o scroll e encolhe, até **parar** centralizada
   dentro do card vazio. Depois disso não se move mais.

Como está implementado (`initHeroParallax` em `src/scripts/main.js`):

- `measure()` calcula o vetor entre o centro da lâmpada em repouso e o centro do card de
  destino, em coordenadas absolutas da página, mais a escala final. A escala é o **menor**
  entre caber pela largura e caber pela altura (`DOCK_FILL_X` / `DOCK_FILL_Y`) — a lâmpada
  é bem mais alta que larga, então normalmente é a altura que manda. Medir em vez de cravar
  um número faz o efeito sobreviver a mudanças de tamanho no CSS.
- `render()` converte o scroll em um progresso `0 → 1`, travado em 1:
  `progresso = min(scrollY * PARALLAX_SPEED / dy, 1)`. É o `min` que faz a lâmpada parar.
- `PARALLAX_SPEED` está em `0.28` (mais lento que os 0.45 originais) porque o trajeto é
  curto: com 0.45 ela pousava rápido demais para o movimento ser percebido.
- `measure()` roda de novo no `resize` (com debounce) e no `load`, porque fontes e imagens
  que chegam depois deslocam o card de destino. Também checa `dock.offsetParent === null`
  para detectar que o card está oculto (mobile) e cair no paralaxe simples.

Como a lâmpada nunca sai do hero, `.hero` voltou a ter `overflow: hidden`.

## Regra permanente: não cobre texto

O elemento **não fica na frente de nenhum texto**. Isso é garantido por duas coisas ao
mesmo tempo: o z-index 1 (abaixo de cards e do texto do hero) e a posição de repouso
dentro do vão. Ao mexer no tamanho da headline ou dos cards, conferir de novo.

### Se o usuário fornecer um asset próprio

`src/scripts/main.js` (`initHeroDecorAsset`) tenta carregar **`assets/hero/lampada.png`**.
Se o arquivo existir, ele substitui o SVG inline automaticamente; se não existir, o SVG permanece
e nenhum erro é exibido. Ou seja: basta o usuário colocar o arquivo nesse caminho, sem tocar no código.

## Implementação técnica (vanilla JS, sem dependências)

```js
// Recorte de src/scripts/main.js > initHeroParallax()
const decor = document.getElementById('hero-decor');
const dock  = document.getElementById('dock-lampada');  // card vazio do meio
const speed = 0.28;  // < 1 = mais lento que o scroll real (efeito de "atraso")
let ticking = false;
let dx = 0, dy = 0, escalaFinal = 1;   // preenchidos por measure()

const render = () => {
  // trava em 1 ao chegar no card: é isto que faz a lâmpada PARAR
  const progresso = Math.min((window.scrollY * speed) / dy, 1);
  const escala = 1 + (escalaFinal - 1) * progresso;
  decor.style.transform =
    `translate(${dx * progresso}px, ${dy * progresso}px) scale(${escala})`;
  ticking = false;
};

const onScroll = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(render);   // evita jank
};
```

> O posicionamento base usa a propriedade `translate` (`translate: -50% 0`) e o paralaxe usa
> `transform`. São propriedades separadas em CSS moderno e **compõem** — por isso o JS pode
> sobrescrever `transform` livremente sem quebrar a centralização.

```css
.hero-decor {
  position: absolute;
  z-index: 1;        /* ATRÁS dos cards (z-index 3) e do texto do hero (2) */
  top: -152px;       /* nasce no vão entre a headline e a fileira de cards */
  left: 50%;
  translate: -50% 0;
  width: clamp(150px, 16vw, 232px);
  pointer-events: none;
  will-change: transform;
}

@media (max-width: 767px) {
  .hero-decor {
    display: none;   /* removida por completo no mobile, conforme observado */
  }
}
```

> Usar `requestAnimationFrame` (ou throttle) no listener de scroll se a página acumular
> outras animações simultâneas, para evitar jank.

## Cuidado com a seção "Comportamento observado" no topo deste arquivo

Os itens 3 e 4 daquela lista descrevem o **template Revio**, não o que o site faz hoje.
Na GJM Tech o elemento **não** atravessa para a seção seguinte nem passa por cima do
conteúdo: ele para dentro do card do meio e fica atrás de tudo. Mantidos ali só como
registro da referência original.
