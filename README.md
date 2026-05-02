# Haris Khan Academic Website — Classic Blue Variant

This version uses a classic blue minimal academic color palette with darker text for better readability.

# Haris Khan — Academic Website

This is a GitHub Pages-ready personal academic website for PhD outreach, research visibility, projects, hackathons, mentorship, and contact information.

## Run locally

Open a terminal inside this folder and run:

```bash
python -m http.server 8000
```

On macOS/Linux, use:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Main files to edit

Most content is stored in JSON files:

```text
assets/data/profile.json      # profile, education, experience, achievements, mentorship, skills
assets/data/projects.json     # research and technical projects
assets/data/hackathons.json   # hackathon projects
```

The site reads these JSON files automatically. You can add, remove, or reorder items without editing the HTML layout.

## Add or remove projects

Open:

```text
assets/data/projects.json
```

Each project has this structure:

```json
{
  "title": "Project Title",
  "category": "AI in Healthcare & Medical Imaging",
  "top": true,
  "role": "Research Project",
  "description": "Short professional description.",
  "stack": ["Python", "PyTorch"],
  "highlights": ["Key result or contribution"],
  "links": [{ "label": "View Project", "url": "https://your-link.com" }]
}
```

Use `"top": true` for projects you want to appear on the homepage. The homepage shows only the top four when the **All Top 4** filter is selected. The full `projects.html` page shows all projects by category.

## Add or remove hackathons

Open:

```text
assets/data/hackathons.json
```

Use `"featured": true` for the main highlighted/winning hackathon. Use `"top": true` for hackathons to show on the homepage. The full `hackathons.html` page lists all hackathons without category filters.

## Links

If a project or hackathon link is `"#"`, it will not be displayed. Replace it with a GitHub, demo, certificate, or project URL when available.

## Profile photo

Replace:

```text
assets/img/profile-placeholder.svg
```

with your own professional photo, or update the `photo` field in `assets/data/profile.json`.

## Publish with GitHub Pages

1. Create a GitHub repository.
2. Upload all files from this folder.
3. Go to **Settings → Pages**.
4. Select **Deploy from a branch**.
5. Choose branch **main** and folder **/root**.
6. Save.

For a personal GitHub Pages site, name the repository:

```text
yourusername.github.io
```


## Latest layout notes

- The top menu is intentionally minimal: Research, Publications, Projects, Hackathons, and Contact.
- Homepage section order is: intro, research interests, education/experience, publications, achievements/service, hackathons, projects, mentorship and judging, skills, contact.
- Projects are edited in `assets/data/projects.json`. Each project can have `category`, `top`, `stack`, `highlights`, and `links`.
- Hackathons are edited in `assets/data/hackathons.json`. The public page does not show filters/categories, but categories can remain in the JSON for future organization.
- Mentorship and judging items are edited in `assets/data/profile.json` under `mentorship`.
- Use `"url": "#"` as a placeholder link until the real project or post link is ready.


## Subtle animations

This version includes light, academic-style motion: smooth scrolling, gentle fade-in for sections/cards, hover transitions, and smooth filter changes. The animations are controlled from:

```text
assets/css/styles.css
assets/js/app.js
```

To reduce or remove animations, search for `Subtle academic animations` in `assets/css/styles.css`. The site already respects the browser's `prefers-reduced-motion` accessibility setting.
