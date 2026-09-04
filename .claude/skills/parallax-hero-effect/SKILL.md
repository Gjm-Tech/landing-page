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

O elemento é uma **lâmpada** (definido pelo usuário em 2026-09-04). Não é mais a moeda do Revio,
nem caixa registradora, nem pilha de notas — essas hipóteses estão descartadas.

Implementação atual em `src/index.html` (`#hero-decor`):

- Desenhada como **SVG inline**, não como arquivo de imagem — respeita a regra do `CLAUDE.md`
  de não gerar nem baixar assets, e já funciona sem depender de nada externo.
- Paleta usando tokens existentes: vidro em degradê `--accent-mint` → `--brand-bright` → `--brand-primary`,
  filamento em `--accent-coral`, rosca em cinza metálico. Halo azul via `drop-shadow`.
- Inclinada ~8° (`rotate: -8deg`) para reproduzir o "visto em ângulo" da referência.
- Animação `bulb-breathe`: variação sutil de opacidade (1 → 0.9), 4.5s. Não pisca.

### Ponto de parada: a lâmpada POUSA num card (definido pelo usuário em 2026-09-04)

O elemento **não desce a página inteira**. Ele desce com o atraso do paralaxe até pousar
no primeiro card de funcionalidades da Home (`#dock-lampada` = "Controle de caixa") e
**para ali**. Depois disso não se move mais em relação à página: fica preso no canto
superior direito do card e sobe junto com ele no scroll.

Como está implementado (`initHeroParallax` em `src/scripts/main.js`):

- `measure()` calcula, em coordenadas absolutas da página, o vetor entre o centro da
  lâmpada em repouso e o ponto de pouso (canto superior direito do card, recuado por
  `DOCK_INSET_X` / `DOCK_INSET_Y`).
- `render()` converte o scroll em um progresso `0 → 1`, travado em 1:
  `progresso = min(scrollY * PARALLAX_SPEED / dy, 1)`. É o `min` que faz a lâmpada parar.
- O deslocamento horizontal e a escala (`1 → DOCK_SCALE`, hoje `0.55`) acompanham o mesmo
  progresso, então ela "cai" na diagonal e encolhe até assentar no card.
- O trajeto é remedido no `resize` (com debounce) e no `load`, porque fontes e imagens
  que chegam depois deslocam o card de destino.

Para trocar o card de destino, basta mover o `id="dock-lampada"` para outro elemento —
o cálculo se adapta sozinho.

### Se o usuário fornecer um asset próprio

`src/scripts/main.js` (`initHeroDecorAsset`) tenta carregar **`assets/hero/lampada.png`**.
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
