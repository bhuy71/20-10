// ============================ CHUYỂN CẢNH ============================
function showScene(id) {
  document.querySelectorAll(".scene").forEach((s) => s.classList.remove("active"));
  const target = document.getElementById(id);
  if (target) target.classList.add("active");
  document.body.classList.toggle("space-mode", id === "scene4");

  // Đổi nhạc nền theo cảnh
  setSceneMusic(id);

  // Khi vào cảnh vũ trụ thì khởi tạo Three.js
  if (id === "scene4") {
    initGalaxy3D();
  }

  // Trả nút "Ko" về chỗ cũ mỗi khi vào lại cảnh 3
  if (id === "scene3") {
    const nb = document.getElementById("noBtn");
    if (nb) {
      nb.classList.remove("runaway");
      nb.style.left = "";
      nb.style.top = "";
      nb.textContent = "Ko 😤";
    }
  }
  window.scrollTo(0, 0);
}

document.querySelectorAll("[data-next]").forEach((btn) => {
  btn.addEventListener("click", () => {
    burstHearts(btn);
    showScene(btn.dataset.next); // đặt đúng bản nhạc cho cảnh mới
    tryPlayMusic();              // rồi mới phát
  });
});

document.getElementById("restartBtn").addEventListener("click", () => {
  showScene("scene1");
});

// ============================ NÚT "KO" CHẠY TRỐN (CẢNH 3) ============================
const noBtn = document.getElementById("noBtn");
if (noBtn) {
  const dodgeMessages = [
    "Ko 😤", "Hổng cho đâu 😝", "Bắt hông được nè 😜", "Hí hí 🙈",
    "Thử lại đi 😆", "Khó ghê ha 😏", "Em phải đồng ý cơ 🥺", "Chạy nè 💨",
  ];

  function dodge() {
    noBtn.classList.add("runaway");
    const bw = noBtn.offsetWidth || 120;
    const bh = noBtn.offsetHeight || 50;
    const maxX = Math.max(10, window.innerWidth - bw - 16);
    const maxY = Math.max(10, window.innerHeight - bh - 16);
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    noBtn.style.left = x + "px";
    noBtn.style.top = y + "px";
    noBtn.textContent = dodgeMessages[Math.floor(Math.random() * dodgeMessages.length)];
  }

  // Né khi rê chuột tới, khi chạm, và cả khi cố bấm
  noBtn.addEventListener("mouseenter", dodge);
  noBtn.addEventListener("mousedown", (e) => { e.preventDefault(); dodge(); });
  noBtn.addEventListener("touchstart", (e) => { e.preventDefault(); dodge(); }, { passive: false });
  noBtn.addEventListener("click", (e) => { e.preventDefault(); dodge(); });
}

// ============================ TIM BAY NỀN ============================
const heartsLayer = document.getElementById("hearts");
const heartEmojis = ["💕", "💖", "💗", "🌸", "💞", "🎀", "💓"];

function spawnHeart() {
  const h = document.createElement("div");
  h.className = "heart";
  h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  h.style.left = Math.random() * 100 + "vw";
  h.style.fontSize = 16 + Math.random() * 22 + "px";
  const dur = 6 + Math.random() * 6;
  h.style.animationDuration = dur + "s";
  heartsLayer.appendChild(h);
  setTimeout(() => h.remove(), dur * 1000);
}
setInterval(spawnHeart, 450);

// Tim bắn ra khi bấm nút
function burstHearts(origin) {
  const rect = origin.getBoundingClientRect();
  for (let i = 0; i < 12; i++) {
    const h = document.createElement("div");
    h.className = "heart";
    h.textContent = "💖";
    h.style.left = rect.left + rect.width / 2 + "px";
    h.style.bottom = window.innerHeight - rect.top + "px";
    h.style.fontSize = 18 + Math.random() * 18 + "px";
    const dur = 1.6 + Math.random() * 1.2;
    h.style.animationDuration = dur + "s";
    h.style.transform = `translateX(${(Math.random() - 0.5) * 200}px)`;
    heartsLayer.appendChild(h);
    setTimeout(() => h.remove(), dur * 1000);
  }
}

// ============================ CẢNH VŨ TRỤ 3D (Three.js) ============================
// ----- CHỈNH Ở ĐÂY -----
const PHOTO_SOURCES = [
  "images/10.jpeg",
  "images/11.jpeg",
  "images/12.jpeg",
  "images/13.jpeg",
  "images/14.jpg",
  "images/2.jpeg",
  "images/3.jpeg",
  "images/4.jpeg",
  "images/5.jpeg",
  "images/6.jpeg",
  "images/7.jpg",
  "images/8.jpeg",
  "images/9.jpeg",
  "images/15.jpg"
];
const TILE_COUNT = 88;   // tổng số khung ảnh bay quanh hành tinh
// Lời nhắn hiện khi bấm vào ảnh (chọn ngẫu nhiên). Em có thể thêm/sửa tùy thích.
const LOVE_NOTES = [
  "Ai mà xinh thíiii nhỉ",
  "Cute quá nè!",
  "Xinh xỉu lun á",
  "Mờ ê meeeeee",
  "Cua này xinh qué",
  "Đẹp kém anh 1 xíu",
  "wow wow wow, khét đấy nhể",
  "Ngang hoa hậu"
];

let galaxyInited = false;
let THREE_REFS = null; // giữ tham chiếu để resize/animate

function initGalaxy3D() {
  if (galaxyInited) {
    onResize3D();
    return;
  }
  if (typeof THREE === "undefined") {
    console.warn("Three.js chưa tải được.");
    return;
  }
  galaxyInited = true;

  const container = document.getElementById("galaxyCanvas");
  const W = container.clientWidth || window.innerWidth;
  const H = container.clientHeight || window.innerHeight;

  // Scene + camera + renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(46, W / H, 0.1, 3000);
  camera.position.set(0, 22, 700);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  container.appendChild(renderer.domElement);

  // Ánh sáng
  scene.add(new THREE.AmbientLight(0xffffff, 0.82));
  const point = new THREE.PointLight(0xffa6c9, 2.05, 0, 2);
  point.position.set(0, 130, 260);
  scene.add(point);

  // ----- Sao nền -----
  const starGeo = new THREE.BufferGeometry();
  const starCount = 1900;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const r = 820 + Math.random() * 1300;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPos[i * 3 + 2] = r * Math.cos(phi);
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 3.15,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.96,
  });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  const brightStarTex = makeStarTexture();
  const brightStars = new THREE.Group();
  for (let i = 0; i < 90; i++) {
    const sp = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: brightStarTex,
        color: 0xffffff,
        transparent: true,
        opacity: 0.72 + Math.random() * 0.28,
        depthWrite: false,
      })
    );
    const r = 760 + Math.random() * 1000;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    sp.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );
    const s = 7 + Math.random() * 9;
    sp.scale.set(s, s, 1);
    brightStars.add(sp);
  }
  scene.add(brightStars);

  // Cụm trung tâm: kéo/zoom sẽ tác động đồng bộ hành tinh, vòng tim và ảnh.
  const orbitGroup = new THREE.Group();
  scene.add(orbitGroup);

  // ----- Hành tinh hồng ở giữa -----
  const planetGroup = new THREE.Group();
  orbitGroup.add(planetGroup);

  const planetGeo = new THREE.SphereGeometry(96, 96, 96);
  const planetMat = new THREE.MeshStandardMaterial({
    map: makePlanetTexture(),
    color: 0xffbdd3,
    emissive: 0x9f3b64,
    emissiveIntensity: 0.28,
    roughness: 0.74,
    metalness: 0.04,
  });
  const planet = new THREE.Mesh(planetGeo, planetMat);
  planetGroup.add(planet);

  // Quầng sáng quanh hành tinh
  const glowGeo = new THREE.SphereGeometry(114, 56, 56);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xff8fba,
    transparent: true,
    opacity: 0.18,
    side: THREE.BackSide,
  });
  planetGroup.add(new THREE.Mesh(glowGeo, glowMat));

  // Hai vành đai trái tim đan chéo nhau, bao quanh hành tinh như mẫu.
  const ringGroup = new THREE.Group();
  planetGroup.add(ringGroup);
  const heartTex = makeHeartTexture();

  const ringA = new THREE.Group();
  buildHeartRing(ringA, heartTex, 132, 96, 16);
  ringA.rotation.set(THREE.MathUtils.degToRad(72), 0, THREE.MathUtils.degToRad(22));
  ringGroup.add(ringA);

  const ringB = new THREE.Group();
  buildHeartRing(ringB, heartTex, 132, 96, 16);
  ringB.rotation.set(THREE.MathUtils.degToRad(72), 0, THREE.MathUtils.degToRad(-22));
  ringGroup.add(ringB);

  // ----- Các khung ảnh quay quanh -----
  const photoGroup = new THREE.Group();
  orbitGroup.add(photoGroup);

  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin(null);
  const photoTextureCache = new Map();
  const photoMaterialWaiters = new Map();
  const photoPickTargets = [];
  const photoCards = [];
  const fallbackTex = makeHeartPhotoTexture();
  const frameMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.96,
  });
  const edgeMat = new THREE.MeshBasicMaterial({
    color: 0xff93bd,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.42,
  });

  function applyPhotoTexture(mat, tex) {
    mat.map = tex;
    mat.needsUpdate = true;
  }

  function attachPhotoTexture(src, mat) {
    const cached = photoTextureCache.get(src);
    if (cached) {
      applyPhotoTexture(mat, cached);
      return;
    }

    const waiters = photoMaterialWaiters.get(src);
    if (waiters) {
      waiters.push(mat);
      return;
    }

    photoMaterialWaiters.set(src, [mat]);
    loader.load(
      src,
      (tex) => {
        if ("colorSpace" in tex && THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
        if ("encoding" in tex && THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        photoTextureCache.set(src, tex);
        for (const waitingMat of photoMaterialWaiters.get(src) || []) {
          applyPhotoTexture(waitingMat, tex);
        }
        photoMaterialWaiters.delete(src);
      },
      undefined,
      () => {
        photoMaterialWaiters.delete(src);
      }
    );
  }

  const lanes = [-118, -84, -50, -18, 16, 50, 84, 116];
  const perLane = Math.ceil(TILE_COUNT / lanes.length);

  for (let i = 0; i < TILE_COUNT; i++) {
    const src = PHOTO_SOURCES[i % PHOTO_SOURCES.length];

    // Ảnh nằm trên nhiều vòng tròn quanh hành tinh, không dùng ellipse kéo ngang.
    const laneIndex = i % lanes.length;
    const stepIndex = Math.floor(i / lanes.length);
    const theta = ((stepIndex + laneIndex * 0.42) / perLane) * Math.PI * 2;
    const orbitRadius = 265 + (laneIndex % 3) * 18;
    let y = lanes[laneIndex] + Math.sin(theta * 2.2 + laneIndex) * 6;
    const horizontalRadius = Math.sqrt(Math.max(0, orbitRadius * orbitRadius - y * y * 0.72));
    const x = Math.cos(theta) * horizontalRadius;
    const z = Math.sin(theta) * horizontalRadius;
    if (z > 100 && Math.abs(x) < 150 && Math.abs(y) < 80) {
      y += y >= 0 ? 96 : -96;
    }

    const card = new THREE.Group();
    card.position.set(x, y, z);

    const laneCenterBoost = 1 - Math.min(1, Math.abs(lanes[laneIndex]) / 140) * 0.18;
    const w = 32 * laneCenterBoost;
    const h = 42 * laneCenterBoost;
    const frameGeo = new THREE.PlaneGeometry(w + 11, h + 17);
    const edgeGeo = new THREE.PlaneGeometry(w + 15, h + 21);
    const photoGeo = new THREE.PlaneGeometry(w, h);
    const pickGeo = new THREE.PlaneGeometry(w + 18, h + 24);

    const edge = new THREE.Mesh(edgeGeo, edgeMat.clone());
    edge.position.z = -0.7;
    card.add(edge);

    const frame = new THREE.Mesh(frameGeo, frameMat.clone());
    frame.position.z = -0.35;
    card.add(frame);

    const mat = new THREE.MeshBasicMaterial({
      map: fallbackTex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.88,
    });
    const mesh = new THREE.Mesh(photoGeo, mat);
    mesh.position.y = 3;
    mesh.position.z = 0.2;

    const pickMat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const pickTarget = new THREE.Mesh(pickGeo, pickMat);
    pickTarget.position.z = 0.8;
    pickTarget.userData = {
      src,
      note: LOVE_NOTES[i % LOVE_NOTES.length],
    };
    mesh.userData = pickTarget.userData;
    card.userData = {
      ...pickTarget.userData,
      baseScale: 0.74 + ((stepIndex + laneIndex) % 5) * 0.035,
      materials: [edge.material, frame.material, mat],
    };

    photoGroup.add(card);
    card.add(pickTarget);
    card.add(mesh);
    photoPickTargets.push(pickTarget);
    photoCards.push(card);

    // Mỗi file ảnh chỉ tải một lần, các card trùng ảnh dùng chung texture.
    attachPhotoTexture(src, mat);
  }

  // ----- Điều khiển: kéo xoay + zoom (tự viết, không cần OrbitControls) -----
  const state = {
    rotX: 0.08,    // nghiêng
    rotY: 0,       // xoay ngang
    targetRotX: 0.08,
    targetRotY: 0,
    dist: 700,
    targetDist: 700,
    dragging: false,
    lastX: 0,
    lastY: 0,
  };
  const startTime = performance.now();

  const dom = renderer.domElement;

  function pointerDown(e) {
    state.dragging = true;
    const p = e.touches ? e.touches[0] : e;
    state.lastX = p.clientX;
    state.lastY = p.clientY;
  }
  function pointerMove(e) {
    if (!state.dragging) return;
    if (e.touches && e.touches.length >= 2) return; // đang chụm 2 ngón -> để cho zoom, không xoay
    const p = e.touches ? e.touches[0] : e;
    const dx = p.clientX - state.lastX;
    const dy = p.clientY - state.lastY;
    state.lastX = p.clientX;
    state.lastY = p.clientY;
    state.targetRotY += dx * 0.005;
    state.targetRotX += dy * 0.005;
    state.targetRotX = Math.max(-1.2, Math.min(1.2, state.targetRotX));
  }
  function pointerUp() {
    state.dragging = false;
  }

  dom.addEventListener("mousedown", pointerDown);
  window.addEventListener("mousemove", pointerMove);
  window.addEventListener("mouseup", pointerUp);
  dom.addEventListener("touchstart", pointerDown, { passive: true });
  dom.addEventListener("touchmove", pointerMove, { passive: true });
  dom.addEventListener("touchend", pointerUp);

  // Zoom bằng cuộn chuột
  dom.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      state.targetDist += e.deltaY * 0.4;
      state.targetDist = Math.max(390, Math.min(980, state.targetDist));
    },
    { passive: false }
  );

  // Zoom bằng chụm 2 ngón (mobile)
  let pinchStart = null;
  dom.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const d = Math.hypot(dx, dy);
        if (pinchStart != null) {
          state.targetDist += (pinchStart - d) * 1.2;
          state.targetDist = Math.max(390, Math.min(980, state.targetDist));
        }
        pinchStart = d;
      }
    },
    { passive: true }
  );
  dom.addEventListener("touchend", () => (pinchStart = null));

  // ----- Bấm vào ảnh -> mở modal -----
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let downPos = null;

  dom.addEventListener("mousedown", (e) => (downPos = { x: e.clientX, y: e.clientY }));
  dom.addEventListener("click", (e) => {
    // bỏ qua nếu là thao tác kéo (di chuyển nhiều)
    if (downPos && Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y) > 6) return;
    pickPhoto(e.clientX, e.clientY);
  });
  dom.addEventListener("touchend", (e) => {
    if (state.dragging) return;
    const t = e.changedTouches[0];
    if (t) pickPhoto(t.clientX, t.clientY);
  });

  function pickPhoto(clientX, clientY) {
    const rect = dom.getBoundingClientRect();
    mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(photoPickTargets);
    if (hits.length > 0) {
      const m = hits[0].object;
      openPhotoModal(m.userData.src, m.userData.note);
    }
  }

  // ----- Vòng lặp render -----
  function animate() {
    THREE_REFS.raf = requestAnimationFrame(animate);

    const time = performance.now() - startTime;
    // mượt hóa (easing)
    state.rotY += (state.targetRotY - state.rotY) * 0.08;
    state.rotX += (state.targetRotX - state.rotX) * 0.08;
    state.dist += (state.targetDist - state.dist) * 0.08;

    orbitGroup.rotation.y = state.rotY + time * 0.000055;
    orbitGroup.rotation.x = state.rotX * 0.72;
    planet.rotation.y += 0.0028;
    ringGroup.rotation.y += 0.006;
    stars.rotation.y += 0.0003;
    brightStars.rotation.y -= 0.00018;

    camera.position.set(0, state.dist * 0.035, state.dist);
    camera.lookAt(0, 0, 0);

    orbitGroup.updateMatrixWorld(true);

    // Ảnh luôn quay mặt về camera, đồng thời ảnh gần camera to và rõ hơn.
    const worldPos = new THREE.Vector3();
    for (const card of photoCards) {
      card.lookAt(camera.position);
      card.getWorldPosition(worldPos);
      const near = THREE.MathUtils.clamp((worldPos.z + 320) / 640, 0, 1);
      const scale = card.userData.baseScale * (0.38 + near * 0.92);
      const opacity = 0.22 + near * 0.76;
      card.scale.setScalar(scale);
      card.renderOrder = Math.round(near * 1000);
      for (const mat of card.userData.materials) {
        mat.opacity = mat === card.userData.materials[2] ? opacity : Math.min(1, opacity + 0.16);
      }
    }

    renderer.render(scene, camera);
  }

  THREE_REFS = { scene, camera, renderer, container };
  onResize3D = function () {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener("resize", onResize3D);

  animate();
}

let onResize3D = function () {};

function buildHeartRing(parent, texture, radius, count, size) {
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const sp = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
      })
    );
    // Vòng tròn phẳng trên mặt phẳng XZ; group cha sẽ nghiêng để tạo dáng đan chéo.
    sp.position.set(Math.cos(a) * radius, 0, Math.sin(a) * radius);
    sp.scale.set(size, size, 1);
    parent.add(sp);
  }
}

// Tạo texture trái tim (cho vành đai)
function makeHeartTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d");
  drawHeart(ctx, 32, 34, 32, "#9e2336");
  drawHeart(ctx, 32, 34, 27, "#f25a67");
  return new THREE.CanvasTexture(c);
}

// Texture dự phòng khi ảnh chưa có: khung trắng + trái tim
function makeHeartPhotoTexture() {
  const c = document.createElement("canvas");
  c.width = 230;
  c.height = 280;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = "#ffe0ee";
  ctx.fillRect(12, 12, c.width - 24, c.width - 24);
  drawHeart(ctx, c.width / 2, (c.width - 24) / 2 + 12, 60, "#ff5f93");
  return new THREE.CanvasTexture(c);
}

function makeStarTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,246,252,0.95)");
  g.addColorStop(0.55, "rgba(255,255,255,0.35)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function makePlanetTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext("2d");

  const bg = ctx.createLinearGradient(0, 0, 0, c.height);
  bg.addColorStop(0, "#ffd1df");
  bg.addColorStop(0.42, "#f69aba");
  bg.addColorStop(1, "#de5f88");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, c.width, c.height);

  ctx.globalAlpha = 0.24;
  for (let y = 18; y < c.height; y += 26) {
    for (let x = (y % 52) / 2; x < c.width; x += 38) {
      drawHeart(ctx, x, y + Math.sin(x * 0.03) * 2, 8, "#fff0f5");
    }
  }

  ctx.globalAlpha = 0.16;
  for (let y = 44; y < c.height; y += 38) {
    ctx.fillStyle = "#ffe1ea";
    ctx.fillRect(0, y, c.width, 3);
    ctx.fillStyle = "#d87394";
    ctx.fillRect(0, y + 6, c.width, 1);
  }

  ctx.globalAlpha = 0.12;
  ctx.fillStyle = "#f24872";
  for (let i = 0; i < 18; i++) {
    drawHeart(ctx, Math.random() * c.width, Math.random() * c.height, 12 + Math.random() * 8, "#f24872");
  }

  ctx.globalAlpha = 1;
  return new THREE.CanvasTexture(c);
}

function drawHeart(ctx, x, y, size, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  const s = size / 16;
  ctx.moveTo(x, y + 4 * s);
  ctx.bezierCurveTo(x, y, x - 8 * s, y - 6 * s, x - 8 * s, y - 1 * s);
  ctx.bezierCurveTo(x - 8 * s, y + 5 * s, x, y + 9 * s, x, y + 12 * s);
  ctx.bezierCurveTo(x, y + 9 * s, x + 8 * s, y + 5 * s, x + 8 * s, y - 1 * s);
  ctx.bezierCurveTo(x + 8 * s, y - 6 * s, x, y, x, y + 4 * s);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// ============================ MODAL ẢNH ============================
const photoModal = document.getElementById("photoModal");
const modalImg = document.getElementById("modalImg");
const modalMsg = document.getElementById("modalMsg");
const modalClose = document.getElementById("modalClose");

function openPhotoModal(src, note) {
  modalMsg.textContent = note || "Anh yêu em 💗";
  // Nếu ảnh lỗi thì ẩn thẻ img, chỉ hiện lời nhắn
  modalImg.onerror = () => {
    modalImg.style.display = "none";
  };
  modalImg.style.display = "block";
  modalImg.src = src;
  photoModal.classList.add("open");
}

function closePhotoModal() {
  photoModal.classList.remove("open");
}

modalClose.addEventListener("click", closePhotoModal);
photoModal.addEventListener("click", (e) => {
  if (e.target === photoModal) closePhotoModal();
});

// ============================ NHẠC NỀN THEO CẢNH ============================
const bgm = document.getElementById("bgm");
const musicBtn = document.getElementById("musicToggle");
let musicOn = false;

// Mỗi cảnh dùng bản nhạc nào (file trong folder sound/)
const SCENE_TRACKS = {
  scene0: "sound/scene_1.mp4",
  scene1: "sound/scene_1.mp4",
  scene2: "sound/scene_1.mp4",
  scene3: "sound/scene_2.mp4",
  scene3b: "sound/scene_2.mp4",
  scene4: "sound/scene_3.mp4",
};

let currentTrack = "";

// Đổi bản nhạc theo cảnh; chỉ nạp lại khi khác bản đang phát
function setSceneMusic(sceneId) {
  const track = SCENE_TRACKS[sceneId];
  if (!bgm || !track || track === currentTrack) return;
  currentTrack = track;
  bgm.src = track;
  bgm.volume = 0.5;
  if (musicOn) {
    bgm.play().catch(() => {});
  }
}

function tryPlayMusic() {
  if (!musicOn && bgm) {
    bgm.volume = 0.5;
    bgm.play().then(() => {
      musicOn = true;
      musicBtn.textContent = "🎵";
    }).catch(() => {
      // Trình duyệt chặn autoplay - chờ người dùng bấm nút
    });
  }
}

musicBtn.addEventListener("click", () => {
  if (!bgm) return;
  if (musicOn) {
    bgm.pause();
    musicOn = false;
    musicBtn.textContent = "🔇";
  } else {
    bgm.volume = 0.5;
    bgm.play().then(() => {
      musicOn = true;
      musicBtn.textContent = "🎵";
    }).catch(() => {});
  }
});

// Nạp sẵn bản nhạc của cảnh mở đầu
setSceneMusic("scene0");
