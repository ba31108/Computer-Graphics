import * as THREE from 'three';
import { ThreeMFLoader } from 'three/examples/jsm/Addons.js';

const scene  = new THREE.Scene();

scene.background = new THREE.Color(0x202020);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1,1000);


camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer . setSize(window.innerWidth,innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({color:0xFF0000});
const cubeMesh = new THREE.Mesh(geometry,material);
scene.add(cubeMesh);

const light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(2,2,5);
scene.add(light);

function animate()
{
    requestAnimationFrame(animate);
    cubeMesh.rotation.x += 0.01;
    cubeMesh.rotation.y += 0.01;
    renderer.render(scene,camera);
}

animate();