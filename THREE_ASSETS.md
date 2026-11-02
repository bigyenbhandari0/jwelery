# AUREN 3D scene

The original procedural ring and hinged presentation-box geometry lives in
`src/components/auren/CinematicScene.tsx`. No third-party jewelry models are bundled.

Runtime: Three.js (MIT), including its RoomEnvironment studio lighting helper.
- https://github.com/mrdoob/three.js/blob/dev/LICENSE
- https://threejs.org/docs/pages/MeshPhysicalMaterial.html
- https://threejs.org/docs/pages/ExtrudeGeometry.html

Scroll sequence: rotating pink heart ring, ring seated in an opening burgundy box,
two-ring presentation, Eternity rotation/zoom, transition to existing hand photography.
The hand remains a photograph; it is not a 3D hand model. These are stylized original
models inspired by the supplied reference, not the original video's models.

WebGL is required for the 3D experience. If context creation fails, the original
product photograph and shopping sections remain available. The preview browser in
the authoring environment disabled WebGL, so GPU rendering needs visual verification
on a WebGL-enabled device. Build, TypeScript and existing tests are checked separately.
