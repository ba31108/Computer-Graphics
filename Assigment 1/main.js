import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// === 1) Scene, Camera, Renderer ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd6ea);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 400);
camera.position.set(30, 18, 30);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// === 2) Controls ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 2.5, 0);
controls.update();

// === 3) Helper Grid (optional) ===
const grid = new THREE.GridHelper(120, 60);
grid.material.opacity = 0.08;
grid.material.transparent = true;
scene.add(grid);

// === 4) Textures ===
function makeGrassTexture(size = 512){
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#2f8b3a';
    ctx.fillRect(0,0,size,size);
    for(let i=0;i<3000;i++){
        const x = Math.random()*size;
        const y = Math.random()*size;
        ctx.fillStyle = `rgba(47,139,58,${Math.random()*0.5})`;
        ctx.fillRect(x,y,1,1);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8,8);
    return tex;
}

function makePavementTexture(size=512){
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#6d6d6d';
    ctx.fillRect(0,0,size,size);
    for(let i=0;i<200;i++){
        const x=Math.random()*size;
        const y=Math.random()*size;
        const w=1+Math.random()*3;
        ctx.fillStyle='#5b5b5b';
        ctx.fillRect(x,y,w,w);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8,4);
    tex.anisotropy=4;
    return tex;
}

// === 5) Ground ===
const grassMat = new THREE.MeshStandardMaterial({ map: makeGrassTexture(), roughness: 0.95 });
const grass = new THREE.Mesh(new THREE.PlaneGeometry(120,80), grassMat);
grass.rotation.x = -Math.PI/2;
grass.receiveShadow = true;
scene.add(grass);

// Path
const pathMat = new THREE.MeshStandardMaterial({ map: makePavementTexture(), roughness: 0.8 });
const path = new THREE.Mesh(new THREE.PlaneGeometry(28,8), pathMat);
path.rotation.x = -Math.PI/2;
path.position.set(0,0.02,-4);
path.receiveShadow = true;
scene.add(path);

// === 6) Buildings ===
function addWindows(building, rows, cols, w, h, offset){
    const geo = new THREE.PlaneGeometry(w,h);
    for(let r=0;r<rows;r++){
        for(let c=0;c<cols;c++){
            const mat = new THREE.MeshStandardMaterial({
                color:0x111122,
                emissive: new THREE.Color(0x334455).multiplyScalar(Math.random()*0.6),
                roughness:1,
                side:THREE.DoubleSide
            });
            const win = new THREE.Mesh(geo, mat);
            const bx = building.geometry.parameters.width;
            const bz = building.geometry.parameters.depth;
            const by = building.geometry.parameters.height;
            const x = -(cols-1)*(w+0.2)/2 + c*(w+0.2);
            const y = -by/2 + 1.5 + r*(h+0.6);
            win.position.set(building.position.x + x, building.position.y + y, building.position.z + bz/2 + offset);
            scene.add(win);
        }
    }
}

// Building A
const buildingA = new THREE.Mesh(new THREE.BoxGeometry(12,7,8),
    new THREE.MeshStandardMaterial({ color:0xf2efe9, roughness:0.6, metalness:0.05 }));
buildingA.position.set(-12,3.5,-2);
buildingA.castShadow = true;
buildingA.receiveShadow = true;
scene.add(buildingA);
addWindows(buildingA,2,4,1.4,1,0.51);

// Building B
const buildingB = new THREE.Mesh(new THREE.BoxGeometry(8,10,6),
    new THREE.MeshPhongMaterial({ color:0xfff1d6, shininess:50 }));
buildingB.position.set(6,5,2);
buildingB.castShadow=true;
buildingB.receiveShadow=true;
scene.add(buildingB);
addWindows(buildingB,3,2,0.8,0.9,0.51);

// Building C
const buildingC = new THREE.Mesh(new THREE.BoxGeometry(6,4.5,8),
    new THREE.MeshLambertMaterial({ color:0x8fb3ff }));
buildingC.position.set(12,2.25,-10);
buildingC.castShadow=true;
buildingC.receiveShadow=true;
scene.add(buildingC);
addWindows(buildingC,1,3,0.9,0.9,0.51);

// === 7) Trees ===
function makeTree(x,z,scale=1){
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25*scale,0.25*scale,2*scale,8),
        new THREE.MeshStandardMaterial({ color:0x6b4a2b }));
    trunk.position.set(x,1*scale,z);
    trunk.castShadow=true;
    trunk.receiveShadow=true;
    scene.add(trunk);

    const foliage = new THREE.Mesh(new THREE.SphereGeometry(1.2*scale,16,12),
        new THREE.MeshStandardMaterial({ color:0x1f7a2b, roughness:0.9 }));
    foliage.position.set(x,2.2*scale,z);
    foliage.castShadow=true;
    scene.add(foliage);
}

makeTree(-6,-6,1.0);
makeTree(-2,-9,0.9);
makeTree(6,-6,1.1);
makeTree(10,-3,0.9);

// === 8) Lights ===
const ambient = new THREE.AmbientLight(0xffffff,0.45);
scene.add(ambient);

const dir = new THREE.DirectionalLight(0xffffff,0.9);
dir.position.set(30,40,20);
dir.castShadow=true;
dir.shadow.mapSize.width=2048;
dir.shadow.mapSize.height=2048;
scene.add(dir);

const lamp = new THREE.PointLight(0xfff1c7,0.7,30);
lamp.position.set(0,5.2,-6);
lamp.castShadow=true;
scene.add(lamp);

const lampBulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.12,8,8),
    new THREE.MeshStandardMaterial({ emissive:0xfff1c7, emissiveIntensity:0.9, color:0x333333 })
);
lampBulb.position.copy(lamp.position);
scene.add(lampBulb);

// === 9) Animate ===
const clock = new THREE.Clock();

function animate(){
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    lamp.intensity = 0.6 + Math.sin(t*1.5)*0.05;
    renderer.render(scene,camera);
}
animate();

// === 10) Resize ===
window.addEventListener('resize',()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
