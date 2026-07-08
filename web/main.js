/* ============================================================
   NUVO — Cinematic Landing Page Interactivity
   Three.js Neural Sphere · Scroll Animations · Cursor Effects
   Parallax · Magnetic Buttons · Star Field · Neural Bars
   ============================================================ */

(function () {
  'use strict';

  // ─── LOADING SCREEN ───
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 2200);
  });

  // ─── CUSTOM CURSOR ───
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let dotX = 0, dotY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    // Smooth follow for ring
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';

    // Faster follow for dot
    dotX += (mouseX - dotX) * 0.25;
    dotY += (mouseY - dotY) * 0.25;
    cursorDot.style.left = dotX + 'px';
    cursorDot.style.top = dotY + 'px';

    // Glow follows mouse directly
    cursorGlow.style.left = mouseX + 'px';
    cursorGlow.style.top = mouseY + 'px';

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover state for interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .feature-card, .rec-item, .cta-input');
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  // ─── NAVIGATION SCROLL EFFECT ───
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // ─── SCROLL REVEAL ───
  const revealElements = document.querySelectorAll('.reveal');
  const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => revealObserver.observe(el));

  // ─── MAGNETIC BUTTONS ───
  const magneticBtns = document.querySelectorAll('.magnetic-btn');

  magneticBtns.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.03)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0) scale(1)';
    });
  });

  // ─── FEATURE CARD 3D TILT ───
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (y - 0.5) * -12;
      const rotateY = (x - 0.5) * 12;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
      card.style.setProperty('--mouse-x', x * 100 + '%');
      card.style.setProperty('--mouse-y', y * 100 + '%');
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0) scale(1)';
    });
  });

  // ─── NEURAL ACTIVITY BARS ───
  const neuralBarsContainer = document.getElementById('neuralBars');
  const barCount = 40;

  for (let i = 0; i < barCount; i++) {
    const bar = document.createElement('div');
    bar.classList.add('neural-bar');
    const height = Math.random() * 35 + 8;
    bar.style.height = height + 'px';
    bar.style.animationDelay = (Math.random() * 2) + 's';
    bar.style.animationDuration = (0.8 + Math.random() * 1.2) + 's';
    neuralBarsContainer.appendChild(bar);
  }

  // ─── STAR FIELD (Canvas Background) ───
  const starCanvas = document.getElementById('starField');
  const starCtx = starCanvas.getContext('2d');
  let stars = [];

  function initStars() {
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
    stars = [];
    const count = Math.floor((starCanvas.width * starCanvas.height) / 8000);

    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * starCanvas.width,
        y: Math.random() * starCanvas.height,
        r: Math.random() * 1.2 + 0.2,
        alpha: Math.random() * 0.5 + 0.1,
        speed: Math.random() * 0.0005 + 0.0001,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  function drawStars(time) {
    starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);

    for (const star of stars) {
      const alpha = star.alpha + Math.sin(time * star.speed + star.phase) * 0.15;
      starCtx.beginPath();
      starCtx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      starCtx.fillStyle = `rgba(180, 200, 255, ${Math.max(0, alpha)})`;
      starCtx.fill();
    }

    requestAnimationFrame(drawStars);
  }

  initStars();
  requestAnimationFrame(drawStars);
  window.addEventListener('resize', initStars);

  // ═══════════════════════════════════════════════
  // ─── THREE.JS NEURAL SPHERE ───
  // ═══════════════════════════════════════════════

  const heroCanvas = document.getElementById('heroCanvas');

  // Check if THREE is available
  if (typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    heroCanvas.appendChild(renderer.domElement);

    // ─── Particle Sphere (neural nodes) ───
    const PARTICLE_COUNT = 1800;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const phases = new Float32Array(PARTICLE_COUNT);

    const colorPalette = [
      new THREE.Color(0x00C6FF), // Blue
      new THREE.Color(0x8B5CF6), // Violet
      new THREE.Color(0x06D6A0), // Cyan
      new THREE.Color(0xC850C0), // Magenta
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Fibonacci sphere distribution
      const phi = Math.acos(1 - 2 * (i + 0.5) / PARTICLE_COUNT);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const radius = 1.8 + (Math.random() - 0.5) * 0.3;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      sizes[i] = Math.random() * 3 + 1;
      phases[i] = Math.random() * Math.PI * 2;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const particleSphere = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSphere);

    // ─── Connection Lines (flowing light trails) ───
    const LINE_COUNT = 300;
    const linePositions = [];
    const lineColors = [];

    for (let i = 0; i < LINE_COUNT; i++) {
      const idx1 = Math.floor(Math.random() * PARTICLE_COUNT);
      let idx2 = Math.floor(Math.random() * PARTICLE_COUNT);
      while (idx2 === idx1) idx2 = Math.floor(Math.random() * PARTICLE_COUNT);

      const p1 = new THREE.Vector3(positions[idx1 * 3], positions[idx1 * 3 + 1], positions[idx1 * 3 + 2]);
      const p2 = new THREE.Vector3(positions[idx2 * 3], positions[idx2 * 3 + 1], positions[idx2 * 3 + 2]);

      // Only connect nearby particles
      if (p1.distanceTo(p2) < 1.2) {
        linePositions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
        const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        lineColors.push(col.r, col.g, col.b, col.r, col.g, col.b);
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(linesMesh);

    // ─── Inner Glow Sphere ───
    const glowGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x00C6FF,
      transparent: true,
      opacity: 0.02,
      blending: THREE.AdditiveBlending,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glowMesh);

    // ─── Mouse interaction ───
    let targetRotX = 0, targetRotY = 0;
    let currentRotX = 0, currentRotY = 0;

    document.addEventListener('mousemove', (e) => {
      targetRotX = (e.clientY / window.innerHeight - 0.5) * 0.5;
      targetRotY = (e.clientX / window.innerWidth - 0.5) * 0.5;
    });

    // ─── Animation loop ───
    let time = 0;

    function animate() {
      requestAnimationFrame(animate);
      time += 0.005;

      // Smooth rotation toward mouse
      currentRotX += (targetRotX - currentRotX) * 0.03;
      currentRotY += (targetRotY - currentRotY) * 0.03;

      particleSphere.rotation.x = currentRotX + time * 0.1;
      particleSphere.rotation.y = currentRotY + time * 0.15;
      linesMesh.rotation.x = currentRotX + time * 0.1;
      linesMesh.rotation.y = currentRotY + time * 0.15;
      glowMesh.rotation.x = currentRotX + time * 0.05;
      glowMesh.rotation.y = currentRotY + time * 0.08;

      // Animate particle sizes (breathing effect)
      const posAttr = particleGeometry.attributes.position;
      const origPositions = positions;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const phase = phases[i];
        const breathe = Math.sin(time * 2 + phase) * 0.04;
        const idx = i * 3;

        const ox = origPositions[idx];
        const oy = origPositions[idx + 1];
        const oz = origPositions[idx + 2];
        const len = Math.sqrt(ox * ox + oy * oy + oz * oz);

        posAttr.array[idx] = ox + (ox / len) * breathe;
        posAttr.array[idx + 1] = oy + (oy / len) * breathe;
        posAttr.array[idx + 2] = oz + (oz / len) * breathe;
      }
      posAttr.needsUpdate = true;

      // Pulse glow
      glowMat.opacity = 0.015 + Math.sin(time * 3) * 0.01;

      // Pulse connection opacity
      lineMaterial.opacity = 0.08 + Math.sin(time * 4) * 0.04;

      renderer.render(scene, camera);
    }

    animate();

    // ─── Resize handler ───
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ─── Scroll parallax for sphere ───
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      const progress = Math.min(scrollY / heroHeight, 1);

      // Move sphere up and scale down as user scrolls
      particleSphere.position.y = progress * 2;
      linesMesh.position.y = progress * 2;
      glowMesh.position.y = progress * 2;

      particleSphere.scale.setScalar(1 - progress * 0.3);
      linesMesh.scale.setScalar(1 - progress * 0.3);

      // Fade out
      particleMaterial.opacity = 0.85 * (1 - progress);
      lineMaterial.opacity = (0.08 + Math.sin(time * 4) * 0.04) * (1 - progress);
    });

  } else {
    console.warn('Three.js not loaded — neural sphere disabled.');
  }

  // ─── SMOOTH ANCHOR SCROLLING ───
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
