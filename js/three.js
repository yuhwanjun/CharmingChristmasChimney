import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import gsap from 'gsap'

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
const wallMat = new THREE.MeshStandardMaterial({
		map: brickTextures.color,
		aoMap: brickTextures.ao,
		normalMap: brickTextures.normal,
		roughnessMap: brickTextures.roughness
	})
// 벽 생성
const walls01 = new THREE.Mesh(
	new THREE.BoxGeometry(1, 8, 4),
	wallMat
)
walls01.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls01.geometry.attributes.uv.array, 2))
walls01.position.x = 2
walls01.position.y = 4
walls01.position.z = 0
house.add(walls01)

const walls02 = new THREE.Mesh(
	new THREE.BoxGeometry(1, 8, 4),
	wallMat
)
walls02.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls02.geometry.attributes.uv.array, 2))
walls02.position.x = -2
walls02.position.y = 4
walls02.position.z = 0
house.add(walls02)

const walls03 = new THREE.Mesh(
	new THREE.BoxGeometry(3, 8, 1),
	wallMat
)
walls03.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls03.geometry.attributes.uv.array, 2))
walls03.position.x = 0
walls03.position.y = 4
walls03.position.z = -1.5
house.add(walls03)

const walls04 = new THREE.Mesh(
	new THREE.BoxGeometry(3, 5, 1),
	wallMat
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
cardFrontMat.metalness = 0.45
cardFrontMat.roughness = 0.65
const cardTexChange = {
	change: () => {
		cardFrontMat.map = cardFrontTex.new
	}
}
const cardFront = new THREE.Mesh(cardFrontGeo, cardFrontMat)
card.add(cardFront)

const cardBackTex = {
	color : textureLoader.load('/textures/card/cardback.jpg')
}
//카드 뒷면
const cardBackGeo = new THREE.BoxGeometry(3, 0.001, 4)
const cardBackMat = new THREE.MeshStandardMaterial()
cardBackMat.map = cardBackTex.color
const cardBack = new THREE.Mesh(cardBackGeo, cardBackMat)
card.add(cardBack)
cardBack.position.y = -0.001

card.position.y = 12
card.position.z = 1
card.scale.x = 0.4
card.scale.y = 0.4
card.scale.z = 0.4
card.castShadow = true
cardFront.castShadow = true
cardBack.castShadow = true
card.rotation.x = Math.PI * 0.4

//받을 카드 그룹 생성
const reciveCard = new THREE.Group()
scene.add(reciveCard)

//받을 카드 앞면 추가
const rcardFrontTex = {
	new : textureLoader.load('/textures/card/new.jpg')
}
const rcardFrontGeo = new THREE.BoxGeometry(3, 0.001, 4)
const rcardFrontMat = new THREE.MeshStandardMaterial()
rcardFrontMat.map = rcardFrontTex.new
rcardFrontMat.metalness = 0.45
rcardFrontMat.roughness = 0.65

const rcardFront = new THREE.Mesh(rcardFrontGeo, rcardFrontMat)
reciveCard.add(rcardFront)

//받을 카드 뒷면 추가
const rcardBackTex = {
	color : textureLoader.load('/textures/card/cardback.jpg')
}
const rcardBackGeo = new THREE.BoxGeometry(3, 0.001, 4)
const rcardBackMat = new THREE.MeshStandardMaterial()
rcardBackMat.map = rcardBackTex.color
const rcardBack = new THREE.Mesh(rcardBackGeo, rcardBackMat)
reciveCard.add(rcardBack)
rcardBack.position.y = -0.001

// 받을 카드 효과 추가
reciveCard.position.y = 2
reciveCard.position.z = 0.5
reciveCard.scale.x = 0.4
reciveCard.scale.y = 0.4
reciveCard.scale.z = 0.4
reciveCard.castShadow = true
rcardFront.castShadow = true
rcardBack.castShadow = true
reciveCard.rotation.x = Math.PI * 0.5


// var tex = textureLoader.load("/textures/Fire.png");
// var fire = new THREE.Fire( tex );
// scene.add( fire );

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

// target object 
const targetObj = new THREE.Object3D();
scene.add( targetObj );
targetObj.position.y = 2

/* Lights */

// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.22)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.9)
moonLight.position.set(-1, 3, 2)
moonLight.lookAt(card.position)
scene.add(moonLight)

/**
 * Fog
 */
const fog = new THREE.Fog('#1d1d1f', 1, 15)
scene.fog = fog

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
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableZoom = false
// controls.enableDamping = true

/* Renderer */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
	alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setClearAlpha(0)

/* Shadow */
moonLight.castShadow = true
moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 15

//scene
function recivePos(obj) {
	let recpos = [ obj.position.x, obj.position.y, obj.position.z]
	return recpos
}

const cameraStatus = [
	{ x : 4, y : 5, z : 5, lA : targetObj.position, orbit : false, target : [0, 2, 0] },
	{ x : 0, y : 6.2, z : 3, lA : targetObj.position, orbit : true, target : [0, 6, 0] },
	{ x : 0, y : 4.5, z : 1.8	, lA : targetObj.position, orbit : false, target : [0, 4.5, 1] },
]
const cardStatus = [
	{ x : 0, y : 12, z : 1, target : recivePos(house) },
	{ x : 0, y : 6, z : 1, target : recivePos(card) },
	{ x : 0, y : 4, z : 0, target : recivePos(house) },
]

function cameraValue(sceneNum) {
	camera.position.x = cameraStatus[sceneNum].x
	camera.position.y = cameraStatus[sceneNum].y
	camera.position.z = cameraStatus[sceneNum].z
	camera.lookAt(cameraStatus[sceneNum].target)
}
cameraValue(0)

function cameraMove(sceneNum) {
	gsap.to(
		camera.position,{
			duration: 1.5,
			ease: 'power2.inOut',
			x: `${cameraStatus[sceneNum].x}`,
			y: `${cameraStatus[sceneNum].y}`,
			z: `${cameraStatus[sceneNum].z}`
		}
	)
	gsap.to(
		targetObj.position,{
			duration: 1.5,
			ease: 'power2.inOut',
			x: `${cameraStatus[sceneNum].target[0]}`,
			y: `${cameraStatus[sceneNum].target[1]}`,
			z: `${cameraStatus[sceneNum].target[2]}`
		}
	)
	// controls.enabled = cameraStatus[sceneNum].orbit
}

function objMove(sceneNum){
	gsap.to(
		card.position,{
			duration: 1.5,
			ease: 'power2.inOut',
			x: `${cardStatus[sceneNum].x}`,
			y: `${cardStatus[sceneNum].y}`,
			z: `${cardStatus[sceneNum].z}`
		}
	)
}

function sceneMove(sceneNum) {
	cameraMove(sceneNum)
	objMove(sceneNum)
	console.log(camera.position)
	console.log(targetObj.position)
}

function scene4() {
	
}

// scroll
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () =>
{
    scrollY = window.scrollY
    const newSection = Math.round(scrollY / sizes.height)

    if(newSection != currentSection)
    {
        currentSection = newSection
		sceneMove(currentSection)
    }
})

/* Animate */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
	
	camera.lookAt(cameraStatus[currentSection].lA)
	
    // Update controls
    // controls.update()
	if(currentSection === 1)
    {	
		card.rotation.x = Math.PI * 0.45
		card.rotation.z =  0.05 * Math.sin(Math.PI * elapsedTime * 0.1)
		card.rotation.y =  0.05 * Math.cos(Math.PI * elapsedTime * 0.1)
    }else {
		card.rotation.x = Math.PI * 0.5
		card.rotation.z = 0
		card.rotation.y = 0
	}
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

document.getElementById('click').onclick = function() {
	gsap.to(
		card.position,{
			duration: 3,
			ease: 'power1.Out',
			x: '0',
			y: '2.5',
			z: '0'
		},
	)
	gsap.to(
		camera.position,{
			duration: 4,
			ease: 'power1.inOut',
			x: '0',
			y: '2',
			z: '3'
		}
	)
	gsap.to(
		targetObj.position,{
			duration: 6,
			ease: 'power1.Out',
			x: '0',
			y: '0',
			z: '0'
		}
	)
	gsap.to(
		reciveCard.position,{
			delay: 2,
			duration: 5,
			ease: 'power1.in',
			x: '0',
			y: '0.05',
			z: '0.5'
		}
	)
}

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