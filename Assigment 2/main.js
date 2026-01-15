import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x8cc6ff)
scene.fog = new THREE.Fog(0x8cc6ff, 120, 260)


const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(25, 15, 45)
scene.add(camera)


const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.outputColorSpace = THREE.SRGBColorSpace
document.getElementById('app').appendChild(renderer.domElement)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.55)
scene.add(ambientLight)

const sunLight = new THREE.DirectionalLight(0xffffff, 1.15)
sunLight.position.set(40, 45, 25)
sunLight.castShadow = true
sunLight.shadow.mapSize.set(1024, 1024)
sunLight.shadow.camera.near = 1
sunLight.shadow.camera.far = 220
sunLight.shadow.camera.left = -90
sunLight.shadow.camera.right = 90
sunLight.shadow.camera.top = 90
sunLight.shadow.camera.bottom = -90
sunLight.shadow.bias = -0.0002
sunLight.shadow.normalBias = 0.02
scene.add(sunLight)

const textureLoader = new THREE.TextureLoader()

function setupRepeat(tex, rx, ry) {
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(rx, ry)
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy()
  return tex
}

const grassTex = setupRepeat(textureLoader.load('/textures/grass.jpg'), 20, 20)
const roadTex = setupRepeat(textureLoader.load('/textures/road.jpg'), 4, 1)
const brickTex = setupRepeat(textureLoader.load('/textures/brick.jpg'), 3, 1)
const concreteTex = setupRepeat(textureLoader.load('/textures/concrete.jpg'), 2, 1)

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(220, 220),
  new THREE.MeshStandardMaterial({ map: grassTex, roughness: 1, metalness: 0 })
)
ground.rotation.x = -Math.PI / 2
ground.receiveShadow = true
scene.add(ground)

const road = new THREE.Mesh(
  new THREE.PlaneGeometry(120, 50),
  new THREE.MeshStandardMaterial({ map: roadTex, roughness: 0.95, metalness: 0 })
)
road.rotation.x = -Math.PI / 2
road.position.set(0, 0.03, 10)
road.receiveShadow = true
scene.add(road)

const sidewalkGeo = new THREE.PlaneGeometry(120, 8)
const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0xcfcfcf, roughness: 1, metalness: 0 })
const sidewalkOffset = 28

const sidewalkL = new THREE.Mesh(sidewalkGeo, sidewalkMat)
sidewalkL.rotation.x = -Math.PI / 2
sidewalkL.position.set(0, 0.031, 10 - sidewalkOffset)
sidewalkL.receiveShadow = true
scene.add(sidewalkL)

const sidewalkR = new THREE.Mesh(sidewalkGeo, sidewalkMat)
sidewalkR.rotation.x = -Math.PI / 2
sidewalkR.position.set(0, 0.031, 10 + sidewalkOffset)
sidewalkR.receiveShadow = true
scene.add(sidewalkR)

const roundGroup = new THREE.Group()
roundGroup.position.set(0, 0.04, 0)
scene.add(roundGroup)

function makeExtrudedRing(innerR, outerR, height = 0.18) {
  const shape = new THREE.Shape()
  shape.absarc(0, 0, outerR, 0, Math.PI * 2, false)

  const hole = new THREE.Path()
  hole.absarc(0, 0, innerR, 0, Math.PI * 2, true)
  shape.holes.push(hole)

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: false,
    curveSegments: 128,
  })
  geo.rotateX(-Math.PI / 2)
  geo.translate(0, height * 0.5, 0)
  return geo
}

const ringAsphalt = new THREE.Mesh(
  makeExtrudedRing(6, 11, 0.16),
  new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 1, metalness: 0 })
)
ringAsphalt.castShadow = true
ringAsphalt.receiveShadow = true
roundGroup.add(ringAsphalt)

const curbRing = new THREE.Mesh(
  makeExtrudedRing(5.9, 6.2, 0.22),
  new THREE.MeshStandardMaterial({ color: 0xe7e7e7, roughness: 0.9, metalness: 0 })
)
curbRing.castShadow = true
curbRing.receiveShadow = true
roundGroup.add(curbRing)

const island = new THREE.Mesh(
  new THREE.CylinderGeometry(5.6, 5.6, 0.22, 96),
  new THREE.MeshStandardMaterial({ map: grassTex, roughness: 1, metalness: 0 })
)
island.position.y = 0.12
island.castShadow = true
island.receiveShadow = true
roundGroup.add(island)

function createBush(x, z, s = 1) {
  const bush = new THREE.Mesh(
    new THREE.SphereGeometry(1.2 * s, 16, 16),
    new THREE.MeshLambertMaterial({ color: 0x0f4a28 })
  )
  bush.position.set(x, 0.26, z)
  bush.castShadow = true
  bush.receiveShadow = true
  return bush
}

const bushGroup = new THREE.Group()
bushGroup.add(createBush(0, 0, 1))
bushGroup.add(createBush(1.2, 0.3, 0.8))
bushGroup.add(createBush(-1.2, 0.3, 0.8))
bushGroup.add(createBush(0.7, -0.8, 0.7))
bushGroup.add(createBush(-0.7, -0.8, 0.7))
roundGroup.add(bushGroup)

const leftBuilding = new THREE.Mesh(
  new THREE.BoxGeometry(26, 10, 12),
  new THREE.MeshStandardMaterial({ map: brickTex, roughness: 0.95 })
)
leftBuilding.name = 'leftBuilding'
leftBuilding.position.set(-25, 5, -18)
leftBuilding.castShadow = true
leftBuilding.receiveShadow = true
scene.add(leftBuilding)

const rightBuilding = new THREE.Mesh(
  new THREE.BoxGeometry(30, 9, 16),
  new THREE.MeshStandardMaterial({ map: concreteTex, roughness: 0.9 })
)
rightBuilding.name = 'rightBuilding'
rightBuilding.position.set(28, 4.5, -14)
rightBuilding.castShadow = true
rightBuilding.receiveShadow = true
scene.add(rightBuilding)

function addHorizontalWindowsOnBox(box, rows = 2, cols = 5) {
  const { width, depth } = box.geometry.parameters
  const frontZ = box.position.z + depth / 2 + 0.06

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const w = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 1, 0.1),
        new THREE.MeshPhysicalMaterial({
          color: 0x9ed1ff,
          transparent: true,
          opacity: 0.55,
          roughness: 0.12,
          metalness: 0,
          transmission: 0.75,
          thickness: 0.2,
        })
      )
      const startX = box.position.x - width / 2 + 3
      w.position.set(startX + j * 3.7, box.position.y - 1 + i * 2.4, frontZ)
      w.castShadow = true
      w.receiveShadow = true
      scene.add(w)
    }
  }
}
addHorizontalWindowsOnBox(leftBuilding, 2, 5)

const entranceTop = new THREE.Mesh(
  new THREE.BoxGeometry(28, 2, 6),
  new THREE.MeshStandardMaterial({ color: 0xf5f1e7 })
)
entranceTop.position.set(0, 8, -14)
entranceTop.castShadow = true
entranceTop.receiveShadow = true
scene.add(entranceTop)

const glass = new THREE.Mesh(
  new THREE.BoxGeometry(27, 3, 0.2),
  new THREE.MeshPhysicalMaterial({
    color: 0x3a5f57,
    transparent: true,
    opacity: 0.65,
    roughness: 0.1,
    transmission: 0.7,
    thickness: 0.25,
  })
)
glass.position.set(0, 6.5, -11.9)
glass.castShadow = true
glass.receiveShadow = true
scene.add(glass)


const colGeo = new THREE.BoxGeometry(0.6, 3.5, 0.6)
const colMat = new THREE.MeshStandardMaterial({ color: 0xe8e8e8 })
for (let i = -10; i <= 10; i += 4) {
  const col = new THREE.Mesh(colGeo, colMat)
  col.position.set(i, 2.1, -11.8)
  col.castShadow = true
  col.receiveShadow = true
  scene.add(col)
}


const doors = new THREE.Mesh(
  new THREE.BoxGeometry(27, 2.5, 0.2),
  new THREE.MeshPhysicalMaterial({
    color: 0xdfe8ea,
    transparent: true,
    opacity: 0.75,
    roughness: 0.05,
    transmission: 0.6,
    thickness: 0.2,
  })
)
doors.position.set(0, 1.2, -11.9)
doors.castShadow = true
doors.receiveShadow = true
scene.add(doors)


function createLowPolyTree() {
  const tree = new THREE.Group()

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.35, 2.2, 10),
    new THREE.MeshStandardMaterial({ color: 0x6b4f2a, roughness: 1 })
  )
  trunk.position.y = 1.1
  trunk.castShadow = true
  trunk.receiveShadow = true

  const crown = new THREE.Mesh(
    new THREE.ConeGeometry(1.2, 2.6, 12),
    new THREE.MeshStandardMaterial({ color: 0x2f6b3a, roughness: 1 })
  )
  crown.position.y = 2.9
  crown.castShadow = true
  crown.receiveShadow = true

  tree.add(trunk, crown)
  tree.name = 'sideTree'
  return tree
}

const sideTreesGroup = new THREE.Group()
sideTreesGroup.name = 'twoSideTrees'

const treeLeft = createLowPolyTree()
treeLeft.position.set(-12, 0.05, -8)
treeLeft.scale.setScalar(1.6)
treeLeft.rotation.y = Math.PI * 0.15
sideTreesGroup.add(treeLeft)

const treeRight = createLowPolyTree()
treeRight.position.set(12, 0.05, -8)
treeRight.scale.setScalar(1.6)
treeRight.rotation.y = -Math.PI * 0.15
sideTreesGroup.add(treeRight)

scene.add(sideTreesGroup)


const gltfLoader = new GLTFLoader()
gltfLoader.load(
  '/models/Trees.glb',
  (gltf) => {
    const model = gltf.scene
    model.name = 'treesGLB'
    model.position.set(0, 0.22, 0)
    model.scale.set(2.5, 2.5, 2.5)

    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    roundGroup.add(model)
    console.log('✅ Trees.glb loaded!', model)
  },
  undefined,
  (err) => console.error('❌ GLTF load error:', err)
)


const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 4, -14)
controls.enableDamping = true
controls.maxPolarAngle = Math.PI / 2.1


const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
const interactables = [leftBuilding, rightBuilding]
let hovered = null

const originalMaterials = new Map()
originalMaterials.set(leftBuilding, leftBuilding.material)
originalMaterials.set(rightBuilding, rightBuilding.material)

function orangeMaterial() {
  return new THREE.MeshStandardMaterial({ color: 0xffa24a, roughness: 0.9, metalness: 0.05 })
}

function setMouseFromEvent(e) {
  const rect = renderer.domElement.getBoundingClientRect()
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
}

window.addEventListener('mousemove', (e) => {
  setMouseFromEvent(e)
  raycaster.setFromCamera(mouse, camera)

  const hits = raycaster.intersectObjects(interactables, false)
  if (hits.length) {
    const obj = hits[0].object
    if (hovered !== obj) {
      if (hovered && hovered.material.emissive) hovered.material.emissive.set(0x000000)
      hovered = obj
      if (!hovered.material.emissive) hovered.material.emissive = new THREE.Color(0x000000)
      hovered.material.emissive.set(0x222222)
    }
  } else {
    if (hovered && hovered.material.emissive) hovered.material.emissive.set(0x000000)
    hovered = null
  }
})

const toggled = new Set()
window.addEventListener('click', (e) => {
  setMouseFromEvent(e)
  raycaster.setFromCamera(mouse, camera)

  const hits = raycaster.intersectObjects(interactables, false)
  if (!hits.length) return

  const obj = hits[0].object
  if (!toggled.has(obj)) {
    obj.material = orangeMaterial()
    toggled.add(obj)
  } else {
    obj.material = originalMaterials.get(obj)
    toggled.delete(obj)
  }
})


let night = false
let animateSun = true

window.addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase()

  if (k === 'l') {
    night = !night
    if (night) {
      ambientLight.intensity = 0.2
      sunLight.intensity = 0.35
      scene.background.set(0x0b1a2a)
      scene.fog.color.set(0x0b1a2a)
    } else {
      ambientLight.intensity = 0.55
      sunLight.intensity = 1.15
      scene.background.set(0x8cc6ff)
      scene.fog.color.set(0x8cc6ff)
    }
  }

  if (k === 'a') animateSun = !animateSun

  if (k === 'r') {
    leftBuilding.material = originalMaterials.get(leftBuilding)
    rightBuilding.material = originalMaterials.get(rightBuilding)
    toggled.clear()
  }
})


const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)

  const t = clock.getElapsedTime()

  
  roundGroup.rotation.y = t * 0.15

  
  if (animateSun) {
    sunLight.position.x = Math.sin(t * 0.25) * 55
    sunLight.position.z = Math.cos(t * 0.25) * 55
  }

  controls.update()
  renderer.render(scene, camera)
}
animate()


window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
