/* ==========================================================================
   GJM Tech — Landing Page
   JS vanilla, sem dependências.
   ========================================================================== */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* --------------------------------------------------------------------------
   1. Header: ganha fundo escuro + blur ao rolar
   -------------------------------------------------------------------------- */

function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 12);

  update();
  window.addEventListener('scroll', update, { passive: true });
}

/* --------------------------------------------------------------------------
   2. Dropdowns do menu desktop (abrem no hover via CSS; aqui só o teclado
      e o estado aria correto para leitores de tela)
   -------------------------------------------------------------------------- */

function initDropdowns() {
  const items = document.querySelectorAll('.nav__item:has(.nav__dropdown)');

  items.forEach((item) => {
    const trigger = item.querySelector('.nav__trigger');
    if (!trigger) return;

    const setOpen = (open) => trigger.setAttribute('aria-expanded', String(open));

    item.addEventListener('mouseenter', () => setOpen(true));
    item.addEventListener('mouseleave', () => setOpen(false));
    item.addEventListener('focusin', () => setOpen(true));
    item.addEventListener('focusout', (event) => {
      if (!item.contains(event.relatedTarget)) setOpen(false);
    });

    // Enter/Espaço no botão levam o foco para o primeiro link do submenu
    trigger.addEventListener('click', () => {
      setOpen(true);
      item.querySelector('.nav__dropdown a')?.focus();
    });

    item.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        trigger.focus();
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. Drawer mobile
   -------------------------------------------------------------------------- */

function initDrawer() {
  const toggle = document.getElementById('nav-toggle');
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawer-overlay');
  const closeBtn = document.getElementById('drawer-close');

  if (!toggle || !drawer || !overlay) return;

  let lastFocused = null;

  const open = () => {
    lastFocused = document.activeElement;
    overlay.hidden = false;
    // força reflow para a transição do overlay rodar
    void overlay.offsetWidth;

    drawer.classList.add('is-open');
    overlay.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('is-locked');
    closeBtn?.focus();
  };

  const close = () => {
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-locked');

    overlay.addEventListener('transitionend', () => {
      if (!overlay.classList.contains('is-open')) overlay.hidden = true;
    }, { once: true });

    lastFocused instanceof HTMLElement ? lastFocused.focus() : toggle.focus();
  };

  toggle.addEventListener('click', () => {
    drawer.classList.contains('is-open') ? close() : open();
  });

  closeBtn?.addEventListener('click', close);
  overlay.addEventListener('click', close);

  drawer.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && drawer.classList.contains('is-open')) close();
  });

  // Ao passar para desktop, o drawer não pode ficar preso aberto
  window.matchMedia('(min-width: 992px)').addEventListener('change', (event) => {
    if (event.matches && drawer.classList.contains('is-open')) close();
  });
}

/* --------------------------------------------------------------------------
   4. Paralaxe da lâmpada do hero — SOMENTE desktop

   A lâmpada começa grande e ATRÁS dos três cards (z-index 1, abaixo deles),
   aparecendo acima da fileira e através do card translúcido do meio. Ao
   rolar, ela desce mais devagar que o scroll e PARA dentro desse card vazio
   (#dock-lampada), encolhendo até caber nele. Depois disso não se move mais.
   Ver .claude/skills/parallax-hero-effect/SKILL.md
   -------------------------------------------------------------------------- */

const PARALLAX_SPEED = 0.28;  // < 1 = mais lento que o scroll real
const DOCK_FILL_X = 0.62;     // fração da largura do card ocupada ao pousar
const DOCK_FILL_Y = 0.78;     // idem para a altura

function initHeroParallax() {
  const decor = document.getElementById('hero-decor');
  if (!decor) return;

  const dock = document.getElementById('dock-lampada');
  const desktop = window.matchMedia('(min-width: 768px)');

  let ticking = false;
  let active = false;
  let dx = 0;
  let dy = 0;
  let escalaFinal = 1;

  // Mede o trajeto entre o centro da lâmpada em repouso e o centro do card de
  // destino, em coordenadas absolutas da página, e o quanto ela precisa
  // encolher para caber dentro dele.
  const measure = () => {
    if (!dock || dock.offsetParent === null) {
      dx = 0; dy = 0; escalaFinal = 1;
      return;
    }

    const anterior = decor.style.transform;
    decor.style.transform = 'none';

    const origem = decor.getBoundingClientRect();
    const destino = dock.getBoundingClientRect();
    const scrollY = window.scrollY;

    dx = (destino.left + destino.width / 2) - (origem.left + origem.width / 2);
    dy = (destino.top + scrollY + destino.height / 2)
       - (origem.top + scrollY + origem.height / 2);

    // Cabe pela largura E pela altura — a lâmpada é bem mais alta que larga,
    // então normalmente é a altura que manda.
    escalaFinal = (origem.width > 0 && origem.height > 0)
      ? Math.min(
          (destino.width * DOCK_FILL_X) / origem.width,
          (destino.height * DOCK_FILL_Y) / origem.height
        )
      : 1;

    decor.style.transform = anterior;
  };

  const render = () => {
    // Sem card de destino (mobile, ou card oculto), só o paralaxe vertical.
    if (dy <= 0) {
      decor.style.transform = `translateY(${window.scrollY * PARALLAX_SPEED}px)`;
      ticking = false;
      return;
    }

    // 0 = parada no alto, 1 = pousada no card. Trava em 1: é aqui que ela para.
    const progresso = Math.min((window.scrollY * PARALLAX_SPEED) / dy, 1);
    const escala = 1 + (escalaFinal - 1) * progresso;

    decor.style.transform =
      `translate(${dx * progresso}px, ${dy * progresso}px) scale(${escala})`;

    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(render);
  };

  const enable = () => {
    if (active) return;
    active = true;
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    render();
  };

  const disable = () => {
    if (!active) return;
    active = false;
    window.removeEventListener('scroll', onScroll);
    decor.style.transform = '';
  };

  const sync = () => {
    // No mobile o elemento é removido via media query — nada a animar.
    // Com "reduzir movimento" ligado, ele fica parado no lugar.
    desktop.matches && !prefersReducedMotion.matches ? enable() : disable();
  };

  // O trajeto muda com o layout, então precisa ser remedido.
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!active) return;
      measure();
      render();
    }, 150);
  });

  // Fontes e imagens chegando depois deslocam o card de destino.
  window.addEventListener('load', () => {
    if (!active) return;
    measure();
    render();
  });

  sync();
  desktop.addEventListener('change', sync);
  prefersReducedMotion.addEventListener('change', sync);
}

/* --------------------------------------------------------------------------
   5. Troca do SVG da lâmpada pelo asset real, se o usuário fornecer um
      (assets/hero/lampada.png). Enquanto o arquivo não existir, o SVG fica.
   -------------------------------------------------------------------------- */

// Resolvido a partir da URL do próprio script (src/scripts/main.js), não da
// página — assim funciona igual na Home e nas páginas dentro de subpastas.
const HERO_DECOR_ASSET = new URL('../../assets/hero/lampada.png', import.meta.url).href;

function initHeroDecorAsset() {
  const decor = document.getElementById('hero-decor');
  if (!decor) return;

  const probe = new Image();

  probe.addEventListener('load', () => {
    probe.alt = '';
    probe.setAttribute('role', 'presentation');
    decor.replaceChildren(probe);
  });

  // Sem handler de erro barulhento: se o asset não existe, seguimos com o SVG.
  probe.addEventListener('error', () => {}, { once: true });
  probe.src = HERO_DECOR_ASSET;
}

/* --------------------------------------------------------------------------
   6. Valores da prévia dos cards do hero

   Os dois cards do hero são uma ILUSTRAÇÃO da interface, não dados reais da
   GJM Tech (a legenda abaixo deles diz isso na tela). A cada carregamento da
   página um dos 10 conjuntos abaixo é sorteado, para a prévia não parecer uma
   captura de tela congelada.

   Cada conjunto é internamente coerente: "em estoque" é sempre
   `itens - baixo`, e a barra de progresso reflete essa proporção — nada é
   sorteado de forma independente, senão a prévia mostraria contas erradas.
   -------------------------------------------------------------------------- */

const PREVIAS = [
  { caixa:  8450.00, barras: [38, 56, 44, 72, 60, 92, 66], itens: 312, baixo: 44 },
  { caixa:  5280.50, barras: [52, 34, 68, 41, 77, 59, 88], itens: 198, baixo: 61 },
  { caixa: 12730.00, barras: [44, 71, 39, 86, 55, 94, 62], itens: 486, baixo: 33 },
  { caixa:  3940.80, barras: [61, 47, 83, 36, 70, 52, 91], itens: 154, baixo: 40 },
  { caixa:  9615.20, barras: [35, 64, 49, 90, 58, 76, 43], itens: 367, baixo: 22 },
  { caixa:  6870.00, barras: [73, 42, 57, 33, 89, 66, 50], itens: 241, baixo: 57 },
  { caixa: 15320.40, barras: [46, 80, 37, 63, 95, 54, 69], itens: 529, baixo: 95 },
  { caixa:  4560.90, barras: [58, 39, 74, 48, 62, 87, 41], itens: 176, baixo: 13 },
  { caixa: 11080.00, barras: [40, 67, 93, 51, 45, 78, 60], itens: 403, baixo: 110 },
  { caixa:  7290.60, barras: [69, 45, 55, 82, 38, 71, 96], itens: 268, baixo: 48 },
];

const emReais = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const emNumero = new Intl.NumberFormat('pt-BR');

function initPreviaCards() {
  const campo = (nome) => document.querySelector(`[data-previa="${nome}"]`);

  const valor = campo('caixa-valor');
  const grafico = campo('caixa-grafico');
  const total = campo('estoque-total');
  const ok = campo('estoque-ok');
  const baixo = campo('estoque-baixo');
  const barra = campo('estoque-barra');

  // Fora da Home não existe prévia; e se faltar qualquer campo, é melhor
  // deixar os valores do HTML do que montar um card pela metade.
  if (!valor || !grafico || !total || !ok || !baixo || !barra) return;

  const previa = PREVIAS[Math.floor(Math.random() * PREVIAS.length)];
  const emEstoque = previa.itens - previa.baixo;

  valor.textContent = emReais.format(previa.caixa);
  total.textContent = `${emNumero.format(previa.itens)} itens`;
  ok.textContent = emNumero.format(emEstoque);
  baixo.textContent = emNumero.format(previa.baixo);
  barra.style.width = `${Math.round((emEstoque / previa.itens) * 100)}%`;

  // A barra mais alta do gráfico é a destacada. Usa o índice, não o valor,
  // para não destacar duas barras em caso de empate.
  const indiceMaior = previa.barras.indexOf(Math.max(...previa.barras));
  Array.from(grafico.children).forEach((coluna, i) => {
    if (previa.barras[i] === undefined) return;
    coluna.style.height = `${previa.barras[i]}%`;
    coluna.classList.toggle('is-active', i === indiceMaior);
  });
}

/* --------------------------------------------------------------------------
   7. Reveal das seções ao entrar na viewport
   -------------------------------------------------------------------------- */

function initReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

  targets.forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index % 4, 3) * 80}ms`;
    observer.observe(el);
  });
}

/* --------------------------------------------------------------------------
   8. Formulário de contato

   ATENÇÃO: o projeto não tem backend (ver CLAUDE.md). O formulário valida os
   campos no navegador, mas NÃO envia nada — e diz isso ao usuário em vez de
   fingir sucesso. Para ativar o envio, defina o endpoint em `ENDPOINT` abaixo
   e troque o bloco marcado com TODO.
   -------------------------------------------------------------------------- */

const ENDPOINT = null; // TODO: URL do serviço de envio, quando existir

function initContactForm() {
  const form = document.querySelector('[data-form="contato"]');
  if (!form) return;

  const status = form.querySelector('[data-form-status]');

  const setStatus = (message, kind) => {
    if (!status) return;
    status.textContent = message;
    status.dataset.kind = kind;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    if (!ENDPOINT) {
      setStatus(
        'O envio pelo site ainda não está ativo. Enquanto isso, fale com a gente pelo e-mail ou telefone dos canais diretos.',
        'pending'
      );
      return;
    }

    // TODO: quando houver endpoint, enviar de verdade e tratar erro de rede.
    setStatus('Enviando...', 'pending');
  });
}

/* --------------------------------------------------------------------------
   9. Ano do rodapé
   -------------------------------------------------------------------------- */

function initYear() {
  const el = document.getElementById('ano');
  if (el) el.textContent = String(new Date().getFullYear());
}

/* -------------------------------------------------------------------------- */

initHeader();
initDropdowns();
initDrawer();
initHeroParallax();
initHeroDecorAsset();
initPreviaCards();
initReveal();
initContactForm();
initYear();
