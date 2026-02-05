# Cabinet UI Design System

## Color logic
The interface uses warm, dark-first surfaces with calm saturation. Visual separation relies on layering, spacing, and muted contrast—not brightness.

**Base surfaces**
- Warm dark brown / anthracite (`ember` scale)
- Aubergine / smoky violet (`aubergine` scale)
- Warm gray with red/ochre undertones (`ash`, `sand`)

**Focus & leverage accents (used sparingly)**
- Dusty pink / dark rose (`accent`)
- Muted gold / brass (`brass`)
- Deep wine red (`wine`)

**Structural / cool accents**
- Muted petrol / smoky blue (`petrol`) for navigation and secondary labels

## Priority logic
Each task or compartment is assessed by two axes:
- **urgencyScore (1–5)**: time pressure, deadlines, or blockers
- **leverageScore (1–5)**: impact, revenue, or strategic value

The **Priority Lens** toggles emphasis:
- **Urgency Lens**: highlights time-critical compartments
- **Leverage Lens**: highlights impact-focused compartments
- **Calm Lens**: reduces emphasis for overview mode

## Cabinet metaphor
The home screen is a cabinet grid of tactile compartments. Each compartment:
- Uses a muted but distinct tone
- Shows a preview (counts + 1–3 items)
- Has one primary action
- Supports pinning, reordering, and collapsing
- Subtly elevates with increased usage

## Budget color thresholds
Budget intensity is mapped by spend percentage:
- **Calm**: under 60% → petrol accents
- **Warning**: 60–90% → brass accents
- **Urgent**: above 90% → wine accents

## Add new compartments
1. Update `app/(app)/page.tsx` with a new compartment object.
2. Provide `urgencyScore` and `leverageScore` for lens behavior.
3. Add the route in `components/app-shell.tsx` + `components/command-palette.tsx`.
4. Choose a muted gradient tone (e.g., `from-ember-850/80 to-brass/10`).
