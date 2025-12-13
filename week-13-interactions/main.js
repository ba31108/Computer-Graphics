import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const app = document.getElementById("app");
const infoEl = document.getElementById("info");


const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f1115);

const camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);
camera.position.set(8, 8, 14);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
app.appendChild(renderer.domElement);


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;


scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
dirLight.position.set(10, 12, 6);
scene.add(dirLight);


const grid = new THREE.GridHelper(30, 30, 0x3a3f4b, 0x2b2f3a);
grid.position.y = -4;
scene.add(grid);


const cubes = [];
const cubeCount = 25; // >= 20 cubes

function rand(min, max) {
  return min + Math.random() * (max - min);
}

for (let i = 0; i < cubeCount; i++) {
  
  const w = rand(0.5, 2.2);
  const h = rand(0.5, 2.2);
  const d = rand(0.5, 2.2);

  const geometry = new THREE.BoxGeometry(w, h, d);

  
  const color = new THREE.Color(Math.random(), Math.random(), Math.random());
  const material = new THREE.MeshStandardMaterial({ color });

  const cube = new THREE.Mesh(geometry, material);

  
  cube.position.set(rand(-8, 8), rand(-2, 6), rand(-8, 8));

  
  cube.userData.size = { width: w, height: h, depth: d };

  scene.add(cube);
  cubes.push(cube);
}


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let selectedCube = null;
let selectedPrevColor = null;
let pulseT = 0;

function setInfoNoSelection() {
  if (infoEl) infoEl.textContent = "No object selected.";
}

function formatVec3(v) {
  return `x: ${v.x.toFixed(2)}\ny: ${v.y.toFixed(2)}\nz: ${v.z.toFixed(2)}`;
}

function formatSize(s) {
  return `width: ${s.width.toFixed(2)}\nheight: ${s.height.toFixed(
    2
  )}\ndepth: ${s.depth.toFixed(2)}`;
}

function updatePanel(cube) {
  if (!infoEl) return;
  const pos = cube.position;
  const size = cube.userData.size;

  infoEl.textContent =
    `Selected Cube\n\n` +
    `Position:\n${formatVec3(pos)}\n\n` +
    `Size:\n${formatSize(size)}`;
}

function clearSelection() {
  if (selectedCube) {
    selectedCube.material.color.copy(selectedPrevColor);
    selectedCube.scale.set(1, 1, 1);
  }
  selectedCube = null;
  selectedPrevColor = null;
  pulseT = 0;
  setInfoNoSelection();
}

function selectCube(cube) {
  if (selectedCube && selectedCube !== cube) {
    selectedCube.material.color.copy(selectedPrevColor);
    selectedCube.scale.set(1, 1, 1);
  }

  selectedCube = cube;
  selectedPrevColor = cube.material.color.clone();

  
  cube.material.color.set(0xffff66);

  
  updatePanel(cube);

  
  pulseT = 0;
}

function setMouseFromEvent(e) {
  const rect = renderer.domElement.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
  mouse.set(x, y);
}

window.addEventListener("click", (e) => {
  if (!renderer?.domElement) return;

  setMouseFromEvent(e);

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(cubes, false);

  if (hits.length > 0) {
    selectCube(hits[0].object);
  } else {
    clearSelection();
  }
});


function animate() {
  requestAnimationFrame(animate);

  controls.update();

  
  if (selectedCube) {
    pulseT += 0.08;
    const s = 1 + Math.sin(pulseT) * 0.06;
    selectedCube.scale.set(s, s, s);
  }

  renderer.render(scene, camera);
}
animate();


window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
