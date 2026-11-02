# AUREN: verified assets and business information still needed

The shipped experience uses one consistent catalogue cutout per piece. Cards, galleries,
private viewing, related products, the atelier and the tray all consume PRODUCTS.image.
The original product names, demo reference prices and descriptions are retained.
Cutouts were prepared with the built-in image-generation editing tool using existing
catalogue images, with a transparent-background extraction prompt. Original JPEGs are
retained. These are demo assets; production requires brand-approved product photographs.

## Advanced experiences deliberately gated

| Experience | Required input | Current fallback |
| --- | --- | --- |
| Genuine 360 viewing | A brand-approved GLB/glTF or calibrated, consistent multi-angle photos for each exact SKU | Full image, detail crops, zoom, reset, full-screen private viewing |
| Daylight/evening/studio comparison | Matched photographs of the exact item under each light, or verified optical material data | Supplied studio imagery only; no colour-altering pseudo-lighting |
| Realistic hand try-on | Brand-approved aligned photographs on a woman's hand or calibrated hand/product models, dimensions, poses, skin-tone variants and occlusion masks | Photographic close-ups plus personal viewing inquiry |
| Physical stacking | Verified compatible products with dimensions, aligned stack photography or matching 3D assets | Reorderable selection tray and factual design comparison only |
| Live customization | Confirmed SKU option matrices, prices, availability and matching images/models for each metal/stone/finish | As-pictured design plus unconfirmed personal requests |
| Gemstone/craft claims | Metal purity, stone identity, carat/dimensions, origin/certification and approved workshop evidence | Visible design notes and request-for-confirmation language |
| Verified channels | Brand-approved WhatsApp number and Instagram profile | Copyable complete inquiries; BUSINESS_CONTACT stays null |
| Confirmed appointments | Business location/timezone, availability source and scheduling backend | Preferred-date/format request draft; no booking claim |

Contact hooks live in src/lib/boutique.ts and are inactive until verified. No communications
are sent by the demo. Product enquiries retain size, personal requests and requested quantity.

## Cutout prompt

"Precise background extraction for a jewelry catalog. Preserve the exact SINGLE ring from
the supplied image: same viewing angle, gemstone shape, proportions, setting, prongs, band
details, metal and gemstone colors. Remove black backdrop and all floor reflection. Output
only the ring on transparent alpha, including transparency through band openings. Do not
redesign, add stones, enlarge the gemstone, change perspective or introduce text. Centered
square asset with transparent margins; no ground plane, reflection, shadow or border."

Final project assets: src/assets/{heart,ornate,square,band,ruby}-ring-ivory.webp.
