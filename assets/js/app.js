const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const iconMap = {
  email: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm-.4 4.25-7.07 4.42a1 1 0 0 1-1.06 0L4.4 8.25V6.8L12 11.55l7.6-4.75v1.45Z"/></svg>`,
  cv: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm-.5 7V3.7L18.3 9h-4.8ZM8 13h8v1.5H8V13Zm0 3h8v1.5H8V16Zm0-6h4v1.5H8V10Z"/></svg>`,
  projects: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 5a2 2 0 0 1 2-2h5l2 2h5a2 2 0 0 1 2 2v2H4V5Zm0 5h16v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7Z"/></svg>`,
  github: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.69c-2.78.6-3.37-1.19-3.37-1.19-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.04 1.53 1.04.9 1.52 2.35 1.08 2.92.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.55 9.55 0 0 1 12 6.01c.85 0 1.7.11 2.5.34 1.9-1.29 2.74-1.02 2.74-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4v11H3v-11Zm6.2 0h3.8V11h.05c.53-1 1.82-2.05 3.75-2.05 4 0 4.75 2.63 4.75 6.05v5.5h-4v-4.88c0-1.16-.02-2.66-1.62-2.66-1.62 0-1.87 1.27-1.87 2.58v4.96h-4V9.5Z"/></svg>`,
  scholar: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3 1.5 8.6 12 14.2 22.5 8.6 12 3Zm-6 9.4v3.1c0 1.95 2.69 3.5 6 3.5s6-1.55 6-3.5v-3.1l-6 3.2-6-3.2Zm14 0v5.1h2V11.3l-2 1.1Z"/></svg>`
};

async function loadJSON(path, fallback) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Could not load ${path}`);
    return await response.json();
  } catch (error) {
    console.warn(error.message);
    return fallback;
  }
}

function text(selector, value = '') {
  const el = $(selector);
  if (el) el.textContent = value || '';
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function externalAttrs(url) {
  return url && !url.startsWith('mailto:') && url !== '#' ? 'target="_blank" rel="noopener"' : '';
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function renderProfile(profile) {
  $$('[data-profile]').forEach(el => {
    const key = el.getAttribute('data-profile');
    el.textContent = profile[key] || '';
  });
  const photo = $('#profilePhoto');
  if (photo && profile.photo) photo.src = profile.photo;
  const email = $('#profileEmail');
  if (email) {
    email.textContent = profile.email || '';
    email.href = profile.email ? `mailto:${profile.email}` : '#';
  }
  const links = $('#socialLinks');
  if (links) {
    links.innerHTML = safeArray(profile.links).map(link => {
      const disabled = !link.url || link.url === '#';
      return `<a class="icon-link ${disabled ? 'disabled' : ''}" href="${disabled ? '#' : link.url}" ${externalAttrs(link.url)}>${iconMap[link.icon] || ''}<span>${link.label || 'Link'}</span></a>`;
    }).join('');
  }
  const interests = $('#interestTags');
  if (interests) interests.innerHTML = safeArray(profile.researchInterests).map(item => `<span class="tag">${item}</span>`).join('');
}

function renderEntries(selector, entries, mode) {
  const container = $(selector);
  if (!container) return;
  container.innerHTML = safeArray(entries).map(item => `
    <article class="timeline-item">
      <h3>${mode === 'education' ? item.degree : item.role}</h3>
      <p class="timeline-meta">${[mode === 'education' ? item.institution : item.organization, item.period, mode === 'education' ? item.meta : item.location].filter(Boolean).join(' · ')}</p>
      ${safeArray(item.bullets).length ? `<ul>${safeArray(item.bullets).map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
    </article>
  `).join('') || `<p class="muted">Add entries in <code>assets/data/profile.json</code>.</p>`;
}

function renderPublications(publications) {
  const container = $('#publicationList');
  if (!container) return;
  container.innerHTML = safeArray(publications).map(pub => `
    <article class="pub-card">
      <h3>${pub.title || ''}</h3>
      <p>${pub.authors || ''}</p>
      <p><em>${pub.venue || ''}</em></p>
      ${pub.status ? `<span class="status">${pub.status}</span>` : ''}
    </article>
  `).join('') || `<p class="muted">Add manuscripts in <code>assets/data/profile.json</code>.</p>`;
}

function renderSimpleList(selector, items) {
  const el = $(selector);
  if (!el) return;
  el.innerHTML = safeArray(items).map(item => `<li>${item}</li>`).join('');
}

function renderSkills(skills) {
  const container = $('#skillsList');
  if (!container) return;
  const entries = Object.entries(skills || {});
  container.innerHTML = entries.map(([category, values]) => `
    <article class="skill-card">
      <h3>${category}</h3>
      <div class="skill-tags">${safeArray(values).map(item => `<span class="chip">${item}</span>`).join('')}</div>
    </article>
  `).join('');
}

function card(item, kind = 'project') {
  const links = safeArray(item.links)
    .map(link => {
      const href = link.url || '#';
      return `<a href="${href}" ${externalAttrs(href)}>${link.label || 'View'}</a>`;
    })
    .join(' / ');
  const event = item.event ? `<p class="project-event">${item.event}</p>` : '';
  const result = item.result ? `<span class="badge ${item.featured || /ranked|winner|won/i.test(item.result) ? 'badge-award' : ''}">${item.result}</span>` : '';
  const role = item.role ? `<span class="chip">${item.role}</span>` : '';
  const awardIcon = kind === 'hackathon' && (item.featured || /ranked|winner|won/i.test(item.result || '')) ? `<span class="trophy" aria-label="Award highlight">🏆</span>` : '';
  return `
    <article class="project-card ${kind === 'hackathon' && (item.featured || /ranked|winner|won/i.test(item.result || '')) ? 'winner-card' : ''}">
      <div class="project-meta">
        ${role}
        ${result}
      </div>
      <h3>${awardIcon}${item.title || ''}</h3>
      ${event}
      <p>${item.description || ''}</p>
      ${safeArray(item.stack).length ? `<div class="skill-tags">${safeArray(item.stack).map(t => `<span class="chip">${t}</span>`).join('')}</div>` : ''}
      ${safeArray(item.highlights).length ? `<ul class="metrics">${safeArray(item.highlights).map(h => `<li>${h}</li>`).join('')}</ul>` : ''}
      ${links ? `<div class="project-links">${links}</div>` : ''}
    </article>`;
}

function renderFeaturedHackathon(hackathons) {
  const el = $('#featuredHackathon');
  if (!el) return;
  const item = safeArray(hackathons).find(h => h.featured) || safeArray(hackathons)[0];
  if (!item) { el.innerHTML = ''; return; }
  el.innerHTML = `
    <article class="featured-card winner-highlight">
      <div class="award-marker" aria-hidden="true">🏆</div>
      <div class="featured-text">
        <span class="tag award-tag">Highlighted Hackathon</span>
        <h3>${item.title}</h3>
        <p class="project-event">${item.event || ''}${item.result ? ` · ${item.result}` : ''}</p>
        <p>${item.description || ''}</p>
        <div class="skill-tags">${safeArray(item.stack).map(t => `<span class="chip">${t}</span>`).join('')}</div>
        <div class="project-links"><a href="hackathons.html">See all hackathons →</a></div>
      </div>
    </article>`;
}

function renderMentorship(items) {
  const container = $('#mentorshipList');
  if (!container) return;
  const rows = safeArray(items).map(item => `
    <li>
      <h3>${item.title || ''}</h3>
      ${item.organization ? `<p class="timeline-meta">${item.organization}</p>` : ''}
      <p>${item.description || ''}</p>
      ${item.url ? `<div class="project-links"><a href="${item.url}" ${externalAttrs(item.url)}>View activity →</a></div>` : ''}
    </li>
  `).join('');
  container.innerHTML = rows ? `<ul class="mentorship-list">${rows}</ul>` : `<p class="muted">Add mentorship items in <code>assets/data/profile.json</code>.</p>`;
}

function setupFilterButtons(container, categories, onFilter, allLabel = 'All') {
  if (!container) return;
  container.innerHTML = [`<button class="filter-btn active" data-filter="all">${allLabel}</button>`, ...categories.map(c => `<button class="filter-btn" data-filter="${c}">${c}</button>`)].join('');
  container.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const targetId = container.id === 'homeProjectFilters' ? 'homeProjects' : 'projectCategorySections';
      const target = document.getElementById(targetId);
      if (target) target.classList.add('is-updating');
      window.setTimeout(() => {
        onFilter(btn.dataset.filter);
        refreshAnimations(target);
      }, 120);
    });
  });
}

function renderHomeProjects(projects) {
  const container = $('#homeProjects');
  const filters = $('#homeProjectFilters');
  if (!container) return;
  const cats = unique(projects.map(p => p.category));
  const render = (filter = 'all') => {
    const selected = filter === 'all'
      ? projects.filter(p => p.top).slice(0, 4)
      : projects.filter(p => p.category === filter);
    container.innerHTML = selected.map(item => card(item, 'project')).join('') || `<p class="muted">No projects in this category yet.</p>`;
    refreshAnimations(container);
  };
  setupFilterButtons(filters, cats, render, 'All');
  render('all');
}

function renderHomeHackathons(hackathons) {
  const container = $('#homeHackathons');
  if (!container) return;
  const items = hackathons.filter(h => h.top).slice(0, 4);
  container.innerHTML = items.map(item => card(item, 'hackathon')).join('');
  refreshAnimations(container);
}

function groupedSections(container, items, filter = 'all') {
  if (!container) return;
  const selected = filter === 'all' ? items : items.filter(item => item.category === filter);
  const categories = unique(selected.map(item => item.category));
  container.innerHTML = categories.map(category => {
    const group = selected.filter(item => item.category === category);
    return `<div class="project-group"><h2 class="group-title">${category} <span>${group.length}</span></h2><div class="card-grid">${group.map(item => card(item, 'project')).join('')}</div></div>`;
  }).join('') || `<p class="muted">Nothing to show yet. Add items in the JSON file.</p>`;
  refreshAnimations(container);
}

function simpleCardGrid(container, items, kind = 'project') {
  if (!container) return;
  container.innerHTML = `<div class="card-grid">${safeArray(items).map(item => card(item, kind)).join('')}</div>` || `<p class="muted">Nothing to show yet. Add items in the JSON file.</p>`;
  refreshAnimations(container);
}

function renderProjectPage(projects) {
  const filters = $('#projectPageFilters');
  const container = $('#projectCategorySections');
  if (!container) return;
  const categories = unique(projects.map(p => p.category));
  const render = (filter = 'all') => groupedSections(container, projects, filter);
  setupFilterButtons(filters, categories, render, 'All Projects');
  render('all');
}

function renderHackathonPage(hackathons) {
  const container = $('#hackathonCategorySections');
  if (!container) return;
  simpleCardGrid(container, hackathons, 'hackathon');
}

function setupNavigation() {
  const toggle = $('.nav-toggle');
  const nav = $('#navLinks');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  $$('#navLinks a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

function setupSubtleAnimations() {
  const header = $('.site-header');
  const onScroll = () => {
    if (header) header.classList.toggle('header-scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const candidates = $$('.section, .page-hero, .project-card, .pub-card, .timeline-item, .skill-card, .mentorship-list li');
  if (!('IntersectionObserver' in window)) {
    candidates.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  candidates.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

function refreshAnimations(container) {
  if (!container) return;
  container.classList.remove('is-updating');
  if (!('IntersectionObserver' in window)) return;
  const items = Array.from(container.querySelectorAll('.project-card, .project-group, .skill-card, .timeline-item'));
  items.forEach((el, index) => {
    el.classList.remove('is-visible');
    el.classList.add('reveal');
    el.style.transitionDelay = `${Math.min(index * 35, 140)}ms`;
    requestAnimationFrame(() => el.classList.add('is-visible'));
  });
}

async function init() {
  const [profile, projects, hackathons] = await Promise.all([
    loadJSON('assets/data/profile.json', {}),
    loadJSON('assets/data/projects.json', []),
    loadJSON('assets/data/hackathons.json', [])
  ]);
  renderProfile(profile);
  renderEntries('#educationList', profile.education, 'education');
  renderEntries('#experienceList', profile.experience, 'experience');
  renderPublications(profile.publications);
  renderSimpleList('#achievementList', profile.achievements);
  renderSimpleList('#serviceList', profile.teachingService);
  renderMentorship(profile.mentorship);
  renderSkills(profile.skills);
  renderHomeHackathons(hackathons);
  renderHomeProjects(projects);
  renderProjectPage(projects);
  renderHackathonPage(hackathons);
  setupNavigation();
  setupSubtleAnimations();
  text('#year', new Date().getFullYear());
}

document.addEventListener('DOMContentLoaded', init);
