import * as THREE from 'three'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import gsap from 'gsap'
//다른 js 임포트
import Card from './src/Card.js'
import {setAnima} from './src/MoveSet.js'

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
// const gui = new dat.GUI()
/* 
 # card
*/
let MyCard = new Card('myCard', '/textures/card/new.jpg')
MyCard.addScene(scene)
MyCard.changePosition(0, 12, 0)
MyCard.changeScale(MyCard.size[0], MyCard.size[1])
MyCard.changeRotate(0.4,0,0)

let ReciveCard = new Card('reciveCard', '/textures/card/new.jpg')
ReciveCard.addScene(scene)
ReciveCard.changePosition(0, 5, 0)
ReciveCard.changeScale(ReciveCard.size[0], ReciveCard.size[1])
ReciveCard.changeRotate(0.4,0,0)
ReciveCard.changeTex('/textures/card/cardback.jpg')
ReciveCard.cardGroup.visible = false

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

/* Lights */

// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.5)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 1)
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
// const fog = new THREE.Fog('#ffffffff', 5, 20)
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
    cam01.three.aspect = sizes.width / sizes.height
    cam01.three.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	
	effectComposer.setSize(sizes.width, sizes.height)
})


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

function recivePos(obj) {
	let recpos = [ obj.position.x, obj.position.y, obj.position.z]
	return recpos
}

/* Camera */

class Camera{
	constructor(_name){
		this.name = _name
		this.three = new THREE.PerspectiveCamera(75 , sizes.width / sizes.height, 0.1, 100)
		this.target = new THREE.Object3D();
		this.three.lookAt(this.target.position)
	}
	addScene(_sceneName){
		_sceneName.add(this.three)
		_sceneName.add(this.target)
	}
	camLookAt(target){
		this.three.lookAt(target)
	}
	moveCamPostion(_x,_y,_z){
		this.three.position.x = _x
		this.three.position.y = _y
		this.three.position.z = _z
	}
	moveTargetPosition(_x,_y,_z){
		this.target.position.x = _x
		this.target.position.y = _y
		this.target.position.z = _z
	}
	cameraMove(_sceneNum, _duration, _ease){
		gsap.to(
			this.three.position,{
				duration: _duration,
				ease: _ease,
				x: `${setAnima[_sceneNum].camPos[0]}`,
				y: `${setAnima[_sceneNum].camPos[1]}`,
				z: `${setAnima[_sceneNum].camPos[2]}`
			}
		)
	}
	targetMove(_sceneNum, _duration, _ease) {
		gsap.to(
			this.target.position,{
				duration: _duration,
				ease: _ease,
				x: `${setAnima[_sceneNum].targetPos[0]}`,
				y: `${setAnima[_sceneNum].targetPos[1]}`,
				z: `${setAnima[_sceneNum].targetPos[2]}`
			}
		)
	}
}

const cam01 = new Camera('cam01')
cam01.addScene(scene)
cam01.moveCamPostion(setAnima[0].camPos[0],setAnima[0].camPos[1],setAnima[0].camPos[2])
cam01.moveTargetPosition(setAnima[0].targetPos[0],setAnima[0].targetPos[1],setAnima[0].targetPos[2])

//--------------------------------------

function sceneMove(sceneNum) {
	switch (sceneNum) {
		case 0:
			console.log('sceneNum 0');
			cam01.cameraMove(sceneNum, 1.5, 'power2.inOut');
			cam01.targetMove(sceneNum, 1.5, 'power2.inOut');
			MyCard.objMove(sceneNum, 1.5, 'power2.inOut');
			console.log(MyCard.cardGroup)
			break;
		case 1:
			console.log('sceneNum 1');
			cam01.cameraMove(sceneNum, 1.5, 'power2.inOut');
			cam01.targetMove(sceneNum, 1.5, 'power2.inOut');
			MyCard.objMove(sceneNum, 1.5, 'power2.inOut');
			break;
		case 2:
			console.log('sceneNum 2');
			cam01.cameraMove(sceneNum, 1.5, 'power2.inOut');
			cam01.targetMove(sceneNum, 1.5, 'power2.inOut');
			MyCard.objMove(sceneNum, 1.5, 'power2.inOut');
			break;
		case 3:
			console.log('sceneNum 3');
			cam01.cameraMove(sceneNum, 4, 'power1.inOut');
			cam01.targetMove(sceneNum, 6, 'power1.Out');
			MyCard.objMove(sceneNum, 3, 'power1.Out');
			ReciveCard.cardGroup.visible = true
			setTimeout(function() {
				MyCard.cardGroup.visible = false
			}, 3000);
			gsap.to(
				ReciveCard.cardGroup.position,{
					delay: 2,
					duration: 5,
					ease: 'power1.inOut',
					x: '0',
					y: '2.5',
					z: '1'
				}
			)
			break;
		default:
			console.log(`Sorry, we are out of ${sceneNum}.`);
	}
}

//-----------------------------------------

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

/**
 * Post processing
 */
const effectComposer = new EffectComposer(renderer)
effectComposer.setSize(sizes.width, sizes.height)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
const renderPass = new RenderPass(scene, cam01.three)
effectComposer.addPass(renderPass)
const unrealBloomPass = new UnrealBloomPass()
effectComposer.addPass(unrealBloomPass)

unrealBloomPass.strength = 0.24
unrealBloomPass.radius = 0.5
unrealBloomPass.threshold = 0.5

// gui.add(unrealBloomPass, 'enabled')

/* Animate */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
	// nodeFrame.update();
	cam01.camLookAt(cam01.target.position)
	
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
	
	if(currentSection === 3)
	{	
		ReciveCard.cardGroup.rotation.x = Math.PI * 0.45
		ReciveCard.cardGroup.rotation.z =  0.05 * Math.sin(Math.PI * elapsedTime * 0.1)
		ReciveCard.cardGroup.rotation.y =  0.05 * Math.cos(Math.PI * elapsedTime * 0.1)
	}else {
		ReciveCard.cardGroup.rotation.x = Math.PI * 0.4
		ReciveCard.cardGroup.rotation.z = 0
		ReciveCard.cardGroup.rotation.y = 0
	}
    // Render
    // renderer.render(scene, cam01.three)
	effectComposer.render()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

const clickCard = document.getElementById('click')

clickCard.onclick = function() {
	// currentSection = 3
	sceneMove(currentSection)
	createSection()
	clickCard.style.display = 'none'
}


function createSection(){
	const body = document.getElementById("body")
	const newSection = document.createElement("section")
	newSection.setAttribute("class", "section")
	body.appendChild(newSection)
}