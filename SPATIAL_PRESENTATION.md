# AUREN spatial presentation

SignatureModel.ts contains original modeled geometry for Rosé Cœur and Infinite Band, not downloaded generic models. The heart reconstruction uses a pink faceted heart, pear side stones, two split pavé rails and three claws. It is product-inspired reconstruction, not manufacturer CAD: hidden construction, materials and proportions are interpretive.

SignatureScene.tsx lazy-loads Three.js, creates actual depth-tested meshes, a studio environment, metallic and transmissive physical materials, and a rounded ivory presentation case. Its front lip sits in front of the lower ring band. Scroll changes native object position and scale; automatic rotation and horizontal dragging change the actual 3D viewpoint. Vertical touch scrolling is preserved. Reset returns to the initial orientation. Reduced motion disables auto-spin and entrance. Offscreen and hidden-tab rendering is skipped; pixel ratio and mobile frame rate are bounded. Resources are disposed on unmount. WebGL failures and context loss show the actual product photograph, explicitly labelled as a fallback.

SignatureEdit.tsx presents two actual reconstructions, expands the chosen panel, reveals descriptive copy and a single price quote, and links to the existing product page. It preserves the original photographic collection, inquiry tools, tray and product data.

Validation: model topology/features and finite vertex checks, physical lip placement, TypeScript, production build, and UI fallback/expansion checks. The available cloud browser reports WebGL disabled, so GPU appearance, refraction, shadows and physical-device frame rate cannot be visually validated there. Do not describe the model as photorealistically verified or as an exact manufacturer model.
