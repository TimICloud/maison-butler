/* =========================================================
   MAISON BUTLER — interactions & animations
   ========================================================= */
(() => {
  const body = document.body;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Intro : logo au centre, puis les portes s'ouvrent ----------
     Version complète quand on arrive sur le site (lien externe, adresse
     tapée, rechargement). Version courte lors de la navigation interne. */
  const intro = document.querySelector('.intro');
  let internal = false;
  try {
    const nav = performance.getEntriesByType('navigation')[0];
    const reload = nav && nav.type === 'reload';
    internal = !reload && !!document.referrer && new URL(document.referrer).origin === location.origin;
  } catch (e) {}
  const full = !internal && !reduced;
  if (intro) intro.classList.add(full ? 'is-full' : 'is-quick');

  let opened = false;
  const openSite = () => {
    if (opened) return;
    opened = true;
    if (intro) intro.classList.add('is-open');
    body.classList.remove('is-loading');
    setTimeout(() => {
      body.classList.add('is-ready');
      initObservers();
    }, full ? 550 : 200);
    setTimeout(() => intro && intro.classList.add('is-done'), full ? 2200 : 1100);
  };

  // Les portes s'ouvrent quand l'animation du logo est finie ET la page chargée
  const minDelay = reduced ? 0 : (full ? 3000 : 150);
  const t0 = performance.now();
  const whenLoaded = () => setTimeout(openSite, Math.max(0, minDelay - (performance.now() - t0)));
  if (document.readyState === 'complete') whenLoaded();
  else window.addEventListener('load', whenLoaded);
  setTimeout(openSite, full ? 6000 : 2500); // sécurité si une image tarde
  if (intro && full) {
    intro.addEventListener('click', openSite);
    window.addEventListener('keydown', openSite, { once: true });
  }

  /* ---------- Split titles into words ---------- */
  document.querySelectorAll('[data-split]').forEach(el => {
    let i = 0;
    const walk = node => {
      [...node.childNodes].forEach(child => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span');
            w.className = 'w';
            const inner = document.createElement('span');
            inner.textContent = part;
            inner.style.setProperty('--i', i++);
            w.appendChild(inner);
            frag.appendChild(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') {
          walk(child);
        }
      });
    };
    walk(el);
  });

  /* ---------- Buttons: arrows + pointer-following fill ---------- */
  const arrow = '<svg viewBox="0 0 26 10" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 5h24M20 1l4 4-4 4"/></svg>';
  document.querySelectorAll('.btn').forEach(btn => {
    if (!btn.querySelector('.arrow') && !btn.hasAttribute('data-no-arrow')) {
      const s = document.createElement('span');
      s.className = 'arrow';
      s.innerHTML = arrow + arrow;
      btn.appendChild(s);
    }
    btn.addEventListener('pointerenter', e => {
      const r = btn.getBoundingClientRect();
      btn.style.setProperty('--mx', `${e.clientX - r.left}px`);
      btn.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
    btn.addEventListener('pointerleave', e => {
      const r = btn.getBoundingClientRect();
      btn.style.setProperty('--mx', `${e.clientX - r.left}px`);
      btn.style.setProperty('--my', `${e.clientY - r.top}px`);
      btn.style.transform = '';
    });
    if (finePointer && !reduced) {
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.18;
        const y = (e.clientY - r.top - r.height / 2) * 0.3;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
    }
  });

  /* ---------- Nav hover text duplication ---------- */
  document.querySelectorAll('.nav__link').forEach(a => {
    const t = a.textContent.trim();
    a.innerHTML = `<span data-text="${t}">${t}</span>`;
  });

  /* ---------- Reveal on scroll ---------- */
  function initObservers() {
    const targets = document.querySelectorAll('[data-split], [data-reveal], .img-reveal, .divider, .eyebrow, .pillar, .process, .leaf-deco, [data-observe]');
    if (reduced || !('IntersectionObserver' in window)) {
      targets.forEach(t => t.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(t => io.observe(t));

    // counters
    const counters = document.querySelectorAll('[data-count]');
    const cio = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const end = parseFloat(el.dataset.count);
        const dur = 2000;
        const t0 = performance.now();
        const tick = now => {
          const p = Math.min((now - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          el.textContent = Math.round(end * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        cio.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(c => cio.observe(c));
  }

  /* ---------- Header behaviour ---------- */
  const header = document.querySelector('.header');
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    if (header) {
      header.classList.toggle('is-scrolled', y > 40);
      header.classList.toggle('is-hidden', y > 500 && y > lastY && !body.classList.contains('menu-open'));
    }
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const burger = document.querySelector('.burger');
  if (burger) {
    burger.addEventListener('click', () => {
      const open = body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open);
      body.style.overflow = open ? 'hidden' : '';
    });
  }

  /* ---------- Parallax ---------- */
  const parallaxEls = [...document.querySelectorAll('[data-parallax]')];
  if (parallaxEls.length && !reduced) {
    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      parallaxEls.forEach(el => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const speed = parseFloat(el.dataset.parallax) || 0.15;
        const offset = (r.top + r.height / 2 - vh / 2) * -speed;
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ---------- Custom cursor ---------- */
  if (finePointer && !reduced) {
    const ring = document.createElement('div'); ring.className = 'cursor';
    const dot = document.createElement('div'); dot.className = 'cursor-dot';
    body.append(ring, dot);
    let mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener('pointermove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      body.classList.add('has-cursor');
    });
    document.addEventListener('pointerleave', () => body.classList.remove('has-cursor'));
    const loop = () => {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.querySelectorAll('a, button, .region, .chip, [data-hover]').forEach(el => {
      el.addEventListener('pointerenter', () => ring.classList.add('is-hover'));
      el.addEventListener('pointerleave', () => ring.classList.remove('is-hover'));
    });
  }

  /* ---------- Regions accordion ---------- */
  const regions = document.querySelectorAll('.region');
  regions.forEach(r => {
    const activate = () => {
      regions.forEach(o => o.classList.remove('is-active'));
      r.classList.add('is-active');
    };
    r.addEventListener('mouseenter', activate);
    r.addEventListener('focus', activate);
    r.addEventListener('click', activate);
  });

  /* ---------- FAQ ---------- */
  document.querySelectorAll('.faq__q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq__item');
      const open = item.classList.toggle('is-open');
      q.setAttribute('aria-expanded', open);
    });
  });

  /* ---------- Contact form (front-end only) ---------- */
  const form = document.querySelector('.form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      form.classList.add('is-sent');
      // TODO : brancher sur un service d'envoi (Formspree, Netlify Forms, back-end…)
    });
    const reset = form.querySelector('[data-reset]');
    if (reset) reset.addEventListener('click', () => { form.reset(); form.classList.remove('is-sent'); });
  }

  /* ---------- Back to top ---------- */
  document.querySelectorAll('.to-top').forEach(b => b.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' })));

  /* ---------- Year ---------- */
  document.querySelectorAll('[data-year]').forEach(y => (y.textContent = new Date().getFullYear()));

  /* ---------- Page transitions ---------- */
  const veil = document.querySelector('.transition');
  if (veil && !reduced) {
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || a.target === '_blank' || /^https?:/.test(href)) return;
      a.addEventListener('click', e => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        veil.classList.add('is-leaving');
        setTimeout(() => (window.location.href = href), 750);
      });
    });
    window.addEventListener('pageshow', ev => { if (ev.persisted) veil.classList.remove('is-leaving'); });
  }
})();
