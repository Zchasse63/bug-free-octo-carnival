# Color Palette Exploration

> Four palette directions for Cadence (working name). Pick one to lock the color system and unblock the dashboard rebuild.
> Date: 2026-04-18
> Status: Awaiting decision

---

## Why This Document Exists

The Ember orange (`#E94E1B`) that anchored the original design reads too close to Strava. We're resetting the color system. This doc proposes four genuinely distinct palette directions, each with a shell (chrome), a primary accent, a widget palette for bento tiles, and semantic colors.

**Ground rules all palettes follow:**
- Warm, not clinical (Alma / Bevel > Whoop / Peloton)
- Rounded, organic, not sharp/neon
- Shell is quiet (the DATA gets the color)
- Must work in light and dark mode
- WCAG 2.1 AA minimum for all text pairings
- No direct conflict with Strava orange, Runna teal, Whoop teal-on-black, or Nike neon

---

## Palette 1: Graphite + Forest

### Character
Grounded, endurance-coded, trail-adjacent without being literal. Evokes running through pine forests at dawn, cold mornings, a well-worn trail shoe. Serious but warm.

### Shell / Chrome — Warm Graphite Neutrals

<div style="display:flex; gap:8px; margin: 12px 0;">
  <div style="width:80px; height:80px; background:#FAF7F0; border-radius:12px; border:1px solid #E9E2D2; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:#78756F;">#FAF7F0</div>
  <div style="width:80px; height:80px; background:#F0ECE1; border-radius:12px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:#57554F;">#F0ECE1</div>
  <div style="width:80px; height:80px; background:#D4D0C4; border-radius:12px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:#3E3C37;">#D4D0C4</div>
  <div style="width:80px; height:80px; background:#57554F; border-radius:12px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:#E7E5DF;">#57554F</div>
  <div style="width:80px; height:80px; background:#26241F; border-radius:12px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:#EDE9DE;">#26241F</div>
  <div style="width:80px; height:80px; background:#171511; border-radius:12px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:#F5F5F0;">#171511</div>
</div>

| Role | Light | Dark |
|------|-------|------|
| Page bg | `#FAF7F0` | `#0E0D0B` |
| Elevated surface | `#FFFFFF` | `#16140F` |
| Border | `#E9E2D2` | `#2E2B25` |
| Text primary | `#171511` | `#EDE9DE` |
| Text muted | `#78756F` | `#8F8B82` |

### Primary Accent — Deep Forest

<div style="display:flex; gap:8px; margin: 12px 0; align-items:center;">
  <div style="width:120px; height:120px; background:#1F4D3B; border-radius:16px; display:flex; align-items:flex-end; padding:10px; font-family:monospace; font-size:11px; color:#E7EED1;">#1F4D3B</div>
  <div style="font-family:sans-serif; font-size:13px; color:#57554F;">
    Deep, saturated but muted forest green. Distinctive from Runna's brighter teal. Pairs with warm neutrals without shouting.
  </div>
</div>

### Widget Palette — Jewel Tones, Muted

<div style="display:flex; flex-wrap:wrap; gap:8px; margin: 12px 0;">
  <div style="width:100px; height:100px; background:#3E2E7E; border-radius:12px; display:flex; flex-direction:column; justify-content:flex-end; padding:8px; font-family:monospace; font-size:10px; color:#DDD4F5;"><div style="color:white; font-family:sans-serif; font-size:12px;">Training Load</div><div>#3E2E7E</div></div>
  <div style="width:100px; height:100px; background:#1F4D3B; border-radius:12px; display:flex; flex-direction:column; justify-content:flex-end; padding:8px; font-family:monospace; font-size:10px; color:#D0E5DA;"><div style="color:white; font-family:sans-serif; font-size:12px;">Weekly Vol</div><div>#1F4D3B</div></div>
  <div style="width:100px; height:100px; background:#8A4A1F; border-radius:12px; display:flex; flex-direction:column; justify-content:flex-end; padding:8px; font-family:monospace; font-size:10px; color:#F2D9BF;"><div style="color:white; font-family:sans-serif; font-size:12px;">PR Progress</div><div>#8A4A1F</div></div>
  <div style="width:100px; height:100px; background:#6B1F1F; border-radius:12px; display:flex; flex-direction:column; justify-content:flex-end; padding:8px; font-family:monospace; font-size:10px; color:#F2C5C5;"><div style="color:white; font-family:sans-serif; font-size:12px;">HR Zones</div><div>#6B1F1F</div></div>
  <div style="width:100px; height:100px; background:#1E3A5F; border-radius:12px; display:flex; flex-direction:column; justify-content:flex-end; padding:8px; font-family:monospace; font-size:10px; color:#C9DAEB;"><div style="color:white; font-family:sans-serif; font-size:12px;">Long Runs</div><div>#1E3A5F</div></div>
  <div style="width:100px; height:100px; background:#3D3D3D; border-radius:12px; display:flex; flex-direction:column; justify-content:flex-end; padding:8px; font-family:monospace; font-size:10px; color:#CFCFCF;"><div style="color:white; font-family:sans-serif; font-size:12px;">Recovery</div><div>#3D3D3D</div></div>
  <div style="width:100px; height:100px; background:#5A5A2E; border-radius:12px; display:flex; flex-direction:column; justify-content:flex-end; padding:8px; font-family:monospace; font-size:10px; color:#DFE0B8;"><div style="color:white; font-family:sans-serif; font-size:12px;">Gear</div><div>#5A5A2E</div></div>
</div>

### Semantic Colors

<div style="display:flex; gap:8px; margin: 12px 0;">
  <div style="width:80px; height:60px; background:#2F6B3C; border-radius:8px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:white;">success</div>
  <div style="width:80px; height:60px; background:#A16207; border-radius:8px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:white;">warning</div>
  <div style="width:80px; height:60px; background:#8B1F1F; border-radius:8px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:white;">danger</div>
  <div style="width:80px; height:60px; background:#1E5079; border-radius:8px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:white;">info</div>
</div>

### What It Evokes
Trail runners. Marathon training in cool weather. A leather-bound training log. Moss, pine needles, good coffee, worn shoes, the kind of runner who notices the weather before the watch.

### Trade-offs
- **Strong:** distinctive, warm, endurance-coded without cliché
- **Risk:** green can feel environmental/wellness-app (Alma-adjacent). We manage this with warmth and muted saturation.
- **Competitor overlap:** mild — Runna has teal but not forest; Alma has a brighter green; we're deeper and more muted

---

## Palette 2: Obsidian + Rust

### Character
Warm industrial. A forge. Leather, copper, dusty clay. Athletic without being athletic-brand. Russet, terracotta, earthen — but explicitly NOT Strava energetic-orange.

### Shell / Chrome — Warm Obsidian

<div style="display:flex; gap:8px; margin: 12px 0;">
  <div style="width:80px; height:80px; background:#FBF7EF; border-radius:12px; border:1px solid #E9E2D2; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:#78756F;">#FBF7EF</div>
  <div style="width:80px; height:80px; background:#F1ECDF; border-radius:12px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:#57554F;">#F1ECDF</div>
  <div style="width:80px; height:80px; background:#D2CCBC; border-radius:12px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:#3E3C37;">#D2CCBC</div>
  <div style="width:80px; height:80px; background:#5B554A; border-radius:12px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:#EFECE2;">#5B554A</div>
  <div style="width:80px; height:80px; background:#29241C; border-radius:12px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:#EFECE2;">#29241C</div>
  <div style="width:80px; height:80px; background:#15110A; border-radius:12px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:#F7F3E7;">#15110A</div>
</div>

### Primary Accent — Dusty Rust

<div style="display:flex; gap:8px; margin: 12px 0; align-items:center;">
  <div style="width:120px; height:120px; background:#B45A3C; border-radius:16px; display:flex; align-items:flex-end; padding:10px; font-family:monospace; font-size:11px; color:#F6D6C4;">#B45A3C</div>
  <div style="font-family:sans-serif; font-size:13px; color:#57554F;">
    Muted rust / terracotta. Warm but earthy, not energetic. Distinct from Strava's saturated orange — this is the color of old brick, not a highlighter.
  </div>
</div>

### Widget Palette — Warm Earth + Muted Contrasts

<div style="display:flex; flex-wrap:wrap; gap:8px; margin: 12px 0;">
  <div style="width:100px; height:100px; background:#7B3F8F; border-radius:12px; display:flex; flex-direction:column; justify-content:flex-end; padding:8px; font-family:monospace; font-size:10px; color:#E6D1EB;"><div style="color:white; font-family:sans-serif; font-size:12px;">Training Load</div><div>#7B3F8F</div></div>
  <div style="width:100px; height:100px; background:#5E7B4E; border-radius:12px; display:flex; flex-direction:column; justify-content:flex-end; padding:8px; font-family:monospace; font-size:10px; color:#D8E4CA;"><div style="color:white; font-family:sans-serif; font-size:12px;">Weekly Vol</div><div>#5E7B4E</div></div>
  <div style="width:100px; height:100px; background:#B45A3C; border-radius:12px; display:flex; flex-direction:column; justify-content:flex-end; padding:8px; font-family:monospace; font-size:10px; color:#F6D6C4;"><div style="color:white; font-family:sans-serif; font-size:12px;">PR Progress</div><div>#B45A3C</div></div>
  <div style="width:100px; height:100px; background:#8B1F2D; border-radius:12px; display:flex; flex-direction:column; justify-content:flex-end; padding:8px; font-family:monospace; font-size:10px; color:#F2C6CB;"><div style="color:white; font-family:sans-serif; font-size:12px;">HR Zones</div><div>#8B1F2D</div></div>
  <div style="width:100px; height:100px; background:#2E4562; border-radius:12px; display:flex; flex-direction:column; justify-content:flex-end; padding:8px; font-family:monospace; font-size:10px; color:#CBD5E4;"><div style="color:white; font-family:sans-serif; font-size:12px;">Long Runs</div><div>#2E4562</div></div>
  <div style="width:100px; height:100px; background:#4A4640; border-radius:12px; display:flex; flex-direction:column; justify-content:flex-end; padding:8px; font-family:monospace; font-size:10px; color:#D9D5CD;"><div style="color:white; font-family:sans-serif; font-size:12px;">Recovery</div><div>#4A4640</div></div>
  <div style="width:100px; height:100px; background:#8F6E2D; border-radius:12px; display:flex; flex-direction:column; justify-content:flex-end; padding:8px; font-family:monospace; font-size:10px; color:#EFDFB7;"><div style="color:white; font-family:sans-serif; font-size:12px;">Gear</div><div>#8F6E2D</div></div>
</div>

### Semantic Colors

<div style="display:flex; gap:8px; margin: 12px 0;">
  <div style="width:80px; height:60px; background:#4C7340; border-radius:8px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:white;">success</div>
  <div style="width:80px; height:60px; background:#A16207; border-radius:8px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:white;">warning</div>
  <div style="width:80px; height:60px; background:#8B1F2D; border-radius:8px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:white;">danger</div>
  <div style="width:80px; height:60px; background:#2E4562; border-radius:8px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:white;">info</div>
</div>

### What It Evokes
Handcrafted. A bourbon bar. A blacksmith's workshop. Raw, honest, aged. The runner who journals with a fountain pen. Warm masculine without being aggressive. Editorial / Wirecutter / Whalebone-magazine vibe.

### Trade-offs
- **Strong:** warmest, most distinctive palette; zero Strava confusion because it's muted/dusty, not saturated
- **Risk:** "rust" may read slightly dated or industrial-Pinterest to some audiences
- **Pairs with:** the journal book paper color perfectly — almost a continuation

---

## Palette 3: Slate + Cobalt

### Character
Premium SaaS. Linear / Vercel / Arc browser adjacent. Clean, precise, cool-neutral. Confident and contemporary without being cold or techy. The quiet brand — the product speaks.

### Shell / Chrome — Cool Slate Neutrals

<div style="display:flex; gap:8px; margin: 12px 0;">
  <div style="width:80px; height:80px; background:#F8F9FA; border-radius:12px; border:1px solid #E4E6EA; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:#64748B;">#F8F9FA</div>
  <div style="width:80px; height:80px; background:#EEF0F3; border-radius:12px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:#475569;">#EEF0F3</div>
  <div style="width:80px; height:80px; background:#CBD1D9; border-radius:12px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:#1E293B;">#CBD1D9</div>
  <div style="width:80px; height:80px; background:#475569; border-radius:12px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:#E2E8F0;">#475569</div>
  <div style="width:80px; height:80px; background:#1E293B; border-radius:12px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:#E2E8F0;">#1E293B</div>
  <div style="width:80px; height:80px; background:#0F172A; border-radius:12px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:#F1F5F9;">#0F172A</div>
</div>

### Primary Accent — Electric Cobalt

<div style="display:flex; gap:8px; margin: 12px 0; align-items:center;">
  <div style="width:120px; height:120px; background:#2D3FE8; border-radius:16px; display:flex; align-items:flex-end; padding:10px; font-family:monospace; font-size:11px; color:#D6D9FA;">#2D3FE8</div>
  <div style="font-family:sans-serif; font-size:13px; color:#475569;">
    Saturated cobalt. Confident but not playful. Reads as software-serious. Pairs crisply with slate neutrals. NOT navy (too conservative), NOT royal (too generic).
  </div>
</div>

### Widget Palette — Modern, Saturated Jewel Tones

<div style="display:flex; flex-wrap:wrap; gap:8px; margin: 12px 0;">
  <div style="width:100px; height:100px; background:#6D28D9; border-radius:12px; display:flex; flex-direction:column; justify-content:flex-end; padding:8px; font-family:monospace; font-size:10px; color:#E5D8FC;"><div style="color:white; font-family:sans-serif; font-size:12px;">Training Load</div><div>#6D28D9</div></div>
  <div style="width:100px; height:100px; background:#059669; border-radius:12px; display:flex; flex-direction:column; justify-content:flex-end; padding:8px; font-family:monospace; font-size:10px; color:#D0F1E1;"><div style="color:white; font-family:sans-serif; font-size:12px;">Weekly Vol</div><div>#059669</div></div>
  <div style="width:100px; height:100px; background:#EA580C; border-radius:12px; display:flex; flex-direction:column; justify-content:flex-end; padding:8px; font-family:monospace; font-size:10px; color:#FCE0CA;"><div style="color:white; font-family:sans-serif; font-size:12px;">PR Progress</div><div>#EA580C</div></div>
  <div style="width:100px; height:100px; background:#DC2626; border-radius:12px; display:flex; flex-direction:column; justify-content:flex-end; padding:8px; font-family:monospace; font-size:10px; color:#FBC8C8;"><div style="color:white; font-family:sans-serif; font-size:12px;">HR Zones</div><div>#DC2626</div></div>
  <div style="width:100px; height:100px; background:#2D3FE8; border-radius:12px; display:flex; flex-direction:column; justify-content:flex-end; padding:8px; font-family:monospace; font-size:10px; color:#D6D9FA;"><div style="color:white; font-family:sans-serif; font-size:12px;">Long Runs</div><div>#2D3FE8</div></div>
  <div style="width:100px; height:100px; background:#64748B; border-radius:12px; display:flex; flex-direction:column; justify-content:flex-end; padding:8px; font-family:monospace; font-size:10px; color:#D6DBE3;"><div style="color:white; font-family:sans-serif; font-size:12px;">Recovery</div><div>#64748B</div></div>
  <div style="width:100px; height:100px; background:#0891B2; border-radius:12px; display:flex; flex-direction:column; justify-content:flex-end; padding:8px; font-family:monospace; font-size:10px; color:#B4E4F0;"><div style="color:white; font-family:sans-serif; font-size:12px;">Gear</div><div>#0891B2</div></div>
</div>

### Semantic Colors

<div style="display:flex; gap:8px; margin: 12px 0;">
  <div style="width:80px; height:60px; background:#16A34A; border-radius:8px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:white;">success</div>
  <div style="width:80px; height:60px; background:#D97706; border-radius:8px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:white;">warning</div>
  <div style="width:80px; height:60px; background:#DC2626; border-radius:8px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:white;">danger</div>
  <div style="width:80px; height:60px; background:#2D3FE8; border-radius:8px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:white;">info</div>
</div>

### What It Evokes
Modern productivity. Linear, Vercel, Arc, Notion. The "smart serious software" aesthetic. Appeals to data-first runners, engineers, product managers who run. Less editorial, more utility.

### Trade-offs
- **Strong:** instantly reads as modern premium software; zero risk of fitness-brand confusion
- **Risk:** COOL — moves us away from the Alma/Bevel warmth we've been chasing. Journal chat aesthetic would feel disconnected.
- **Competitor overlap:** Linear-adjacent but that's actually a compliment

---

## Palette 4: Ink + Saffron

### Character
Old-world editorial. A bound leather journal with a saffron ribbon marker. Warm, sophisticated, slightly academic. The most distinctly "not-like-other-fitness-apps" direction — reads more like a well-made print magazine than a software product.

### Shell / Chrome — Warm Ink Neutrals

<div style="display:flex; gap:8px; margin: 12px 0;">
  <div style="width:80px; height:80px; background:#FAF7EF; border-radius:12px; border:1px solid #E9E2D2; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:#78756F;">#FAF7EF</div>
  <div style="width:80px; height:80px; background:#F2EDE1; border-radius:12px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:#57554F;">#F2EDE1</div>
  <div style="width:80px; height:80px; background:#D9D0B6; border-radius:12px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:#3E3C37;">#D9D0B6</div>
  <div style="width:80px; height:80px; background:#4C4536; border-radius:12px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:#F2EDE1;">#4C4536</div>
  <div style="width:80px; height:80px; background:#25201A; border-radius:12px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:#F2EDE1;">#25201A</div>
  <div style="width:80px; height:80px; background:#100E08; border-radius:12px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:#F7F3E7;">#100E08</div>
</div>

### Primary Accent — Muted Saffron

<div style="display:flex; gap:8px; margin: 12px 0; align-items:center;">
  <div style="width:120px; height:120px; background:#C48A2A; border-radius:16px; display:flex; align-items:flex-end; padding:10px; font-family:monospace; font-size:11px; color:#F5E4BC;">#C48A2A</div>
  <div style="font-family:sans-serif; font-size:13px; color:#57554F;">
    Saffron / ochre. Warm gold with earthen weight. Distinct from Strava (too yellow), distinct from amber (less sharp). Reads as a treasured color, not a brand color.
  </div>
</div>

### Widget Palette — Editorial Jewel + Earth

<div style="display:flex; flex-wrap:wrap; gap:8px; margin: 12px 0;">
  <div style="width:100px; height:100px; background:#4F3D7C; border-radius:12px; display:flex; flex-direction:column; justify-content:flex-end; padding:8px; font-family:monospace; font-size:10px; color:#DBD3EF;"><div style="color:white; font-family:sans-serif; font-size:12px;">Training Load</div><div>#4F3D7C</div></div>
  <div style="width:100px; height:100px; background:#3F6B4A; border-radius:12px; display:flex; flex-direction:column; justify-content:flex-end; padding:8px; font-family:monospace; font-size:10px; color:#D1E4D6;"><div style="color:white; font-family:sans-serif; font-size:12px;">Weekly Vol</div><div>#3F6B4A</div></div>
  <div style="width:100px; height:100px; background:#C48A2A; border-radius:12px; display:flex; flex-direction:column; justify-content:flex-end; padding:8px; font-family:monospace; font-size:10px; color:#F5E4BC;"><div style="color:white; font-family:sans-serif; font-size:12px;">PR Progress</div><div>#C48A2A</div></div>
  <div style="width:100px; height:100px; background:#7E2E2E; border-radius:12px; display:flex; flex-direction:column; justify-content:flex-end; padding:8px; font-family:monospace; font-size:10px; color:#EACACA;"><div style="color:white; font-family:sans-serif; font-size:12px;">HR Zones</div><div>#7E2E2E</div></div>
  <div style="width:100px; height:100px; background:#1F4A6B; border-radius:12px; display:flex; flex-direction:column; justify-content:flex-end; padding:8px; font-family:monospace; font-size:10px; color:#C2D6E4;"><div style="color:white; font-family:sans-serif; font-size:12px;">Long Runs</div><div>#1F4A6B</div></div>
  <div style="width:100px; height:100px; background:#4C4536; border-radius:12px; display:flex; flex-direction:column; justify-content:flex-end; padding:8px; font-family:monospace; font-size:10px; color:#D8D2BE;"><div style="color:white; font-family:sans-serif; font-size:12px;">Recovery</div><div>#4C4536</div></div>
  <div style="width:100px; height:100px; background:#7B5830; border-radius:12px; display:flex; flex-direction:column; justify-content:flex-end; padding:8px; font-family:monospace; font-size:10px; color:#E3D0B2;"><div style="color:white; font-family:sans-serif; font-size:12px;">Gear</div><div>#7B5830</div></div>
</div>

### Semantic Colors

<div style="display:flex; gap:8px; margin: 12px 0;">
  <div style="width:80px; height:60px; background:#3F6B4A; border-radius:8px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:white;">success</div>
  <div style="width:80px; height:60px; background:#C48A2A; border-radius:8px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:white;">warning</div>
  <div style="width:80px; height:60px; background:#7E2E2E; border-radius:8px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:white;">danger</div>
  <div style="width:80px; height:60px; background:#1F4A6B; border-radius:8px; display:flex; align-items:flex-end; padding:6px; font-family:monospace; font-size:10px; color:white;">info</div>
</div>

### What It Evokes
An academic's training journal. Leather-bound. Brass fittings. The runner who reads books about running philosophy. Most journal-aesthetic-coherent of the four options. Evokes heritage and craft.

### Trade-offs
- **Strong:** most distinctive positioning in fitness app space; perfect continuity with book/journal aesthetic; feels collected and adult
- **Risk:** can read "older" if overdone — must resist the urge to add sepia / parchment decoration; saffron is warm enough that it needs cool widget accents to balance
- **Competitor overlap:** zero — nobody in running does this

---

## Side-by-Side: Primary Accents

<div style="display:flex; gap:16px; margin: 24px 0; flex-wrap:wrap;">
  <div style="text-align:center;">
    <div style="width:140px; height:140px; background:#1F4D3B; border-radius:20px;"></div>
    <div style="margin-top:8px; font-family:sans-serif; font-size:13px; color:#26241F;">Forest</div>
    <div style="font-family:monospace; font-size:11px; color:#78756F;">#1F4D3B</div>
  </div>
  <div style="text-align:center;">
    <div style="width:140px; height:140px; background:#B45A3C; border-radius:20px;"></div>
    <div style="margin-top:8px; font-family:sans-serif; font-size:13px; color:#26241F;">Rust</div>
    <div style="font-family:monospace; font-size:11px; color:#78756F;">#B45A3C</div>
  </div>
  <div style="text-align:center;">
    <div style="width:140px; height:140px; background:#2D3FE8; border-radius:20px;"></div>
    <div style="margin-top:8px; font-family:sans-serif; font-size:13px; color:#26241F;">Cobalt</div>
    <div style="font-family:monospace; font-size:11px; color:#78756F;">#2D3FE8</div>
  </div>
  <div style="text-align:center;">
    <div style="width:140px; height:140px; background:#C48A2A; border-radius:20px;"></div>
    <div style="margin-top:8px; font-family:sans-serif; font-size:13px; color:#26241F;">Saffron</div>
    <div style="font-family:monospace; font-size:11px; color:#78756F;">#C48A2A</div>
  </div>
</div>

---

## Recommendation: Palette 4 — Ink + Saffron

**One sentence:** Ink + Saffron is the most distinct positioning in the fitness app space, coherent with the journal aesthetic we've built, and warm without being saccharine or cliche.

**Why this over the others:**
- **vs Forest:** Forest is strong but slightly environmental/wellness-coded (green = Alma territory). Saffron is warmer and more specifically "crafted."
- **vs Rust:** Rust is close second and my backup pick. It reads slightly more industrial; saffron reads slightly more editorial/literary. Both would work. Saffron wins on "this looks like nothing else in running."
- **vs Cobalt:** Cobalt is the safe bet but moves away from the warm journal feel we've locked. It'd require redesigning the chat surface to be cool. Not worth it.

**If you disagree:** Rust is the strongest alternate. Forest is the most "safe." Cobalt is the most "different mood." Tell me which direction feels right, happy to swap.

---

## Next Step

Once a palette is picked:
1. Update `docs/design/DESIGN-GUIDE.md` Section 3 with the chosen palette as canonical
2. Update all prototypes (chat, activity-detail, training-plan, onboarding) to use the new palette via find-and-replace of color variables
3. Build the bento-preview with widget tile colors drawn from the chosen widget palette
4. Full dashboard rebuild using the chosen palette + chosen widget treatment

## Open Questions

1. **Do the widget palette colors need to match the semantic system?** (E.g., "HR Zones" widget uses the danger/red. Is that confusing — signals "danger" when the widget is neutral info?) Working assumption: use a DIFFERENT hue for HR Zones widget background vs semantic danger. Will refine when palette is picked.
2. **How bold should widget tiles be?** Deep saturated (what's shown above) vs pastel/tinted (lighter fills). Preference TBD via bento-preview.
3. **Paper color for chat stays graywarm (`#EAE5D8`) regardless of palette choice** — the journal surface is its own sub-system.
