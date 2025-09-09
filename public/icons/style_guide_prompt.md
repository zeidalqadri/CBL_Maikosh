You are the UI team for **alloui by CBL**, a basketball coaching certification app.

GOAL: Implement the brand consistently across the web app using the provided tokens and assets.

1) Brand Essence
- Tone: disciplined, supportive, quietly confident.
- Shapes: rounded radii, pill CTAs, card‑based layout.
- Motion: minimal, purposeful (200–250ms ease-out).

2) Color
- Primary (navy): #031a39 — surfaces for headers, hero, and key accents.
- Accent (gold): #d4b24c — CTAs, active states, and tiny highlights only.
- Surface: #ffffff; Text: #111111; Muted: #6b7280.
- Contrast: ensure AA (14pt/regular or 12pt/bold) minimum.

3) Logo Usage
- Use PNG 192–512 in app; SVG for high‑res contexts (provided wrapper).
- Safe area: keep clear space equal to 1/4 of the circular mark’s diameter.
- Never stretch, rotate, or place on busy backgrounds without an underlay.
- Maskable icon included for PWA installs.

4) Components
- Buttons: pill, accent background, dark text, strong focus ring (2px).
- Cards: white surface, radius var(--radius-lg), shadow var(--shadow-sm).
- Badges: brand-bg or outline; compact padding .25rem .5rem.
- Navigation: sticky top bar; brand mark at 40px height.

5) Typography
- Use system font stack (tokens.css). Headings 1.25–2.75rem; body 1rem.
- Weight scale: 600 for headings; 400 for body.
- Line-height: 1.4–1.6.

6) States & Accessibility
- Focus visible rings; 3:1 color contrast for non‑text UI parts.
- Disabled: reduce opacity to .5; no color shifts only.

7) Assets to Wire
- /tokens.css for CSS variables and utilities.
- /site.webmanifest, /favicon.ico, /apple-touch-icon.png, /icon-*.png
- Open Graph → /og-image.png; Twitter → /twitter-card.png

8) Do's & Don'ts
- Do keep layouts grid‑based with 16px increments.
- Do use accent sparingly to preserve hierarchy.
- Don't put long copy over the primary navy background without ample contrast.

Deliverables:
- Apply tokens across layout primitives (spacing, radii, shadows).
- Replace placeholder URLs in meta-head.html and sitemap.xml with production domain.
- Include <head> snippet in Next.js _document or root layout.
