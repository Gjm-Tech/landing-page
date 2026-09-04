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
      Comportamento documentado em .claude/skills/parallax-hero-effect/SKILL.md:
      move mais devagar que o scroll real (efeito de "atraso"), atravessa o
      header e sobrepõe o início da seção clara antes de sumir.
   -------------------------------------------------------------------------- */

const PARALLAX_SPEED = 0.45; // < 1 = mais lento que o scroll real

function initHeroParallax() {
  const decor = document.getElementById('hero-decor');
  if (!decor) return;

  const desktop = window.matchMedia('(min-width: 768px)');
  let ticking = false;
  let active = false;

  const render = () => {
    decor.style.transform = `translateY(${window.scrollY * PARALLAX_SPEED}px)`;
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

  sync();
  desktop.addEventListener('change', sync);
  prefersReducedMotion.addEventListener('change', sync);
}

/* --------------------------------------------------------------------------
   5. Troca do SVG da lâmpada pelo asset real, se o usuário fornecer um
      (assets/hero/lampada.png). Enquanto o arquivo não existir, o SVG fica.
   -------------------------------------------------------------------------- */

const HERO_DECOR_ASSET = '../assets/hero/lampada.png';

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
   6. Reveal das seções ao entrar na viewport
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
   7. Ano do rodapé
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
initReveal();
initYear();
