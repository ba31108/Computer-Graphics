import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// ================== SCENE ==================
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x8cc6ff) // qiell i kaltër

// ================== CAMERA ==================
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(25, 15, 45) // pak më larg që të shihet e gjitha
scene.add(camera)

// ================== RENDERER ==================
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.getElementById('app').appendChild(renderer.domElement)

// ================== LIGHTS ==================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const sunLight = new THREE.DirectionalLight(0xffffff, 1.2)
sunLight.position.set(40, 40, 20)
sunLight.castShadow = true
scene.add(sunLight)

// ================== GROUND ==================
const grassGeo = new THREE.PlaneGeometry(200, 200)
const grassMat = new THREE.MeshLambertMaterial({ color: 0x5f9341 })
const grass = new THREE.Mesh(grassGeo, grassMat)
grass.rotation.x = -Math.PI / 2
grass.receiveShadow = true
scene.add(grass)

// ================== ROAD + ROUNDABOUT ==================
// asfalt
const roadGeo = new THREE.PlaneGeometry(110, 45)
const roadMat = new THREE.MeshStandardMaterial({ color: 0x5a5a5a })
const road = new THREE.Mesh(roadGeo, roadMat)
road.rotation.x = -Math.PI / 2
road.position.set(0, 0.02, 10)
road.receiveShadow = true
scene.add(road)

// rrethrrotullimi
const ringGeo = new THREE.RingGeometry(6, 11, 60)
const ringMat = new THREE.MeshStandardMaterial({ color: 0x6c6c6c, side: THREE.DoubleSide })
const roundabout = new THREE.Mesh(ringGeo, ringMat)
roundabout.rotation.x = -Math.PI / 2
roundabout.position.set(0, 0.03, 0)
roundabout.receiveShadow = true
scene.add(roundabout)

// shtrati me gurë të bardhë
const stonesGeo = new THREE.RingGeometry(5.7, 6, 50)
const stonesMat = new THREE.MeshStandardMaterial({ color: 0xe8e8e8, side: THREE.DoubleSide })
const stones = new THREE.Mesh(stonesGeo, stonesMat)
stones.rotation.x = -Math.PI / 2
stones.position.set(0, 0.031, 0)
scene.add(stones)

// shkurret në mes (si në foto)
function createBush(x, z, s = 1) {
  const bushGeo = new THREE.SphereGeometry(1.6 * s, 16, 16)
  const bushMat = new THREE.MeshLambertMaterial({ color: 0x0f4a28 })
  const bush = new THREE.Mesh(bushGeo, bushMat)
  bush.position.set(x, 1 * s, z)
  bush.castShadow = true
  return bush
}
const bushGroup = new THREE.Group()
bushGroup.add(createBush(0, 0, 1))
bushGroup.add(createBush(2, 0.2, 0.8))
bushGroup.add(createBush(-2, 0.2, 0.8))
bushGroup.add(createBush(1, -1, 0.7))
bushGroup.add(createBush(-1, -1, 0.7))
bushGroup.position.set(0, 0.04, 0)
scene.add(bushGroup)

// ================== BUILDINGS ==================
// 1) Ndërtesa e MAJTË (e bardhë, me dritare horizontale)
const leftBuildGeo = new THREE.BoxGeometry(26, 10, 12)
const leftBuildMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f2 })
const leftBuilding = new THREE.Mesh(leftBuildGeo, leftBuildMat)
leftBuilding.position.set(-25, 5, -18)
leftBuilding.castShadow = true
leftBuilding.receiveShadow = true
scene.add(leftBuilding)

// dritaret e ndërtesës së majtë (2 kate)
function addHorizontalWindowsOnBox(box, rows = 2, cols = 6, color = 0x9ed1ff) {
  const { width, height, depth } = box.geometry.parameters
  const frontZ = box.position.z + depth / 2 + 0.05
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const wGeo = new THREE.BoxGeometry(2.5, 1, 0.1)
      const wMat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.9,
      })
      const w = new THREE.Mesh(wGeo, wMat)
      const startX = box.position.x - width / 2 + 3
      w.position.set(startX + j * 3.7, box.position.y - 1 + i * 2.4, frontZ)
      scene.add(w)
    }
  }
}
addHorizontalWindowsOnBox(leftBuilding, 2, 5)

// 2) HYRJA (pjesa qendrore me xhama jeshil)
const entranceDepth = 6
const entranceWidth = 28
const entranceHeight = 8

// pjesa e sipërme e hyrjes (korniza)
const entranceTopGeo = new THREE.BoxGeometry(entranceWidth, 2, entranceDepth)
const entranceTopMat = new THREE.MeshStandardMaterial({ color: 0xf5f1e7 })
const entranceTop = new THREE.Mesh(entranceTopGeo, entranceTopMat)
entranceTop.position.set(0, 8, -14)
entranceTop.castShadow = true
scene.add(entranceTop)

// fasada e xhamit (jeshil)
const glassGeo = new THREE.BoxGeometry(entranceWidth - 1, 3, 0.2)
const glassMat = new THREE.MeshPhongMaterial({
  color: 0x3a5f57, // jeshil i errët si në foto
  transparent: true,
  opacity: 0.8,
  shininess: 120,
})
const glass = new THREE.Mesh(glassGeo, glassMat)
glass.position.set(0, 6.5, -11.9)
scene.add(glass)

// kolonat poshtë hyrjes
const colGeo = new THREE.BoxGeometry(0.6, 3.5, 0.6)
const colMat = new THREE.MeshStandardMaterial({ color: 0xe8e8e8 })
const columns = []
for (let i = -10; i <= 10; i += 4) {
  const col = new THREE.Mesh(colGeo, colMat)
  col.position.set(i, 2.1, -11.8)
  col.castShadow = true
  scene.add(col)
  columns.push(col)
}

// dera / hyrja e xhamit poshtë
const doorGeo = new THREE.BoxGeometry(entranceWidth - 1, 2.5, 0.2)
const doorMat = new THREE.MeshPhongMaterial({
  color: 0xdfe8ea,
  transparent: true,
  opacity: 0.95,
})
const doors = new THREE.Mesh(doorGeo, doorMat)
doors.position.set(0, 1.2, -11.9)
scene.add(doors)

// 3) Ndërtesa e DJATHTË (blu, si hangar)
const rightBuildGeo = new THREE.BoxGeometry(30, 9, 16)
const rightBuildMat = new THREE.MeshStandardMaterial({ color: 0x276da9 })
const rightBuilding = new THREE.Mesh(rightBuildGeo, rightBuildMat)
rightBuilding.position.set(28, 4.5, -14)
rightBuilding.castShadow = true
rightBuilding.receiveShadow = true
scene.add(rightBuilding)

// pemët konike në të majtë dhe në të djathtë (si në foto)
function createConicTree(x, z, h = 5, r = 2, color = 0x1a4a26) {
  const geo = new THREE.ConeGeometry(r, h, 12)
  const mat = new THREE.MeshLambertMaterial({ color })
  const tree = new THREE.Mesh(geo, mat)
  tree.position.set(x, h / 2, z)
  tree.castShadow = true
  scene.add(tree)
}

// majtas (te parkingu në foto)
createConicTree(-40, -5, 5, 2.2, 0x1a4a26)
createConicTree(-35, -8, 4.2, 2, 0x2a6a36)
createConicTree(-30, -3, 4.5, 2, 0x1a4a26)

// djathtas
createConicTree(45, -4, 5, 2.2, 0x1a4a26)
createConicTree(40, -8, 4.3, 2, 0x1a4a26)
createConicTree(50, -6, 4.5, 2, 0x1a4a26)

// ================== CONTROLS ==================
const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 4, -14)
controls.enableDamping = true
controls.maxPolarAngle = Math.PI / 2.1

// ================== RESIZE ==================
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// ================== ANIMATE ==================
function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}
animate()

