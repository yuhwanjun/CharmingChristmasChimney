import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'lil-gui'
import gsap from 'gsap'
// import { TeapotGeometry } from 'three/examples/jsm/geometries/TeapotGeometry.js';
// import { nodeFrame } from 'three/examples/jsm/renderers/webgl/nodes/WebGLNodes.js';
// import * as Nodes from 'three/examples/jsm/renderers/nodes/Nodes.js';

//다른 js 임포트
// import Experience from './src/Experience/Experience.js'
// const experience = new Experience()

// Debug
const gui = new dat.GUI()
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const textureLoader = new THREE.TextureLoader()
const gltfLoader = new GLTFLoader()

const redMatcapTexture = textureLoader.load('/textures/matcaps/redbricks.png')
const redMatCapMat = new THREE.MeshMatcapMaterial()
redMatCapMat.matcap = redMatcapTexture

const whiteMatcapTexture = textureLoader.load('/textures/matcaps/whitebricks.png')
const whiteMatCapMat = new THREE.MeshMatcapMaterial()
whiteMatCapMat.matcap = whiteMatcapTexture

gltfLoader.load(
    '/models/ccc.gltf',
    (gltf) =>
    {
		gltf.scene.scale.set(0.1, 0.1, 0.1)
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

const texturesInfo = {
	door : {
		texture : ['color', 'alpha', 'ambientOcclusion', 'height', 'normal', 'metalness', 'roughness']
	},
	bricks : {
		texture : ['color', 'ambientOcclusion', 'normal', 'roughness']
	},
	grass : {
		texture : ['color', 'ambientOcclusion', 'normal', 'roughness']
	}
}

//키값 매핑해주는 함수
function matchTextureKeyValue(name){
	//arrName에 해당하는 texturesInfo 에서 배열을 가져온다.
	const textureKeyArr = texturesInfo[`${name}`].texture
	const makingTextureObject = {}
	//class의 textureArr에 객체 생성
	for(let i = 0; i < textureKeyArr.length; i++){
		makingTextureObject[`${textureKeyArr[i]}`] = textureLoader.load(`/textures/${name}/${textureKeyArr[i]}.jpg`);
	}
	return makingTextureObject
}

/* Textures class */
class Texture{
	constructor(name) {
		this.name = name;
		this.texture = matchTextureKeyValue(name)
	}
	wrapSet(sizeX, sizeY){
		for(let i = 0; i < Object.keys(this.texture).length; i++) {
			this.texture[`${Object.keys(this.texture)[i]}`].repeat.set(sizeX, sizeY)
		}
	}
	repeatWrapping(){
		for(let i = 0; i < Object.keys(this.texture).length; i++) {
			this.texture[`${Object.keys(this.texture)[i]}`].wrapS = THREE.RepeatWrapping
			this.texture[`${Object.keys(this.texture)[i]}`].wrapT = THREE.RepeatWrapping
		}
	}
}

// const Door = new Texture('door')
const Brick = new Texture('bricks')
const Grass = new Texture('grass')
Grass.wrapSet(8,8)
Grass.repeatWrapping()

/* 
 # Object
*/

class Card{
	constructor(_name, _textureSrc){
		this.name = _name
		this.cardGroup = new THREE.Group();
		
		//##size
		let size = [3 , 4]
		this.size = size
		
		//## position
		this.position = [0,0,0]
		
		//## rotate
		this.rotate = [0,0,0]
		
		this.frontImgSrc = textureLoader.load(_textureSrc, function(tex){
			size[0] = tex.image.width
			size[1] = tex.image.height
		})
		
		//카드 사이즈 설정
		this.cardGeo = new THREE.BoxGeometry(1, 0.001, 1)
		
		//앞면 생성
		this.frontMat = new THREE.MeshStandardMaterial()
		this.frontMat.metalness = 0.45
		this.frontMat.roughness = 0.65
		this.cardFront = new THREE.Mesh(this.cardGeo, this.frontMat)
		this.frontMat.map = this.frontImgSrc //이미지를 카드 앞면에 맵핑
		this.cardGroup.add(this.cardFront) //카드 그룹에 앞면 추가
		this.cardFront.castShadow = true
		
		//뒷면 생성
		this.backMat = new THREE.MeshStandardMaterial()
		this.cardBack = new THREE.Mesh(this.cardGeo, this.backMat)
		this.cardGroup.add(this.cardBack)
		this.cardBack.castShadow = true
		this.cardBack.position.y = -0.001
		
		this.cardGroup.castShadow = true
	}
	addScene(_scene){
		_scene.add(this.cardGroup)
	}
	changeTex(_changeImgSrc){
		this.frontImgSrc = textureLoader.load(_changeImgSrc)
		this.frontMat.map = this.frontImgSrc
	}
	changePosition(_x,_y,_z){
		this.position = [_x,_y,_z]
		this.cardGroup.position.x = this.position[0]
		this.cardGroup.position.y = this.position[1]
		this.cardGroup.position.z = this.position[2]
	}
	changeScale(_x,_z){
		this.size = [_x,_z]
		this.cardGroup.scale.x = 1.5
		this.cardGroup.scale.z = 1.5 * this.size[1] / this.size[0]
	}
	changeRotate(_x, _y, _z){
		this.rotate = [_x, _y, _z]
		this.cardGroup.rotation.x = Math.PI * this.rotate[0]
		this.cardGroup.rotation.y = Math.PI * this.rotate[1]
		this.cardGroup.rotation.z = Math.PI * this.rotate[2]
	}
}

let MyCard = new Card('myCard', '/textures/card/new.jpg')
MyCard.addScene(scene)
MyCard.changePosition(0, 6, 1)
MyCard.changeScale(MyCard.size[0], MyCard.size[1])
MyCard.changeRotate(0.4,0,0)

console.log(MyCard)

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

// // 집 그룹 생성
// const house = new THREE.Group()
// scene.add(house)

// const wallMat = new THREE.MeshStandardMaterial({
// 		map: Brick.texture.color,
// 		aoMap: Brick.texture.ambientOcclusion,
// 		normalMap: Brick.texture.normal,
// 		roughnessMap: Brick.texture.roughness
// 	})

// // 벽 생성
// const walls01 = new THREE.Mesh(
// 	new THREE.BoxGeometry(1, 8, 4),
// 	wallMat
// )
// walls01.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls01.geometry.attributes.uv.array, 2))
// walls01.position.x = 2
// walls01.position.y = 4
// walls01.position.z = 0
// house.add(walls01)

// const walls02 = new THREE.Mesh(
// 	new THREE.BoxGeometry(1, 8, 4),
// 	wallMat
// )
// walls02.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls02.geometry.attributes.uv.array, 2))
// walls02.position.x = -2
// walls02.position.y = 4
// walls02.position.z = 0
// house.add(walls02)

// const walls03 = new THREE.Mesh(
// 	new THREE.BoxGeometry(3, 8, 1),
// 	wallMat
// )
// walls03.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls03.geometry.attributes.uv.array, 2))
// walls03.position.x = 0
// walls03.position.y = 4
// walls03.position.z = -1.5
// house.add(walls03)

// const walls04 = new THREE.Mesh(
// 	new THREE.BoxGeometry(3, 5, 1),
// 	wallMat
// )
// walls04.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls04.geometry.attributes.uv.array, 2))
// walls04.position.x = 0
// walls04.position.y = 5.5
// walls04.position.z = 1.5
// house.add(walls04)

// house.scale.x = 0.5
// house.scale.y = 0.5
// house.scale.z = 0.5

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
doorLight.position.set(0, 2.2, 2.7)
// house.add(doorLight)

doorLight.castShadow = true
doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

// walls01.castShadow = true
// walls02.castShadow = true
// walls03.castShadow = true
// walls04.castShadow = true

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

/**
 * Fog
 */
// const fog = new THREE.Fog('#1d1d1f', 1, 15)
// scene.fog = fog

scene.fog = new THREE.FogExp2( 0x000000, 0.001 );

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

