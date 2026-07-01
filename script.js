/* ============================================================
   CREATIVE PORTFOLIO 2024 — script.js
   Handles: Smooth scroll, Navbar toggle, Active nav,
            Scroll reveal, Feedback carousel
   ============================================================ */

'use strict';

/* ─── DOM REFERENCES ──────────────────────────────────────── */
const navbar       = document.getElementById('navbar');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navLinks     = document.getElementById('navLinks');
const navLinkItems = document.querySelectorAll('.nav-link');
const carouselTrack = document.getElementById('carouselTrack');
const dots          = document.querySelectorAll('.dot');
const revealItems   = document.querySelectorAll('.reveal-item');
const feedbackCards = document.querySelectorAll('.feedback-card');

/* ─── NAVBAR — GLASS ON SCROLL ────────────────────────────── */
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Add scrolled class after 60px
  if (scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  lastScrollY = scrollY;
}, { passive: true });

// Extra style for scrolled state
const style = document.createElement('style');
style.textContent = `
  .navbar.scrolled .navbar-inner {
    background: rgba(6, 6, 6, 0.88);
    border-color: rgba(0, 245, 255, 0.15);
  }
`;
document.head.appendChild(style);

/* ─── HAMBURGER MENU ─────────────────────────────────────── */
hamburgerBtn.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburgerBtn.classList.toggle('open', isOpen);
  hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
});

// Close mobile menu when a link is clicked
navLinkItems.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburgerBtn.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    hamburgerBtn.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }
});

/* ─── SMOOTH SCROLL ──────────────────────────────────────── */
navLinkItems.forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = navbar.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  });
});

/* ─── ACTIVE NAV LINK (INTERSECTION OBSERVER) ─────────────── */
const sections = document.querySelectorAll('section[id]');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinkItems.forEach(link => {
        const isActive = link.getAttribute('data-section') === id;
        link.classList.toggle('active', isActive);
      });
    }
  });
}, {
  rootMargin: '-30% 0px -60% 0px',
  threshold: 0
});

sections.forEach(section => navObserver.observe(section));

/* ─── SCROLL REVEAL ──────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Unobserve after reveal so it stays visible
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  rootMargin: '0px 0px -80px 0px',
  threshold: 0.1
});

revealItems.forEach(item => revealObserver.observe(item));

/* ─── FEEDBACK CAROUSEL ──────────────────────────────────── */
let currentIndex = 1; // Start at active card
const totalCards  = feedbackCards.length;

function getCardWidth() {
  if (!feedbackCards[0]) return 340;
  const card = feedbackCards[0];
  const style = getComputedStyle(card);
  return card.offsetWidth + parseInt(style.marginRight || '0') + 24; // 24 = gap
}

function updateCarousel(index) {
  // Clamp
  index = Math.max(0, Math.min(totalCards - 1, index));
  currentIndex = index;

  // Calculate offset to center the active card
  const trackEl = carouselTrack;
  const wrapperWidth = trackEl.parentElement.offsetWidth;
  const cardWidth = getCardWidth();
  const totalWidth = cardWidth * totalCards + 24 * (totalCards - 1);
  
  // Center the active card
  let offset = (index * cardWidth) - (wrapperWidth / 2) + (cardWidth / 2) - 24;
  offset = Math.max(0, Math.min(offset, totalWidth - wrapperWidth));
  
  trackEl.style.transform = `translateX(-${offset}px)`;

  // Update card states
  feedbackCards.forEach((card, i) => {
    card.classList.toggle('feedback-card--active', i === index);
  });

  // Update dots
  dots.forEach((dot, i) => {
    dot.classList.toggle('dot--active', i === index);
  });
}

// Dot click
dots.forEach((dot, i) => {
  dot.addEventListener('click', () => updateCarousel(i));
});

// Arrow key navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft')  updateCarousel(currentIndex - 1);
  if (e.key === 'ArrowRight') updateCarousel(currentIndex + 1);
});

// Touch / drag support
let touchStartX = 0;
let touchEndX   = 0;
let isDragging  = false;

carouselTrack.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].clientX;
  isDragging  = true;
}, { passive: true });

carouselTrack.addEventListener('touchend', (e) => {
  if (!isDragging) return;
  touchEndX = e.changedTouches[0].clientX;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 40) {
    updateCarousel(diff > 0 ? currentIndex + 1 : currentIndex - 1);
  }
  isDragging = false;
}, { passive: true });

// Mouse drag support
let mouseStartX = 0;
let mouseDown   = false;

carouselTrack.addEventListener('mousedown', (e) => {
  mouseStartX = e.clientX;
  mouseDown   = true;
  carouselTrack.style.cursor = 'grabbing';
});

document.addEventListener('mouseup', (e) => {
  if (!mouseDown) return;
  const diff = mouseStartX - e.clientX;
  if (Math.abs(diff) > 50) {
    updateCarousel(diff > 0 ? currentIndex + 1 : currentIndex - 1);
  }
  mouseDown = false;
  carouselTrack.style.cursor = '';
});

document.addEventListener('mouseleave', () => {
  mouseDown = false;
  carouselTrack.style.cursor = '';
});

// Auto-advance carousel every 5s
let autoPlayTimer = setInterval(() => {
  const next = (currentIndex + 1) % totalCards;
  updateCarousel(next);
}, 4000);

// Pause autoplay on user interaction
function pauseAutoplay() {
  clearInterval(autoPlayTimer);
  autoPlayTimer = setInterval(() => {
    const next = (currentIndex + 1) % totalCards;
    updateCarousel(next);
  }, 7000);
}

dots.forEach(dot => dot.addEventListener('click', pauseAutoplay));
carouselTrack.addEventListener('touchstart', pauseAutoplay, { passive: true });
carouselTrack.addEventListener('mousedown', pauseAutoplay);

/* ─── INIT ───────────────────────────────────────────────── */
// Initialize carousel position after DOM paint
window.addEventListener('load', () => {
  updateCarousel(currentIndex);
});

// Recalculate on resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => updateCarousel(currentIndex), 120);
}, { passive: true });

/* ─── CONTACT INPUT GLOW ──────────────────────────────────── */
// Already handled via CSS :focus, but add JS for label effect
document.querySelectorAll('.contact-input, .contact-textarea').forEach(input => {
  input.addEventListener('focus', () => input.classList.add('focused'));
  input.addEventListener('blur',  () => input.classList.remove('focused'));
});

/* ─── CTA BUTTON SCROLL ───────────────────────────────────── */
const ctaBtn = document.querySelector('.btn-cta');
if (ctaBtn) {
  ctaBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById('thumbnails');
    if (target) {
      const offset = navbar.offsetHeight + 20;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
}



document.getElementById("contactForm").addEventListener("submit", async function(e) {
  e.preventDefault(); // stop Google redirect

  const form = e.target;
  const data = new FormData(form);

  try {
    await fetch(form.action, {
      method: "POST",
      body: data,
      mode: "no-cors" // avoids CORS errors
    });

    // Define status element once
    const status = document.getElementById("form-status");

    // Show success message
    status.innerText = "✅ Message sent successfully!";
    status.style.color = "#0f0";

    // Clear inputs
    form.reset();

    // Hide message after 3 seconds
    setTimeout(() => {
      status.innerText = "";
    }, 3000);

  } catch (error) {
    const status = document.getElementById("form-status");
    status.innerText = "❌ Something went wrong. Try again.";
    status.style.color = "#f00";

    // Hide error after 5 seconds
    setTimeout(() => {
      status.innerText = "";
    }, 5000);
  }
});


/* ─── CATEGORY FILTER ───────────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const allThumbCards = document.querySelectorAll('.thumb-card');
const catTextMap = { 'Project Details': 'details', 'Project Design': 'design', 'Project Develop': 'develop' };

allThumbCards.forEach(card => {
  const txt = card.querySelector('.thumb-detail').textContent.replace('▸', '').trim();
  card.dataset.category = catTextMap[txt] || 'details';
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
    btn.classList.add('filter-btn--active');
    const filter = btn.dataset.filter;
    allThumbCards.forEach(card => {
      card.classList.toggle('hidden', !(filter === 'all' || card.dataset.category === filter));
    });
  });
});

