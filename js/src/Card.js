import * as THREE from 'three'
import gsap from 'gsap'
import {setAnima} from './MoveSet.js'

const textureLoader = new THREE.TextureLoader()

export default class Card{
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
	objMove(_sceneNum, _duration, _ease){
		gsap.to(
			this.cardGroup.position,{
				duration: _duration,
				ease: _ease,
				x: `${setAnima[_sceneNum].cardPos[0]}`,
				y: `${setAnima[_sceneNum].cardPos[1]}`,
				z: `${setAnima[_sceneNum].cardPos[2]}`
			}
		)
	}
}