import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import gsap from 'gsap'
import CameraControls from 'camera-controls';
CameraControls.install({ THREE: THREE });
import { makeTextSprite } from './makeTextSprite.js'

let direction = 'forward'
let selectSpot = null
let observing = false
//const gui = new dat.GUI()
let mouseDown = false;
// Canvas
const canvas = document.querySelector('canvas.webgl')
// Scene
const scene = new THREE.Scene()
var curvePositions = []
// RIGHT WALL ARTIFACTS
var cube = [];
const geometry1 = new THREE.BoxGeometry(1, 1, 1)
const material1 = new THREE.MeshStandardMaterial({ color: 0x3d87ff })
const materialRed = new THREE.MeshStandardMaterial({ color: 0xeb4034, wireframe: true })
let artifacts = []
var offset = 0
var x = 10
for (var i = 1; i <= 20;) {
    offset += 32
    cube[i] = new THREE.Mesh(geometry1, material1);
    cube[i].name = 'Artifact' + i
    cube[i].userData.id = i
    var spritey = makeTextSprite(cube[i].name, { borderColor: { r: 255, g: 255, b: 200, a: 1.0 }, fontsize: 30, textColor: { r: 255, g: 255, b: 255, a: 1.0 } });
    spritey.name = 'sprite' + i
    cube[i].scale.set(1, 18, 18)
    if (i <= 10) {
        cube[i].position.set(29, 8, -140 + offset)
        // curvePositions.push({ x: -10, y: 8, z: -140 + offset })
        spritey.position.set(cube[i].position.x - 15, cube[i].position.y, cube[i].position.z)
    }
    else if (i <= 21) {
        cube[i].position.set(-89.560, 8, cube[10].position.z - offset)
        cube[i].rotation.y = Math.PI * 2
        // curvePositions.push({ x: -50, y: 8, z: cube[10].position.z - offset })
        spritey.position.set(cube[i].position.x + 10, cube[i].position.y, cube[i].position.z)
    }
    artifacts.push(cube[i])
    scene.add(cube[i]);
    scene.add(spritey);
    i++
    if (i == 11) {
        offset = -40
    }
}

var fogColor = new THREE.Color(0xffffff);
scene.background = fogColor;
scene.fog = new THREE.Fog(fogColor, 0.0025, 700);


// box sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
// Load a glTF resource
const loader = new GLTFLoader();
loader.load(
    // resource URL
    './gallery_extended.gltf',
    // called when the resource is loaded
    function (gltf) {
        gltf.scene.scale.set(0.05, 0.05, 0.05)
        scene.add(gltf.scene);
        gltf.scene.traverse(n => {
            if (n.isMesh) {
                n.castShadow = true;
                n.receiveShadow = true;
                if (n.material.map) n.material.map.anisotropy = 16;
            }
        });
    },
    // called while loading is progressing
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // called when loading has errors
    function (error) {
        console.log('An error happened' + error);
    }
);
// lights
var hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 2.2);
scene.add(hemiLight);
const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);
// Camera
const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 1, 1000);
scene.add(camera)
//camera.rotation.y = -2
// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    castShadow: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true
function onDocumentMouseDown(event) {
    event.preventDefault();
    var mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(artifacts);
    if (intersects.length > 0) {
        for (var i = 0; intersects.length > 0 && i < intersects.length; i++) {
            const chosen = intersects[0].object.userData.id - 1
            direction = chosen < selectSpot ? 'backward' : 'forward'
            selectSpot = chosen
            console.log('choosing: ' + chosen)

            playing = true
        }
    }
}

document.getElementById("goback").addEventListener("click", turnAround);


document.addEventListener('mousedown', onDocumentMouseDown, false);
document.getElementById("start").addEventListener("click", beginTour);
function beginTour(params) {
    document.getElementById("start").style.display = 'none'
    started = true
    intro = true
}


var camSpeed = -10


const cameraControls = new CameraControls(camera, renderer.domElement);
cameraControls.minDistance = cameraControls.maxDistance = 1;
// cameraControls.azimuthRotateSpeed = camSpeed; // negative value to invert rotation direction
// cameraControls.polarRotateSpeed = camSpeed; // negative value to invert rotation direction
// cameraControls.truckSpeed = camSpeed;
// cameraControls.dollySpeed = camSpeed
// cameraControls.dampingFactor = 0.08
cameraControls.minZoom = 1;
cameraControls.maxZoom = 1;
cameraControls.mouseButtons.wheel = CameraControls.ACTION.ZOOM;
cameraControls.touches.two = CameraControls.ACTION.TOUCH_ZOOM_TRUCK;
cameraControls.enabled = false
cameraControls.saveState();


console.log(cameraControls)
var delta;
var playing = false
var intro = false
var started = false
var clock = new THREE.Clock();
var t = 0
var ready;
var last = {}
var lastTarget;
// inital view
camera.lookAt(new THREE.Vector3(0, 0, 0))
const cameraStand = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
);
scene.add(cameraStand);
cameraStand.geometry.computeBoundingBox();
cameraStand.visible=false
const meshBBSize = cameraStand.geometry.boundingBox.getSize(new THREE.Vector3());
const meshBBWidth = meshBBSize.x;
const meshBBHeight = meshBBSize.y;
const meshBBDepth = meshBBSize.z;

function customFitTo() {

    const distanceToFit = cameraControls.getDistanceToFitBox(meshBBWidth, meshBBHeight, meshBBDepth);
    cameraControls.moveTo(
        cameraStand.position.x,
        cameraStand.position.y,
        cameraStand.position.z + distanceToFit,
        true
    );

}

cameraControls.setPosition(0, 9, -300)
async function startTour() {
    await cameraControls.setPosition(0, 0, 0, true);
    intro = false
    ready = true
    cameraControls.enabled = true
    return true
}

async function lookAtArtifact(params) {
    var nextPos = {}
    nextPos.x = artifacts[selectSpot].position.x
    nextPos.y = artifacts[selectSpot].position.y
    nextPos.z = artifacts[selectSpot].position.z
    cameraControls.setTarget(nextPos.x, nextPos.y, nextPos.z, true)
   

    if (selectSpot <= 9) {
        cameraStand.position.set(nextPos.x - 20, nextPos.y, nextPos.z)
        await cameraControls.setPosition(nextPos.x - 20, nextPos.y, nextPos.z, true)
        
    } else {
        cameraStand.position.set(nextPos.x + 20, nextPos.y, nextPos.z)
        await cameraControls.setPosition(nextPos.x + 20, nextPos.y, nextPos.z, true)
    }
  

    cameraControls.saveState()

    //console.log('camera',camera.position)
   // camera.position = cameraControls.getPosition()
    //console.log('cameraControls',cameraControls.sgetPosition())

    // test 
   
}

function turnAround() {

  
   // cameraControls.setPosition(0, 0, 0, true)
    //cameraControls.setTarget(0, 0, -300, true)
    selectSpot = null
    
}

const animate = () => {
    // INTRO - WALK INTO ROOM
    if (intro && started) {
        startTour()
    } else if (selectSpot) {
        lookAtArtifact()
    } 
    // else if (intro && started && !selectSpot) {
    //     alert('move back to room')
    // }


    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();
    const updated = cameraControls.update(delta);
    requestAnimationFrame(animate);
    customFitTo()
    return renderer.render(scene, camera);

};
animate()





