export default class Experience
{
    constructor()
    {
        // Global access
        window.experience = this
    }
}


/* Object */

const teapotGeometry = new THREE.SphereGeometry( 10, 10, 10 );
const sphereGeometry = new THREE.SphereGeometry( 20, 10, 20 );

const geometry = new THREE.BufferGeometry();

// buffers 불만들기

const speed = [];
const intensity = [];
const size = [];

const positionAttribute = teapotGeometry.getAttribute( 'position' );
const particleCount = positionAttribute.count;

for ( let i = 0; i < particleCount; i ++ ) {

	speed.push( 20 + Math.random() * 50 );

	intensity.push( Math.random() * .15 );

	size.push( 30 + Math.random() * 230 );

}

geometry.setAttribute( 'position', positionAttribute );
geometry.setAttribute( 'targetPosition', sphereGeometry.getAttribute( 'position' ) );
geometry.setAttribute( 'particleSpeed', new THREE.Float32BufferAttribute( speed, 1 ) );
geometry.setAttribute( 'particleIntensity', new THREE.Float32BufferAttribute( intensity, 1 ) );
geometry.setAttribute( 'particleSize', new THREE.Float32BufferAttribute( size, 1 ) );

// maps

// Forked from: https://answers.unrealengine.com/questions/143267/emergency-need-help-with-fire-fx-weird-loop.html

const fireMap = new THREE.TextureLoader().load( '/textures/firetorch_1.jpg' );

// nodes

const targetPosition = new Nodes.AttributeNode( 'targetPosition', 'vec3' );
const particleSpeed = new Nodes.AttributeNode( 'particleSpeed', 'float' );
const particleIntensity = new Nodes.AttributeNode( 'particleIntensity', 'float' );
const particleSize = new Nodes.AttributeNode( 'particleSize', 'float' );

const time = new Nodes.TimerNode();

const spriteSheetCount = new Nodes.Vector2Node( new THREE.Vector2( 6, 6 ) ).setConst( true );

const fireUV = new Nodes.SpriteSheetUVNode( 
	spriteSheetCount, // count
	new Nodes.PointUVNode(), // uv
	new Nodes.OperatorNode( '*', time, particleSpeed ) // current frame
);

const fireSprite = new Nodes.TextureNode( fireMap, fireUV );
const fire = new Nodes.OperatorNode( '*', fireSprite, particleIntensity );

const lerpPosition = new Nodes.FloatNode( 0 );

const positionNode = new Nodes.MathNode( Nodes.MathNode.MIX, new Nodes.PositionNode( Nodes.PositionNode.LOCAL ), targetPosition, lerpPosition );

// material

const material = new Nodes.PointsNodeMaterial( {
	depthWrite: false,
	transparent: true,
	sizeAttenuation: true,
	blending: THREE.AdditiveBlending
} );

material.colorNode = fire;
material.sizeNode = particleSize;
material.positionNode = positionNode;

const particles = new THREE.Points( geometry, material );
scene.add( particles );

particles.scale.x= 0.01
particles.scale.y= 0.01
particles.scale.z= 0.01

// gui

const guiNode = { lerpPosition: 0 };

gui.add( material, 'sizeAttenuation' ).onChange( function () {

	material.needsUpdate = true;

} );

gui.add( guiNode, 'lerpPosition', 0, 1 ).onChange( function () {

	lerpPosition.value = guiNode.lerpPosition;

} );

gui.open();
