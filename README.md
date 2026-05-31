# Sky Monitor

Sky Monitor is a responsive astronomy planning dashboard inspired by modern night-sky tools. It is designed as a polished static front end for planning observing sessions, comparing sky conditions, and exploring different viewing locations.

## Live Demo

[Open the live site](https://ken8303.github.io/sky-monitor/)

## Highlights

- Responsive astronomy dashboard with a strong visual identity
- Switchable observing locations with tailored mock conditions
- Night-quality timeline and confidence chart
- Planner modes for visual, photo, and travel sessions
- GitHub Pages deployment through GitHub Actions

## Built With

- `HTML` for structure
- `CSS` for the glassy night-sky visual system and responsive layout
- `JavaScript` for client-side state and interaction
- `GitHub Actions` for deployment

## Project Structure

- `index.html` contains the page structure
- `styles.css` contains the visual design and responsive layout
- `script.js` powers the interactive location and planner state
- `.github/workflows/deploy-pages.yml` publishes the site with GitHub Pages

## Local Development

Open `index.html` directly in a browser, or run a simple static server from the project folder.

## Deployment

This repository deploys automatically from `main` using GitHub Pages.

1. Push changes to `main`
2. GitHub Actions runs the Pages workflow
3. The published site updates at the live demo URL

## Good Next Steps

- Connect real astronomy and weather APIs
- Save favorite observing locations
- Add a map and richer chart detail
- Rebuild as React or Next.js if the project grows
