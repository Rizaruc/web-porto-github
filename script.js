/* ============================================================
   Feyrel Hiroya Aghata — Portfolio Script
   ============================================================ */

'use strict';

// ─── GSAP Registration ───────────────────────────────────────
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ─── DOM References ──────────────────────────────────────────
const loader          = document.getElementById('loader');
const loaderProgress  = document.getElementById('loaderProgress');
const loaderText      = document.getElementById('loaderText');
const cursor          = document.getElementById('cursor');
const cursorFollower  = document.getElementById('cursorFollower');
const navbar          = document.getElementById('navbar');
const hamburger       = document.getElementById('hamburger');
const mobileMenu      = document.getElementById('mobileMenu');
const scrollIndicator = document.getElementById('scrollIndicator');
const navLinks        = document.querySelectorAll('.nav-link');
const filterBtns      = document.querySelectorAll('.filter-btn');
const galleryItems    = document.querySelectorAll('.gallery-item');
const mobileLinks     = document.querySelectorAll('.mobile-link');

// ─── Block scroll during load ────────────────────────────────
document.body.style.overflow = 'hidden';

/* ============================================================
   LOADER
============================================================ */
(function initLoader() {
  let progress = 0;
  const messages = ['Loading...', 'Preparing...', 'Almost there...', 'Welcome!'];
  let msgIdx = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      loaderText.textContent = messages[3];
      loaderProgress.style.width = '100%';
      setTimeout(hideLoader, 500);
    } else {
      if (progress > 30 && msgIdx === 0) { msgIdx = 1; loaderText.textContent = messages[1]; }
      if (progress > 65 && msgIdx === 1) { msgIdx = 2; loaderText.textContent = messages[2]; }
      loaderProgress.style.width = progress + '%';
    }
  }, 100);
})();

function hideLoader() {
  gsap.to(loader, {
    opacity: 0,
    duration: 0.6,
    ease: 'power2.inOut',
    onComplete: () => {
      loader.style.display = 'none';
      document.body.style.overflow = '';
      scrollIndicator.classList.add('visible');
      runHeroAnimations();
    }
  });
}

/* ============================================================
   HERO ANIMATIONS — runs after loader hides
   NOTE: Hero elements must NOT have reveal-up/reveal-right CSS
   classes that set opacity:0. GSAP handles hero visibility.
============================================================ */
function runHeroAnimations() {
  // Make sure hero elements are visible before animating
  const heroEls = document.querySelectorAll(
    '.hero-tag, .title-line, .hero-desc, .hero-buttons, .hero-stats, .hero-right, .hero-scroll-hint'
  );
  heroEls.forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo('.hero-tag',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 })
    .fromTo('.title-line',
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.12 }, '-=0.3')
    .fromTo('.hero-desc',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 }, '-=0.4')
    .fromTo('.hero-buttons',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 }, '-=0.4')
    .fromTo('.hero-stats',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 }, '-=0.4')
    .fromTo('.hero-right',
      { x: 60, opacity: 0 },
      { x: 0, opacity: 1, duration: 1 }, '-=0.8')
    .fromTo('.hero-scroll-hint',
      { opacity: 0 },
      { opacity: 1, duration: 0.6 }, '-=0.2');

  // Counter animation
  document.querySelectorAll('.stat-number[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2,
      delay: 1.2,
      ease: 'power2.out',
      onUpdate: () => { el.textContent = Math.round(obj.val); }
    });
  });
}

/* ============================================================
   CUSTOM CURSOR
============================================================ */
(function initCursor() {
  // Hide on touch devices
  if ('ontouchstart' in window) {
    cursor.style.display = 'none';
    cursorFollower.style.display = 'none';
    document.body.style.cursor = 'auto';
    document.querySelectorAll('*').forEach(el => el.style.cursor = '');
    return;
  }

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.set(cursor, { x: mouseX, y: mouseY });
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    gsap.set(cursorFollower, { x: followerX, y: followerY });
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Use event delegation for hover
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('a, button, .filter-btn, .gallery-inner, .skill-tag');
    if (target) {
      cursor.classList.add('hover');
      cursorFollower.classList.add('hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('a, button, .filter-btn, .gallery-inner, .skill-tag');
    if (target) {
      cursor.classList.remove('hover');
      cursorFollower.classList.remove('hover');
    }
  });
})();

/* ============================================================
   NAVBAR
============================================================ */
(function initNavbar() {
  let lastScroll = 0;
  navbar.style.transition = 'background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease, transform 0.4s ease';

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 50);

    if (scrollY > lastScroll && scrollY > 300) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    lastScroll = scrollY <= 0 ? 0 : scrollY;
  }, { passive: true });
})();

/* ============================================================
   MOBILE MENU
============================================================ */
hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ============================================================
   SMOOTH SCROLL
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   ACTIVE NAV ON SCROLL
============================================================ */
(function initActiveNav() {
  const sections = document.querySelectorAll('.section[id]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(s => observer.observe(s));
})();

/* ============================================================
   SCROLL REVEAL (for Portfolio & About sections only)
   Hero is handled by GSAP above.
============================================================ */
(function initScrollReveal() {
  // Only target elements OUTSIDE the hero section
  const revealEls = document.querySelectorAll(
    '.portfolio-section .reveal-up, .portfolio-section .reveal-left, .portfolio-section .reveal-right,' +
    '.about-section .reveal-up, .about-section .reveal-left, .about-section .reveal-right,' +
    '.footer .reveal-up'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Find index among siblings for stagger
        const parent = entry.target.parentElement;
        const siblings = Array.from(parent.querySelectorAll('.reveal-up, .reveal-left, .reveal-right'));
        const idx = siblings.indexOf(entry.target);
        const delay = idx * 90;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
})();

/* ============================================================
   PORTFOLIO FILTER
============================================================ */
(function initFilter() {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      let visibleIdx = 0;

      galleryItems.forEach(item => {
        const cat = item.dataset.category;
        const show = filter === 'all' || cat === filter;

        if (show) {
          item.style.display = '';
          item.classList.remove('hidden');
          gsap.fromTo(item,
            { opacity: 0, y: 24, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.45, delay: visibleIdx * 0.07, ease: 'power2.out' }
          );
          visibleIdx++;
        } else {
          gsap.to(item, {
            opacity: 0, scale: 0.95, duration: 0.25, ease: 'power2.in',
            onComplete: () => {
              item.classList.add('hidden');
              item.style.display = 'none';
            }
          });
        }
      });
    });
  });
})();

/* ============================================================
   SCROLL PROGRESS DOT
============================================================ */
(function initScrollProgress() {
  const dot = document.getElementById('scrollDot');
  if (!dot) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? scrollTop / docHeight : 0;
    // Move dot within 80px line height
    dot.style.top = (pct * 80) + 'px';
  }, { passive: true });
})();

/* ============================================================
   GSAP SCROLL TRIGGER — Portfolio & About
============================================================ */
window.addEventListener('load', () => {
  ScrollTrigger.refresh();

  // Portfolio header
  gsap.fromTo('.portfolio-section .section-tag, .portfolio-section .section-title, .portfolio-section .section-desc, .filter-bar',
    { opacity: 0, y: 35 },
    {
      opacity: 1, y: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.portfolio-section',
        start: 'top 80%',
      }
    }
  );

  // Gallery items stagger
  gsap.fromTo('.gallery-item',
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.gallery-grid',
        start: 'top 85%',
      }
    }
  );

  // About left image
  gsap.fromTo('.about-left',
    { opacity: 0, x: -50 },
    {
      opacity: 1, x: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about-section',
        start: 'top 80%',
      }
    }
  );

  // About right content
  gsap.fromTo('.about-right > *',
    { opacity: 0, y: 35 },
    {
      opacity: 1, y: 0,
      duration: 0.75,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about-section',
        start: 'top 75%',
      }
    }
  );
});

console.log('%cMochammad Rizal Fakhri — Portfolio', 'color:#c0392b;font-family:serif;font-size:18px;font-weight:bold;');
console.log('%cPPLG · 3D Artist', 'color:#888;font-size:12px;');

/* ============================================================
   LIGHTBOX
============================================================ */
(function initLightbox() {
  const lightbox       = document.getElementById('lightbox');
  const lightboxImg    = document.getElementById('lightboxImg');
  const lightboxCaption= document.getElementById('lightboxCaption');
  const lightboxCounter= document.getElementById('lightboxCounter');
  const closeBtn       = document.getElementById('lightboxClose');
  const prevBtn        = document.getElementById('lightboxPrev');
  const nextBtn        = document.getElementById('lightboxNext');
  const backdrop       = document.getElementById('lightboxBackdrop');

  // Collect all visible gallery images
  let items = [];
  let currentIndex = 0;

  function buildItems() {
    items = [];
    document.querySelectorAll('.gallery-item:not([style*="display: none"]) .gallery-inner').forEach(inner => {
      const img   = inner.querySelector('img');
      const title = inner.querySelector('.gallery-title');
      if (img) items.push({ src: img.src, alt: img.alt, title: title ? title.textContent : '' });
    });
  }

  function openLightbox(index) {
    buildItems();
    if (!items.length) return;
    currentIndex = index;
    showImage(currentIndex);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Update nav visibility
    updateNav();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    // Clear src after transition
    setTimeout(() => { lightboxImg.src = ''; }, 350);
  }

  function showImage(index) {
    const item = items[index];
    if (!item) return;

    // Animate out → in
    gsap.to(lightboxImg, {
      opacity: 0, scale: 0.95, duration: 0.18, ease: 'power2.in',
      onComplete: () => {
        lightboxImg.src  = item.src;
        lightboxImg.alt  = item.alt;
        lightboxCaption.textContent = item.title;
        lightboxCounter.textContent = `${index + 1} / ${items.length}`;
        gsap.to(lightboxImg, { opacity: 1, scale: 1, duration: 0.28, ease: 'power2.out' });
      }
    });

    updateNav();
  }

  function updateNav() {
    prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
    nextBtn.style.opacity = currentIndex === items.length - 1 ? '0.3' : '1';
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === items.length - 1;
  }

  function prev() {
    if (currentIndex > 0) { currentIndex--; showImage(currentIndex); }
  }

  function next() {
    if (currentIndex < items.length - 1) { currentIndex++; showImage(currentIndex); }
  }

  // Click on gallery item → open lightbox
  document.addEventListener('click', (e) => {
    const inner = e.target.closest('.gallery-inner');
    // Don't open if clicking the itch.io link
    if (e.target.closest('a.gallery-arrow')) return;
    if (!inner) return;

    buildItems();
    const img = inner.querySelector('img');
    if (!img) return;

    // Find index by src
    const idx = items.findIndex(item => item.src === img.src);
    openLightbox(idx >= 0 ? idx : 0);
  });

  // Controls
  closeBtn.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); next(); });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   prev();
    if (e.key === 'ArrowRight')  next();
  });

  // Touch / swipe support
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) < 40) return;
    dx < 0 ? next() : prev();
  }, { passive: true });
})();
