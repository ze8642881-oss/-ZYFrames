/* ============================================================
   PROJECT DETAILS PAGE — details.js
   Reads ?id= from URL, finds matching project, renders it.
   Pure vanilla JavaScript.
   ============================================================ */

'use strict';

const projectsData = [
  { id: 1,  category: 'Project Details', title: 'Project Alpha',    image: 'images/Thumbnail 1.png',  description: 'A bold visual identity crafted to maximize click-through rates while staying true to the creator\'s brand voice. Every element was designed with viewer attention in mind.' },
  { id: 2,  category: 'Project Details', title: 'Project Beta',     image: 'images/Thumbnail 2.png',  description: 'A clean, high-contrast thumbnail series built for a fast-growing channel, balancing bold typography with striking imagery to stand out in a crowded feed.' },
  { id: 3,  category: 'Project Details', title: 'Project 2024',     image: 'images/Thumbnail 3.png',  description: 'Part of the flagship 2024 campaign — a cohesive set of thumbnails designed to carry a consistent visual theme across an entire content series.' },
  { id: 4,  category: 'Project Details', title: 'Project Delta',    image: 'images/Thumbnail 4.png',  description: 'A dynamic composition combining motion cues and vibrant color grading to drive curiosity and boost engagement on every upload.' },
  { id: 5,  category: 'Project Details', title: 'Project Sunakale', description: 'An experimental design exploring dramatic lighting and cinematic framing, tailored for a creator pushing into a bolder visual direction.', image: 'images/Thumbnail 5.png' },
  { id: 6,  category: 'Project Details', title: 'Project Folio',    image: 'images/Thumbnail 6.png',  description: 'A portfolio-style thumbnail set emphasizing clarity and minimalism, letting the subject matter speak for itself without visual clutter.' },
  { id: 7,  category: 'Project Design',  title: 'Project A06',      image: 'images/Thumbnail 7.png',  description: 'A design-forward exploration blending abstract shapes with sharp typography, created to test new stylistic directions for the brand.' },
  { id: 8,  category: 'Project Details', title: 'Project Studio',   image: 'images/project-8.jpg',  description: 'A studio-quality thumbnail package featuring polished lighting and composition, aimed at premium, high-production-value content.' },
  { id: 9,  category: 'Project Develop', title: 'Project API',      image: 'images/project-9.jpg',  description: 'A technical content series thumbnail set, designed to communicate complex developer topics through simple, high-contrast visuals.' },
  { id: 10, category: 'Project Details', title: 'Project Web',      image: 'images/project-10.jpg', description: 'A web-focused design series built to highlight product and interface work, with clean layouts that translate well at small sizes.' },
  { id: 11, category: 'Project Details', title: 'Project Motion',   image: 'images/project-11.jpg', description: 'A motion-inspired thumbnail treatment using dynamic diagonals and blur effects to convey energy and movement at a glance.' },
  { id: 12, category: 'Project Details', title: 'Project Sound',    image: 'images/project-12.jpg', description: 'An audio-visual themed design crafted for a music and sound-focused channel, pairing waveform motifs with bold color accents.' },
];

function getProjectIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10);
  return Number.isNaN(id) ? null : id;
}

function renderProject() {
  const id = getProjectIdFromUrl();
  const project = projectsData.find(p => p.id === id);

  const container = document.getElementById('detailContainer');
  const notFound  = document.getElementById('detailNotFound');

  if (!project) {
    container.style.display = 'none';
    notFound.style.display = 'flex';
    return;
  }

  const imageWrap   = document.querySelector('.detail-image-wrap');
  const imageEl     = document.getElementById('detailImage');
  const categoryEl  = document.getElementById('detailCategory');
  const titleEl     = document.getElementById('detailTitle');
  const descEl      = document.getElementById('detailDescription');

  document.title = `${project.title} — Creative Portfolio`;
  categoryEl.textContent = project.category;
  titleEl.textContent = project.title;
  descEl.textContent = project.description;

  imageEl.src = project.image;
  imageEl.alt = project.title;
  imageEl.addEventListener('error', () => imageWrap.classList.add('img-fallback'));

  requestAnimationFrame(() => container.classList.add('visible'));
}

window.addEventListener('load', renderProject);
