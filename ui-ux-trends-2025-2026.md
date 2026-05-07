# UI/UX Trends For Regő OS

_Created: 2026-05-07_

## Purpose

This file converts the research notes into practical direction for the future Regő OS build.

The goal is not to chase trends. The goal is to make the birthday gift feel modern, personal, polished, and game-like without becoming generic, bloated, or hard to finish.

## Core Visual Direction

Regő OS should feel like:

- a dark birthday mission console,
- a compact game dashboard,
- slightly anime-inspired through structure and terminology,
- custom-made for Regő,
- brotherly and warm without becoming sentimental.

It should not feel like:

- a generic SaaS dashboard,
- a crypto dashboard,
- a school app,
- a productivity or habit-tracking product,
- a copied anime fan page.

## Modern UI Direction

The research points toward a 2025-2026 style based on:

- warm minimalism,
- tactile interfaces,
- rich but controlled motion,
- glass-like layered panels,
- bento-style modular layouts,
- bright accent colors on dark backgrounds,
- custom texture or authored imperfection.

For this app, translate that into:

- deep graphite / near-black background,
- one strong electric accent,
- one secondary accent,
- sharp readable panel borders,
- subtle glow,
- compact information density,
- mission-card layout,
- a single polished level-up intro.

## Glassmorphism 2.0

Use glass effects as hierarchy, not decoration.

Good use:

- translucent panels over a dark shell,
- `backdrop-filter: blur(...)` as progressive enhancement,
- thin white or neon borders,
- layered cards that still remain readable if blur is unsupported.

Avoid:

- low-contrast text over busy blur,
- making every surface glass,
- relying on blur as the only design feature.

Implementation hints for future Tailwind/CSS:

- `bg-white/5`
- `bg-black/20`
- `border-white/10`
- `backdrop-blur-xl`
- subtle neon border on selected states

## Bento Grid

The app can use a bento-like layout, but only for the mission console.

Useful modules:

- player profile,
- Level 14 status,
- birthday mission briefing,
- program choice,
- food choice,
- watch/play choice,
- optional reward,
- final confirmation summary.

Desktop should feel like a compact command center.

Mobile should become a clean vertical flow with large tap targets.

## Micro-Interactions

Use motion sparingly and intentionally.

Good interactions:

- first-visit Level 13 -> Level 14 progress animation,
- cards press down slightly on tap,
- selected cards glow subtly,
- progress indicator fills,
- final confirmation reveals cleanly,
- hover/tap feedback on primary actions.

Avoid:

- long fake loading sequences,
- constant floating elements,
- aggressive zooms,
- heavy parallax,
- distracting 3D camera effects,
- animations that make the page harder to use.

Respect `prefers-reduced-motion`.

## Game And Anime Language

Use structure and language, not copyrighted visuals.

Good wording:

- `Level 14 unlocked`
- `Mission board`
- `Choose your arc`
- `Squad mission`
- `Power-up meal`
- `Watch/play unlock`
- `Final selection confirmed`

Avoid:

- copied anime characters,
- anime screenshots,
- overdone references,
- childish fantasy wording,
- anything that sounds like homework or self-improvement correction.

## Accessibility Rules

The visual style can be dark and expressive, but the app must remain easy to use.

Requirements:

- readable text contrast,
- visible focus states,
- large tap targets,
- no tiny mobile controls,
- no text clipping,
- no important content hidden under sticky UI,
- reduced motion support.

Do not add a light/dark theme toggle for the MVP. Pick one excellent dark presentation.

## User-Provided Research Note

The user specifically wants these ideas preserved:

- flat design is no longer the target;
- current UI is warmer, more tactile, more immersive;
- glassmorphism should be functional hierarchy, not just decoration;
- bento grids are useful for command-center layouts;
- micro-interactions and gamification make the gift feel alive;
- choosing food can be framed as activating a `Power-up meal`;
- moving forward can be framed as unlocking `Level 14`.
