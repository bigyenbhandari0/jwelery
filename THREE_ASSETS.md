# Shared 3D jewelry and hand atelier

Jewelry: original procedural geometry in `src/components/auren/jewelryGeometry.ts`.
The pink-heart design includes a faceted pink heart stone, silver band, pavé stones,
prongs and paired side stones. Each product selects its own geometry. This is a
product-inspired reconstruction, not an exact scan or a manufacturing CAD model.
The previous unrelated round-diamond asset is no longer loaded.

Hand: “Rigged hand” by Elena FF, CC BY-SA 4.0.
Original: https://sketchfab.com/3d-models/rigged-hand-eae97cc2a742413cb5338ab942b12c1e
Distribution: https://github.com/blechdom/morphazoid/tree/main/assets/gesticulating-hand
License: https://creativecommons.org/licenses/by-sa/4.0/
The original textured rigged hand is loaded unchanged; scene scaling, rotation,
lighting and ring attachment are performed at runtime. The hand asset remains
under CC BY-SA 4.0. No claim is made about the model subject’s gender or identity.
The model is posed open using its first animation frame. Ring placement follows
its ring/index/middle finger skeleton joints, with a local-space placement animation.
The renderer allows shared orbit interaction; shadows establish depth and occlusion.

WebGL is required. Its unavailability gives an explicit message and Studio view.
The authoring browser disables WebGL; final GPU appearance needs device validation.
