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

  // 6. Galeria em barras (hover expande a barra; setas passam as imagens)
  const bars = document.querySelector('[data-gallery]');
  if (bars) {
    const items = [...bars.querySelectorAll('.gallery__bar')];
    const prev = document.querySelector('[data-gallery-prev]');
    const next = document.querySelector('[data-gallery-next]');
    let start = 0;
    let lastView = 0;

    const perView = () => parseInt(getComputedStyle(bars).getPropertyValue('--visible'), 10) || 5;
    const open = (el) => items.forEach((item) => item.classList.toggle('is-open', item === el));

    const render = () => {
      lastView = perView();
      const max = Math.max(0, items.length - lastView);
      start = Math.min(start, max);
      items.forEach((el, i) => { el.hidden = i < start || i >= start + lastView; });
      prev.disabled = start === 0;
      next.disabled = start >= max;
      open(items[start]); // estado de repouso: primeira barra aberta
    };

    prev.addEventListener('click', () => { start -= 1; render(); });
    next.addEventListener('click', () => { start += 1; render(); });

    bars.addEventListener('pointerover', (e) => {
      const bar = e.target.closest('.gallery__bar');
      if (bar && e.pointerType !== 'touch') open(bar);
    });
    bars.addEventListener('pointerleave', (e) => {
      if (e.pointerType !== 'touch') open(items[start]);
    });
    bars.addEventListener('focusin', (e) => {
      const bar = e.target.closest('.gallery__bar');
      if (bar) open(bar);
    });
    bars.addEventListener('click', (e) => {
      const bar = e.target.closest('.gallery__bar');
      if (bar) open(bar); // toque no celular
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
});