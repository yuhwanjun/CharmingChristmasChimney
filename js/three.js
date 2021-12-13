import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import gsap from 'gsap'
//다른 js 임포트
import Card from './src/Card.js'

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

//loader
const textureLoader = new THREE.TextureLoader()
const gltfLoader = new GLTFLoader()


gltfLoader.load(
	'/models/ccc.gltf',
	function (gltf) {
		const redMatcapTexture = textureLoader.load('/textures/matcaps/redbricks.png')
		const redMatCapMat = new THREE.MeshMatcapMaterial()
		redMatCapMat.matcap = redMatcapTexture

		const whiteMatcapTexture = textureLoader.load('/textures/matcaps/whitebricks.png')
		const whiteMatCapMat = new THREE.MeshMatcapMaterial()
		whiteMatCapMat.matcap = whiteMatcapTexture
				gltf.scene.scale.set(0.2, 0.2, 0.2)
		const matChildren = gltf.scene.children[0].children
		//red
		for(let i = 0; i < matChildren[1].children.length; i++){
			matChildren[1].children[i].material = redMatCapMat
		}
		//white
		for(let i = 0; i < matChildren[0].children.length; i++){
			matChildren[0].children[i].material = whiteMatCapMat
		}
		scene.add(gltf.scene)
	}
)

/* 
 # card
*/

let MyCard = new Card('myCard', '/textures/card/new.jpg')
MyCard.addScene(scene)
MyCard.changePosition(0, 6, 1)
MyCard.changeScale(MyCard.size[0], MyCard.size[1])
MyCard.changeRotate(0.4,0,0)

let ReciveCard = new Card('reciveCard', '/textures/card/new.jpg')
ReciveCard.addScene(scene)
ReciveCard.changePosition(0, 1, 1)
ReciveCard.changeScale(ReciveCard.size[0], ReciveCard.size[1])
ReciveCard.changeRotate(0.4,0,0)
ReciveCard.changeTex('/textures/card/cardback.jpg')

//카드 이미지 적용
const inputImage = document.querySelector('#image');
inputImage.addEventListener('change', inputImageUpload)

function inputImageUpload() {
	const _URL = window.URL || window.webkitURL;

	const limitWH = {width: 2000, height: 2000}
	const upImage = inputImage.files[0]
	let file, img;
	console.log(upImage)
	if((file = upImage)) {
		img = new Image();
		img.onload = function() {
			if(this.width < limitWH.width && this.height < limitWH.height) {
				console.log(this.width + " " + this.height);
				MyCard.changeTex(`${img.src}`)
				MyCard.changeScale(this.width, this.height)
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

// target object 
const targetObj = new THREE.Object3D();
scene.add( targetObj );
targetObj.position.y = 2

/* Lights */

// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.22)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.8)
moonLight.position.set(-1, 3, 2)
moonLight.lookAt(MyCard.cardGroup.position)
scene.add(moonLight)
moonLight.castShadow = true
moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 15

/**
 * Fog
 */
// const fog = new THREE.Fog('#0000000', 1, 15)
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
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
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
	{ x : 0, y : 12, z : 1, target : [0,0,0] },
	{ x : 0, y : 6, z : 1, target : recivePos(MyCard) },
	{ x : 0, y : 4, z : 0, target : [0,0,0] },
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
		MyCard.position,{
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
	// nodeFrame.update();
	camera.lookAt(cameraStatus[currentSection].lA)
	
    // Update controls
    // controls.update()
	if(currentSection === 1)
	{	
		MyCard.cardGroup.rotation.x = Math.PI * 0.45
		MyCard.cardGroup.rotation.z =  0.05 * Math.sin(Math.PI * elapsedTime * 0.1)
		MyCard.cardGroup.rotation.y =  0.05 * Math.cos(Math.PI * elapsedTime * 0.1)
	}else {
		MyCard.cardGroup.rotation.x = Math.PI * 0.5
		MyCard.cardGroup.rotation.z = 0
		MyCard.cardGroup.rotation.y = 0
	}
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

document.getElementById('click').onclick = function() {
	gsap.to(
		MyCard.cardGroup.position,{
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
		ReciveCard.cardGroup.position,{
			delay: 2,
			duration: 5,
			ease: 'power1.in',
			x: '0',
			y: '0.05',
			z: '0.5'
		}
	)
}

