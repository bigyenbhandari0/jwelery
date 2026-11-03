# Current presentation
All Three.js ring scenes, model generators and prototype viewers have been removed, including their dependency declarations. The site uses product photography and a native video element for the featured Atelier Solitaire.

The film and poster already exist at public/films/atelier-solitaire.mp4 and public/films/atelier-solitaire.webp. No binary upload is needed for this change. The same design is used for the homepage, signature panel, collection card and product page. It is an editorial demo, with inquiry-only pricing and no verified stock or material claims.

Video has preload=none, attaches its source when visible or explicitly played, pauses offscreen/in hidden tabs, and does not autoplay with reduced motion or data-saving enabled. Vertical browsing has no WebGL render loop or 3D asset load.
