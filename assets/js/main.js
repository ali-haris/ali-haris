const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function setText(selector, text) {
  const element = $(selector);
  if (element) element.textContent = text;
}

const icons = {
  email: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm-.4 4.25-7.07 4.42a1 1 0 0 1-1.06 0L4.4 8.25V6.8L12 11.55l7.6-4.75v1.45Z"/></svg>`,
  cv: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm-.5 7V3.7L18.3 9h-4.8ZM8 13h8v1.5H8V13Zm0 3h8v1.5H8V16Zm0-6h4v1.5H8V10Z"/></svg>`,
  projects: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 5a2 2 0 0 1 2-2h5l2 2h5a2 2 0 0 1 2 2v2H4V5Zm0 5h16v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7Z"/></svg>`,
  github: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.69c-2.78.6-3.37-1.19-3.37-1.19-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.04 1.53 1.04.9 1.52 2.35 1.08 2.92.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.55 9.55 0 0 1 12 6.01c.85 0 1.7.11 2.5.34 1.9-1.29 2.74-1.02 2.74-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4v11H3v-11Zm6.2 0h3.8V11h.05c.53-1 1.82-2.05 3.75-2.05 4 0 4.75 2.63 4.75 6.05v5.5h-4v-4.88c0-1.16-.02-2.66-1.62-2.66-1.62 0-1.87 1.27-1.87 2.58v4.96h-4V9.5Z"/></svg>`,
  scholar: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3 1.5 8.6 12 14.2 22.5 8.6 12 3Zm-6 9.4v3.1c0 1.95 2.69 3.5 6 3.5s6-1.55 6-3.5v-3.1l-6 3.2-6-3.2Zm14 0v5.1h2V11.3l-2 1.1Z"/></svg>`
};

function renderProfile() {
  setText('#profileSummary', profile.summary);
  setText('#profileAvailability', profile.availability);
  setText('#profileName', profile.name);
  setText('#profileTitle', profile.title);
  setText('#profileLocation', profile.location);
  setText('#profileEmail', profile.email);

  const social = $('#socialLinks');
  if (social) {
    const links = [
      { label: 'Email', url: `mailto:${profile.email}`, icon: 'email' },
      { label: 'CV', url: 'assets/docs/Haris-Khan-CV.pdf', icon: 'cv' },
      { label: 'Projects PDF', url: 'assets/docs/Haris-Khan-Projects.pdf', icon: 'projects' },
      { label: 'GitHub', url: profile.github, icon: 'github' },
      { label: 'LinkedIn', url: profile.linkedin, icon: 'linkedin' },
      { label: 'Google Scholar', url: profile.scholar, icon: 'scholar' }
    ];

    social.innerHTML = links.map(link => {
      const disabled = !link.url || link.url === '#';
      const href = disabled ? '#' : link.url;
      const target = href.startsWith('mailto:') || disabled ? '' : 'target="_blank" rel="noopener"';
      return `<a class="icon-link ${disabled ? 'disabled' : ''}" href="${href}" ${target}>${icons[link.icon]}<span>${link.label}</span></a>`;
    }).join('');
  }
}

function renderResearchInterests() {
  const container = $('#interestTags');
  if (!container) return;
  container.innerHTML = profile.researchInterests
    .map(interest => `<span class="tag">${interest}</span>`)
    .join('');
}

function renderPublications() {
  const container = $('#publicationList');
  if (!container) return;
  container.innerHTML = publications.map(pub => `
    <article class="pub-card">
      <h3>${pub.title}</h3>
      <p>${pub.authors}</p>
      <p><em>${pub.venue}</em></p>
      <span class="status">${pub.status}</span>
    </article>
  `).join('');
}

function projectCard(project) {
  const stack = project.stack.map(item => `<span class="chip">${item}</span>`).join('');
  const metrics = project.metrics.map(item => `<li>${item}</li>`).join('');
  const links = project.links.map(link => link.url === '#'
    ? `<span>${link.label}</span>`
    : `<a href="${link.url}" target="_blank" rel="noopener">${link.label}</a>`).join(' / ');
  const event = project.event ? `<div class="project-event">${project.event}</div>` : '';
  const compactClass = project.group === 'hackathon' ? 'compact-card' : '';

  return `
    <article class="project-card ${compactClass}">
      <div class="project-meta">
        <span class="tag">${project.label}</span>
        <span class="chip">${project.type}</span>
        ${project.role ? `<span class="chip">${project.role}</span>` : ''}
      </div>
      <h3>${project.title}</h3>
      ${event}
      <p>${project.description}</p>
      <div class="skill-tags">${stack}</div>
      <ul class="metrics">${metrics}</ul>
      <div class="project-links">${links}</div>
    </article>
  `;
}

function renderProjectGroup(title, projectsForGroup) {
  if (!projectsForGroup.length) return '';
  return `
    <div class="project-group">
      <h3 class="group-title">${title} <span>${projectsForGroup.length}</span></h3>
      <div class="project-grid">
        ${projectsForGroup.map(projectCard).join('')}
      </div>
    </div>
  `;
}

function renderProjects(filter = 'all') {
  const container = $('#projectSections');
  if (!container) return;
  const researchProjects = projects.filter(project => project.group === 'research');
  const hackathonProjects = projects.filter(project => project.group === 'hackathon');

  if (filter === 'research') {
    container.innerHTML = renderProjectGroup('Research Projects', researchProjects);
    return;
  }
  if (filter === 'hackathon') {
    container.innerHTML = renderProjectGroup('Hackathon Projects', hackathonProjects);
    return;
  }
  container.innerHTML = [
    renderProjectGroup('Research Projects', researchProjects),
    renderProjectGroup('Hackathon Projects', hackathonProjects)
  ].join('');
}

function renderExperience() {
  const exp = $('#experienceList');
  if (exp) {
    exp.innerHTML = experience.map(item => `
      <article class="timeline-item">
        <h3>${item.role}</h3>
        <p class="timeline-meta">${item.organization} · ${item.period} · ${item.location}</p>
        <ul>${item.bullets.map(bullet => `<li>${bullet}</li>`).join('')}</ul>
      </article>
    `).join('');
  }

  const edu = $('#educationList');
  if (edu) {
    edu.innerHTML = education.map(item => `
      <article class="timeline-item">
        <h3>${item.degree}</h3>
        <p class="timeline-meta">${item.institution} · ${item.period} · ${item.detail}</p>
        <ul>${item.bullets.map(bullet => `<li>${bullet}</li>`).join('')}</ul>
      </article>
    `).join('');
  }
}

function renderSkills() {
  const container = $('#skillsList');
  if (!container) return;
  container.innerHTML = Object.entries(skills).map(([category, items]) => `
    <article class="skill-card">
      <h3>${category}</h3>
      <div class="skill-tags">${items.map(item => `<span class="chip">${item}</span>`).join('')}</div>
    </article>
  `).join('');
}

function renderLists() {
  const achievementsEl = $('#achievementList');
  const workshopsEl = $('#workshopList');
  if (achievementsEl) achievementsEl.innerHTML = achievements.map(item => `<li>${item}</li>`).join('');
  if (workshopsEl) workshopsEl.innerHTML = workshops.map(item => `<li>${item}</li>`).join('');
}

function setupFilters() {
  $$('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
      $$('.filter-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      renderProjects(button.dataset.filter);
    });
  });
}

function setupNavigation() {
  const toggle = $('.nav-toggle');
  const navLinks = $('#navLinks');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  $$('#navLinks a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function init() {
  renderProfile();
  renderResearchInterests();
  renderPublications();
  renderProjects();
  renderExperience();
  renderSkills();
  renderLists();
  setupFilters();
  setupNavigation();
  setText('#year', new Date().getFullYear());
}

document.addEventListener('DOMContentLoaded', init);
