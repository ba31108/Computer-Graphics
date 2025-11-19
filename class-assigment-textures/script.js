import * as THREE from 'https://unpkg.com/three@0.164.1/build/three.module.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202030);


const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 4);


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);


const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('./textures/Onyx001_1K-JPG_Color.jpg'); // <- VENDOSI EMRIN E SAKTË


const sphereGeometry = new THREE.SphereGeometry(1.2, 64, 64);
const sphereMaterial = new THREE.MeshStandardMaterial({
  map: texture,
  metalness: 0.2,
  roughness: 0.5,
});

const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;
scene.add(sphere);


function animate() {
  requestAnimationFrame(animate);

  sphere.rotation.y += 0.01;

  renderer.render(scene, camera);
}
animate();


window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
