import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/* Base */

// Debug
// const gui = new dat.GUI()
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/* Textures */
const textureLoader = new THREE.TextureLoader()

// 문 텍스쳐 로드
const doorTextures = {
	color : textureLoader.load('/textures/door/color.jpg'),
	alpha : textureLoader.load('/textures/door/alpha.jpg'),
	ao : textureLoader.load('/textures/door/ambientOcclusion.jpg'),
	height : textureLoader.load('/textures/door/height.jpg'),
	normal : textureLoader.load('/textures/door/normal.jpg'),
	metalness : textureLoader.load('/textures/door/metalness.jpg'),
	roughness : textureLoader.load('/textures/door/roughness.jpg')
}

const brickTextures = {
	color : textureLoader.load('/textures/bricks/color.jpg'),
	ao : textureLoader.load('/textures/bricks/ambientOcclusion.jpg'),
	normal : textureLoader.load('/textures/bricks/normal.jpg'),
	roughness : textureLoader.load('/textures/bricks/roughness.jpg')
}

const grassTextures = {
	color : textureLoader.load('/textures/grass/color.jpg'),
	ao : textureLoader.load('/textures/grass/ambientOcclusion.jpg'),
	normal : textureLoader.load('/textures/grass/normal.jpg'),
	roughness : textureLoader.load('/textures/grass/roughness.jpg')
}

/* Object */
// 집 그룹 생성
const house = new THREE.Group()
scene.add(house)

// 벽 생성
const walls01 = new THREE.Mesh(
	new THREE.BoxGeometry(1, 8, 4),
	new THREE.MeshStandardMaterial({
		map: brickTextures.color,
		aoMap: brickTextures.ao,
		normalMap: brickTextures.normal,
		roughnessMap: brickTextures.roughness
	})
)
walls01.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls01.geometry.attributes.uv.array, 2))
walls01.position.x = 2
walls01.position.y = 4
walls01.position.z = 0
house.add(walls01)

const walls02 = new THREE.Mesh(
	new THREE.BoxGeometry(1, 8, 4),
	new THREE.MeshStandardMaterial({
		map: brickTextures.color,
		aoMap: brickTextures.ao,
		normalMap: brickTextures.normal,
		roughnessMap: brickTextures.roughness
	})
)
walls02.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls02.geometry.attributes.uv.array, 2))
walls02.position.x = -2
walls02.position.y = 4
walls02.position.z = 0
house.add(walls02)

const walls03 = new THREE.Mesh(
	new THREE.BoxGeometry(3, 8, 1),
	new THREE.MeshStandardMaterial({
		map: brickTextures.color,
		aoMap: brickTextures.ao,
		normalMap: brickTextures.normal,
		roughnessMap: brickTextures.roughness
	})
)
walls03.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls03.geometry.attributes.uv.array, 2))
walls03.position.x = 0
walls03.position.y = 4
walls03.position.z = -1.5
house.add(walls03)

const walls04 = new THREE.Mesh(
	new THREE.BoxGeometry(3, 5, 1),
	new THREE.MeshStandardMaterial({
		map: brickTextures.color,
		aoMap: brickTextures.ao,
		normalMap: brickTextures.normal,
		roughnessMap: brickTextures.roughness
	})
)
walls04.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls04.geometry.attributes.uv.array, 2))
walls04.position.x = 0
walls04.position.y = 5.5
walls04.position.z = 1.5
house.add(walls04)

house.scale.x = 0.5
house.scale.y = 0.5
house.scale.z = 0.5

//카드 생성
const card = new THREE.Group()
scene.add(card)

const cardFrontTex = {
	new : textureLoader.load('/textures/card/new.jpg')
}
const cardFrontGeo = new THREE.BoxGeometry(3, 0.001, 4)
const cardFrontMat = new THREE.MeshStandardMaterial()
cardFrontMat.map = cardFrontTex.new
const cardTexChange = {
	change: () => {
		cardFrontMat.map = cardFrontTex.new
	}
}
//카드 앞면
const cardFront = new THREE.Mesh(cardFrontGeo, cardFrontMat)
card.add(cardFront)

//카드 뒷면
const cardBackGeo = new THREE.BoxGeometry(3, 0.001, 4)
const cardBackMat = new THREE.MeshStandardMaterial({ color: 0xffffff})
const cardBack = new THREE.Mesh(cardBackGeo, cardBackMat)
card.add(cardBack)
cardBack.position.y = -0.001


card.position.y = 6
card.position.z = 1
card.scale.x = 0.4
card.scale.y = 0.4
card.scale.z = 0.4
card.castShadow = true
cardFront.castShadow = true
cardBack.castShadow = true
card.rotation.x = Math.PI * 0.4


// 문 생성
/*
const door = new THREE.Mesh(
	new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
	new THREE.MeshStandardMaterial({
		map: doorTextures.color,
		transparent: true,
		alphaMap: doorTextures.alpha,
		aoMap: doorTextures.ao,
		displacementMap: doorTextures.height,
		displacementScale: 0.1,
		normalMap: doorTextures.normal,
		metalnessMap: doorTextures.metalness,
		roughnessMap: doorTextures.roughness
	})
)
door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
door.position.y = 1
door.position.z = 2 + 0.01
house.add(door)
*/

// 바닥
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(20, 20),
	new THREE.MeshStandardMaterial({
		map: grassTextures.color,
		aoMap: grassTextures.ao,
		normalMap: grassTextures.normal,
		roughnessMap: grassTextures.roughness
	})
)

grassTextures.color.repeat.set(8, 8)
grassTextures.ao.repeat.set(8, 8)
grassTextures.normal.repeat.set(8, 8)
grassTextures.roughness.repeat.set(8, 8)

grassTextures.color.wrapS = THREE.RepeatWrapping
grassTextures.ao.wrapS = THREE.RepeatWrapping
grassTextures.normal.wrapS = THREE.RepeatWrapping
grassTextures.roughness.wrapS = THREE.RepeatWrapping

grassTextures.color.wrapT = THREE.RepeatWrapping
grassTextures.ao.wrapT = THREE.RepeatWrapping
grassTextures.normal.wrapT = THREE.RepeatWrapping
grassTextures.roughness.wrapT = THREE.RepeatWrapping

floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)

doorLight.castShadow = true
doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

walls01.castShadow = true
walls02.castShadow = true
walls03.castShadow = true
walls04.castShadow = true
floor.receiveShadow = true


/* Lights */

// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
// gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.8)
moonLight.position.set(-4, 5, 2)
moonLight.lookAt(card.position)
// gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
// gui.add(moonLight.position, 'x').min(- 5).max(10).step(0.001)
// gui.add(moonLight.position, 'y').min(- 5).max(10).step(0.001)
// gui.add(moonLight.position, 'z').min(- 5).max(10).step(0.001)
scene.add(moonLight)

const axesHelper = new THREE.AxesHelper(2)
//매개 변수는 축 도우미 선의 길이
scene.add(axesHelper)
//녹 y, 빡 x, 청 z
/**
 * Fog
 */
// const fog = new THREE.Fog('#262837', 1, 15)
// scene.fog = fog

/* Sizes */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/* Camera */

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 4
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.target = card.position

/* Renderer */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/* Shadow */
moonLight.castShadow = true
moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 15


/* Animate */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

//카드 이미지 적용
const inputImage = document.querySelector('#image');
const _URL = window.URL || window.webkitURL;

const limitWH = {width: 2000, height: 1500}

inputImage.addEventListener('change', inputImageUpload)

function inputImageUpload() {
	const upImage = inputImage.files[0]
	let file, img;
	console.log(upImage)
	if((file = upImage)) {
		img = new Image();
		img.onload = function() {
			if(this.width < limitWH.width && this.height < limitWH.height) {
				console.log(this.width + " " + this.height);
				cardFrontTex.new = textureLoader.load(`${img.src}`)
				cardTexChange.change()
			} else {
				inputImage.type = 'radio';
				inputImage.type = 'file';
				alert("사이즈가 맞지 않습니다!")	
			}
		};
		img.onerror = function() {
			console.log( "not a valid file: " + file.type);
		};
		img.src = _URL.createObjectURL(file);
		console.log(img.src)
	}
}