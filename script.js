document.addEventListener('DOMContentLoaded', () => {
  // --- Título do Sobre: letras animadas ---
  const aboutName = document.querySelector('.about__name');
  if (aboutName) {
    const text = aboutName.textContent.trim();
    aboutName.setAttribute('aria-label', text);
    aboutName.textContent = '';
    [...text].forEach((ch, i) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.style.setProperty('--i', i);
      span.setAttribute('aria-hidden', 'true');
      span.textContent = ch;
      aboutName.append(span);
    });
  }

  // --- Reveal Animation Logic ---
  const revealElements = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window && revealElements.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.documentElement.classList.add('reveal-ready');
    revealElements.forEach((element) => revealObserver.observe(element));
  }

  // --- Cart Logic ---
  const cart = document.querySelector('#cart-dialog');
  const cartItems = document.querySelector('[data-cart-items]');
  const emptyMessage = document.querySelector('[data-cart-empty]');

  document.querySelectorAll('[data-cart-open]').forEach((button) => {
    button.addEventListener('click', () => cart.showModal());
  });

  document.querySelectorAll('[data-cart-close]').forEach((control) => {
    control.addEventListener('click', () => cart.close());
  });

  document.querySelectorAll('[data-add-package]').forEach((button) => {
    button.addEventListener('click', () => {
      const item = document.createElement('li');
      item.textContent = button.dataset.addPackage;
      cartItems.append(item);
      emptyMessage.hidden = true;
      cart.showModal();
    });
  });

  cart.addEventListener('click', (event) => {
    if (event.target === cart) cart.close();
  });

  // --- Dynamic Features Implementation ---

  // 1. Scroll Progress Bar
  const progressBar = document.querySelector('.scroll-progress');
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = scrolled + '%';
  });

  // 2. Cursor Glow
  const cursorGlow = document.querySelector('.cursor-glow');
  let mouseX = 0;
  let mouseY = 0;
  let glowX = 0;
  let glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorGlow.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
  });

  function animateCursor() {
    // Smooth follow effect
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // 3. Particles Generation
  const particlesContainer = document.querySelector('.particles-container');
  const particleCount = 20;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Random properties
    const size = Math.random() * 6 + 2;
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 10;
    const posX = Math.random() * 100;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}%`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `-${delay}s`;
    
    particlesContainer.appendChild(particle);
  }

  // 4. Parallax Effect on Hero Compass
  const compass = document.querySelector('.hero__compass');
  const heroWash = document.querySelector('.hero__wash');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    const washRate = scrolled * 0.2;
    
    if (compass) {
      compass.style.transform = `translateY(${rate}px)`;
    }
    if (heroWash) {
      heroWash.style.transform = `translateY(${washRate}px)`;
    }
  });

  // 5. Nav Link Stagger Animation on Load
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach((link, index) => {
    link.style.opacity = '0';
    link.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      link.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      link.style.opacity = '1';
      link.style.transform = 'translateY(0)';
    }, 100 + (index * 100));
  });

  // 6. Galeria em barras (hover expande a barra; aviso após um tempo; clique abre a imagem completa)
  const bars = document.querySelector('[data-gallery]');
  if (bars) {
    const items = [...bars.querySelectorAll('.gallery__bar')];
    const prev = document.querySelector('[data-gallery-prev]');
    const next = document.querySelector('[data-gallery-next]');
    const lightbox = document.querySelector('#lightbox');
    const lbImage = lightbox && lightbox.querySelector('[data-lightbox-image]');
    const HINT_DELAY = 200; // tempo (ms) com o mouse sobre a barra até aparecer o aviso
    let start = 0;
    let lastView = 0;
    let active = null;
    let hintTimer;
    let tapWasOpen = true;

    const perView = () => parseInt(getComputedStyle(bars).getPropertyValue('--visible'), 10) || 5;
    const open = (el) => items.forEach((item) => item.classList.toggle('is-open', item === el));
    const clearHint = () => {
      clearTimeout(hintTimer);
      items.forEach((item) => item.classList.remove('is-hinting'));
    };
    const activate = (bar, delay = HINT_DELAY) => {
      if (bar === active) return;
      active = bar;
      open(bar);
      clearHint();
      hintTimer = setTimeout(() => bar.classList.add('is-hinting'), delay);
    };
    const rest = () => {
      active = null;
      clearHint();
      open(items[start]); // estado de repouso: primeira barra aberta, sem aviso
    };

    const render = () => {
      lastView = perView();
      const max = Math.max(0, items.length - lastView);
      start = Math.min(start, max);
      items.forEach((el, i) => { el.hidden = i < start || i >= start + lastView; });
      prev.disabled = start === 0;
      next.disabled = start >= max;
      rest();
    };

    // --- Lightbox ---
    const openLightbox = (bar) => {
      if (!lightbox) return;
      const img = bar.querySelector('img');
      lbImage.src = bar.dataset.full || img.currentSrc || img.src; // data-full: versão em alta, se houver
      lbImage.alt = bar.getAttribute('aria-label') || '';
      clearHint();
      const scrollbar = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.paddingRight = scrollbar ? `${scrollbar}px` : '';
      document.documentElement.classList.add('is-locked');
      lightbox.showModal();
    };

    const closeLightbox = () => {
      if (!lightbox || !lightbox.open || lightbox.classList.contains('is-closing')) return;
      lightbox.classList.add('is-closing');
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        lightbox.classList.remove('is-closing');
        lightbox.close();
      };
      lightbox.addEventListener('animationend', finish, { once: true });
      setTimeout(finish, 400);
      if (getComputedStyle(lightbox).animationName === 'none') finish(); // sem animação (reduzir movimento)
    };

    if (lightbox) {
      lightbox.querySelector('[data-lightbox-close]').addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
      lightbox.addEventListener('cancel', (e) => { e.preventDefault(); closeLightbox(); }); // Esc
      lightbox.addEventListener('close', () => {
        document.documentElement.classList.remove('is-locked');
        document.documentElement.style.paddingRight = '';
        lbImage.removeAttribute('src');
      });
    }

    prev.addEventListener('click', () => { start -= 1; render(); });
    next.addEventListener('click', () => { start += 1; render(); });

    bars.addEventListener('pointerover', (e) => {
      const bar = e.target.closest('.gallery__bar');
      if (bar && e.pointerType !== 'touch') activate(bar);
    });
    bars.addEventListener('pointerleave', (e) => {
      if (e.pointerType !== 'touch') rest();
    });
    bars.addEventListener('focusin', (e) => {
      const bar = e.target.closest('.gallery__bar');
      if (bar && e.target.matches(':focus-visible')) activate(bar); // só foco por teclado
    });
    bars.addEventListener('pointerdown', (e) => {
      const bar = e.target.closest('.gallery__bar');
      // no toque: 1º toque expande a barra, 2º toque abre a imagem
      tapWasOpen = !bar || e.pointerType !== 'touch' || bar.classList.contains('is-open');
    });
    bars.addEventListener('click', (e) => {
      const bar = e.target.closest('.gallery__bar');
      if (!bar) return;
      if (tapWasOpen) openLightbox(bar);
      else activate(bar, 900);
      tapWasOpen = true;
    });
    window.addEventListener('resize', () => { if (perView() !== lastView) render(); });
    render();
  }

  // 7. Sobre: meridiano acompanha o scroll, tilt na arte, spotlight nos cards
  const about = document.querySelector('.about');
  if (about) {
    let ticking = false;
    const updateMeridian = () => {
      const r = about.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.7 - r.top) / (r.height * 0.85)));
      about.style.setProperty('--p', p.toFixed(3));
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(updateMeridian); }
    }, { passive: true });
    updateMeridian();

    const tilt = about.querySelector('.about__images');
    if (tilt && window.matchMedia('(hover: hover)').matches) {
      about.addEventListener('pointermove', (e) => {
        const r = tilt.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
        const y = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
        tilt.style.setProperty('--ry', `${(x * 14).toFixed(2)}deg`);
        tilt.style.setProperty('--rx', `${(-y * 14).toFixed(2)}deg`);
      });
      about.addEventListener('pointerleave', () => {
        tilt.style.setProperty('--rx', '0deg');
        tilt.style.setProperty('--ry', '0deg');
      });
    }

    about.querySelectorAll('.pillar').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  // 8. Formulário de contato (FormSubmit)
  const form = document.querySelector('[data-contact-form]');
  if (form) {
    const status = form.querySelector('[data-form-status]');
    const submit = form.querySelector('button[type="submit"]');
    const setStatus = (type, message) => {
      status.className = `form-status is-${type}`;
      status.textContent = message;
    };

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      submit.disabled = true;
      setStatus('info', 'Enviando…');
      try {
        const response = await fetch(form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form),
        });
        const data = await response.json();
        if (!response.ok || String(data.success) !== 'true') throw new Error(data.message || 'Falha no envio');
        form.reset();
        setStatus('ok', 'Mensagem enviada! Em breve entraremos em contato.');
      } catch (error) {
        setStatus('error', 'Não foi possível enviar agora. Tente novamente em instantes ou escreva direto para o nosso e-mail.');
      } finally {
        submit.disabled = false;
      }
    });
  }

  // 9. Menu hambúrguer (sidebar)
  const drawer = document.querySelector('#mobile-menu');
  const menuButton = document.querySelector('[data-menu-open]');
  if (drawer && menuButton) {
    const lockScroll = (on) => {
      const root = document.documentElement;
      const scrollbar = window.innerWidth - root.clientWidth;
      root.style.paddingRight = on && scrollbar ? `${scrollbar}px` : '';
      root.classList.toggle('is-locked', on);
    };

    const closeDrawer = () => {
      if (!drawer.open || drawer.classList.contains('is-closing')) return;
      drawer.classList.add('is-closing');
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        drawer.classList.remove('is-closing');
        drawer.close();
      };
      drawer.addEventListener('animationend', (e) => {
        if (e.target === drawer && e.animationName === 'drawerOut') finish();
      });
      setTimeout(finish, 450);
    };

    menuButton.addEventListener('click', () => {
      lockScroll(true);
      drawer.showModal();
      menuButton.setAttribute('aria-expanded', 'true');
    });
    drawer.querySelectorAll('[data-menu-close]').forEach((el) => el.addEventListener('click', closeDrawer));
    drawer.addEventListener('click', (e) => { if (e.target === drawer) closeDrawer(); });
    drawer.addEventListener('cancel', (e) => { e.preventDefault(); closeDrawer(); }); // Esc
    drawer.addEventListener('close', () => {
      lockScroll(false);
      menuButton.setAttribute('aria-expanded', 'false');
    });
    window.matchMedia('(min-width: 1025px)').addEventListener('change', (e) => {
      if (e.matches && drawer.open) drawer.close();
    });
  }

  // 10. Bússola do hero: gira num sentido, reverte suavemente e volta, sem nunca passar da borda esquerda da tela
  const compassImg = document.querySelector('.hero__compass');
  if (compassImg) {
    // >>> findSafeSwing
    // points: [x, y, x, y...] dos pixels visíveis, relativos ao centro da imagem (px de layout).
    // cx: posição x do centro na tela. Devolve a maior faixa de ângulos (graus) sem corte, ou null.
    const findSafeSwing = (points, cx, margin) => {
      const far = [];
      for (let k = 0; k < points.length; k += 2) {
        if (Math.hypot(points[k], points[k + 1]) >= cx - margin) far.push(points[k], points[k + 1]);
      }
      if (!far.length) return null;
      const STEP = 2;
      const N = 360 / STEP;
      const cut = [];
      for (let i = 0; i < N; i++) {
        const a = (i * STEP * Math.PI) / 180;
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        let n = 0;
        for (let k = 0; k < far.length; k += 2) {
          if (cx + far[k] * cos - far[k + 1] * sin < margin) n++; // rotação horária, como no CSS
        }
        cut.push(n);
      }
      const min = Math.min(...cut);
      const limit = min + Math.max(2, min * 0.08);
      const ok = cut.map((n) => n <= limit);
      if (ok.every(Boolean)) return null;
      let best = { len: 0, start: 0 };
      for (let i = 0; i < N; i++) {
        if (!ok[i] || ok[(i - 1 + N) % N]) continue;
        let len = 0;
        while (ok[(i + len) % N] && len < N) len++;
        if (len > best.len) best = { len, start: i };
      }
      if (!best.len) return null;
      return { from: best.start * STEP, to: (best.start + best.len - 1) * STEP };
    };
    // <<< findSafeSwing

    const calibrateCompass = () => {
      const w = compassImg.offsetWidth;
      const h = compassImg.offsetHeight;
      if (!w || !h || !compassImg.naturalWidth) return;
      const cw = 400;
      const ch = Math.round((cw * compassImg.naturalHeight) / compassImg.naturalWidth);
      const canvas = document.createElement('canvas');
      canvas.width = cw;
      canvas.height = ch;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(compassImg, 0, 0, cw, ch);
      let data;
      try {
        data = ctx.getImageData(0, 0, cw, ch).data;
      } catch (err) {
        return; // leitura de pixels bloqueada (ex.: abrindo por file://): mantém o vai e volta padrão do CSS
      }
      const points = [];
      for (let y = 0; y < ch; y++) {
        for (let x = 0; x < cw; x++) {
          if (data[(y * cw + x) * 4 + 3] > 8) points.push((x + 0.5 - cw / 2) * (w / cw), (y + 0.5 - ch / 2) * (h / ch));
        }
      }
      if (points.length > cw * ch) return; // imagem sem transparência: não dá para calibrar

      const swing = findSafeSwing(points, compassImg.offsetLeft + w / 2, 6);
      if (!swing) {
        compassImg.style.animation = 'spinCompass 60s linear infinite'; // nada é cortado: giro completo original
        return;
      }
      const inset = Math.min(6, (swing.to - swing.from) / 4);
      const from = swing.from + inset;
      const to = swing.to - inset;
      compassImg.style.animation = '';
      compassImg.style.setProperty('--compass-from', `${from}deg`);
      compassImg.style.setProperty('--compass-to', `${to}deg`);
      compassImg.style.setProperty('--compass-dur', `${Math.min(40, Math.max(10, (to - from) / 5)).toFixed(1)}s`);
    };

    const startCompass = () => { if (compassImg.complete && compassImg.naturalWidth) calibrateCompass(); };
    if (compassImg.complete) startCompass();
    else compassImg.addEventListener('load', startCompass);
    let compassTimer;
    window.addEventListener('resize', () => {
      clearTimeout(compassTimer);
      compassTimer = setTimeout(startCompass, 250);
    });
  }
});
