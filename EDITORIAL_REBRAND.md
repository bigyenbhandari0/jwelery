# AUREN / The Private Edit

Reference: the supplied Sorellé website video. The new identity uses a white editorial canvas, a compact serif AUREN wordmark, a serif/sans headline, burgundy satin imagery, an arched portrait-card carousel, full-screen product imagery and a white sliding details drawer. Live 3D remains removed.

Retained: all six product IDs and existing reference prices, quote-only solitaire, photographic close-ups, size and inscription requests, persistent personal tray, gift concierge, consultation drafts and inquiry export. Optional original solitaire footage remains available on that product page. No business contacts or stock claims have been invented.

## Generated campaign imagery
Built-in image generation was used, with each existing product image as its identity reference. Prompt: preserve the supplied ring's gemstone shape, colour, metal appearance, band, side stones and setting; photograph the same piece naturally on dark oxblood burgundy silk satin with broad folds, directional studio lighting, believable scale, portrait 3:4 framing and generous surrounding fabric; no text, logos, hands or other jewellery.

Final site assets:
- public/editorial/coeur-satin.svg
- public/editorial/marquise-satin.svg
- public/editorial/eternity-satin.svg
- public/editorial/band-satin.svg
- public/editorial/bordeaux-satin.svg
- public/editorial/solitaire-satin.svg

Each is a self-contained text SVG image container holding an optimized WebP photograph. The browser loads it as a separately cached image, not as JavaScript. Source generation files are retained in the working directory under generated_images. Gallery, full-screen viewer and product pages reference the same final asset per piece. Images remain illustrative demo imagery, not verified manufacturer product photography.

## Interaction and performance
The hero cards use CSS transforms and native touch scrolling. Card selection opens a full-screen image with a bounded expansion transition; details use a transform-driven drawer. Escape closes the modal, arrow controls switch pieces, search filters the actual catalogue, and reduced motion skips entrance and expansion animations. No WebGL, Three.js or continuous JavaScript rendering loop is used.
