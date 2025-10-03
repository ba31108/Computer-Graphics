import * as THREE from 'three';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

// Camera
const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / window.innerHeight,
0.1,
1000
);
camera.position.set(0, 5, 15); // Pull back so all shapes are visible

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Cube (looks like a cube)
const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
cubeMesh.position.set(-4, 1, 0); // slightly above ground
scene.add(cubeMesh);

// Capsule (looks like a capsule)
const capsuleGeometry = new THREE.CapsuleGeometry(1, 2, 4, 8);
const capsuleMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const capsule = new THREE.Mesh(capsuleGeometry, capsuleMaterial);
capsule.position.set(0, 1, 0);
scene.add(capsule);

// Circle (looks like a flat circle)
const circleGeometry = new THREE.CircleGeometry(2, 32);
const circleMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00, side: THREE.DoubleSide });
const circle = new THREE.Mesh(circleGeometry, circleMaterial);
circle.position.set(4, 0, 0); // on the ground
circle.rotation.x = -Math.PI / 2; // make it horizontal so it looks like a circle
scene.add(circle);

// Axes helper
const axes = new THREE.AxesHelper(7);
scene.add(axes);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);

// Animation loop
function animate() {
requestAnimationFrame(animate);
renderer.render(scene, camera);
}

animate();