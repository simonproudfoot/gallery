import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import CameraControls from 'camera-controls';
CameraControls.install({ THREE: THREE });
import { makeTextSprite } from './makeTextSprite.js'
const backButton = document.getElementById('goback')
const pos = document.getElementById('pos')
var testing = false;
var delta;
var playing = false
var intro = false
var started = false
var clock = new THREE.Clock();
var t = 0
var ready;
var last = {}
var lastTarget;
let direction = 'forward'
let selectSpot = null
let observing = false
let mouseDown = false;
var camSpeed = -1
// sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
// Canvas
const canvas = document.querySelector('canvas.webgl')
// Scene
const scene = new THREE.Scene()
var curvePositions = []
// CREATE ARTIFACTS
var cube = [];
const wallMountedGeometry = new THREE.BoxGeometry(1, 20, 20)
const pedestalGeometry = new THREE.CylinderGeometry(5, 5, 8, 10);
const material1 = new THREE.MeshStandardMaterial({ color: 0xcfc4a0 })
const materialRed = new THREE.MeshStandardMaterial({ color: 0xeb4034, wireframe: true })
const positions = [{ "x": 29, "y": 8, "z": -118 }, { "x": 29, "y": 8, "z": -86 }, { "x": 29, "y": 8, "z": -54 }, { "x": 29, "y": 8, "z": -22 }, { "x": 29, "y": 8, "z": 10 }, { "x": 20, "y": -2.5, "z": 42 }, { "x": 20, "y": -2.5, "z": 74 }, { "x": 20, "y": -2.5, "z": 106 }, { "x": 20, "y": -2.5, "z": 138 }, { "x": 20, "y": -2.5, "z": 170 }, { "x": -89.56, "y": 8, "z": 178 }, { "x": -89.56, "y": 8, "z": 146 }, { "x": -89.56, "y": 8, "z": 114 }, { "x": -89.56, "y": 8, "z": 82 }, { "x": -89.56, "y": 8, "z": 50 }, { "x": -83, "y": -2.5, "z": 18 }, { "x": -83, "y": -2.5, "z": -14 }, { "x": -83, "y": -2.5, "z": -46 }, { "x": -83, "y": -2.5, "z": -78 }, { "x": -83, "y": -2.5, "z": -110 }]
let artifacts = []
let sprites = []
var offset = 0
var x = 10
var i = 1

// remove positons button
if(!testing){
    pos.style.display = 'none'
}

// CREATE OBJECTS ON LONG
positions.forEach(element => {


    var spritey = makeTextSprite('sprite' + i, { borderColor: { r: 255, g: 255, b: 200, a: 1.0 }, fontsize: 30, backgroundColor: { r: 0, g: 0, b: 0, a: 1.0 }, textColor: { r: 255, g: 255, b: 255, a: 1.0 } });
    spritey.userData.id = i
    sprites.push(spritey)
    spritey.position.copy(element)

    if (i <= 10) {
        spritey.position.x -= 14
    } else {
        spritey.position.x += 9
    }


    if (i <= 5 || i > 10 && i < 16) {
        var newArtifact = new THREE.Mesh(wallMountedGeometry, material1);
        newArtifact.name = 'Wallmount-' + i
        newArtifact.position.copy(element)
        newArtifact.userData.pedistal = false
       
    }
    else {
        var newArtifact = new THREE.Mesh(pedestalGeometry, material1);
        newArtifact.position.copy(element)
        newArtifact.name = 'Pedistal-' + i
        newArtifact.position.y = -2.5 // touch floor
        newArtifact.userData.pedistal = true
    }


    scene.add(spritey);
    artifacts.push(newArtifact)
    scene.add(newArtifact)
    i++
});

// for (var i = 1; i <= 20;) {
//     offset += 32
//     cube[i] = new THREE.Mesh(geometry1, material1);
//     cube[i].name = 'Artifact' + i
//     cube[i].userData.id = i
//     var spritey = makeTextSprite(cube[i].name, { borderColor: { r: 255, g: 255, b: 200, a: 1.0 }, fontsize: 30, backgroundColor: { r: 255, g: 255, b: 200, a: 1.0 }, textColor: { r: 255, g: 255, b: 255, a: 1.0 } });
//     spritey.userData.id = i
//     sprites.push(spritey)
//     spritey.name = 'sprite' + i
//     //spritey.id i
//     cube[i].scale.set(1, 18, 18)
//     if (i <= 10) {
//         cube[i].position.set(29, 8, -140 + offset)
//         spritey.position.set(cube[i].position.x - 15, cube[i].position.y, cube[i].position.z)
//         //spritey.id= i
//     }
//     else if (i <= 21) {
//         cube[i].position.set(-89.560, 8, cube[10].position.z - offset)
//         cube[i].rotation.y = Math.PI * 2
//         spritey.position.set(cube[i].position.x + 10, cube[i].position.y, cube[i].position.z)
//         //     spritey.id= i
//     }


//     artifacts.push(cube[i])
//     scene.add(cube[i]);
//     scene.add(spritey);

//     i++
//     if (i == 11) {
//         offset = -40
//     }
// }





// FOG 
var fogColor = new THREE.Color(0xffffff);
scene.background = fogColor;
scene.fog = new THREE.Fog(fogColor, 0.0025, 700);


document.getElementById("pos").addEventListener("click", getAllPositons);
function getAllPositons(params) {
    if (testing) {
        var posi = []
        artifacts.forEach(element => {
            posi.push(element.position)
        });

        document.getElementById('positions').innerHTML = JSON.stringify(posi);
    }
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
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 1, 1000);
scene.add(camera)
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
    var intersects = raycaster.intersectObjects(sprites);

    if (intersects.length > 0 && !selectSpot) {
        for (var i = 0; intersects.length > 0 && i < intersects.length; i++) {
            const chosen = intersects[0].object.userData.id
            selectSpot = chosen - 1
            console.log(chosen)
        }
    }
}

// listeners
document.getElementById("goback").addEventListener("click", turnAround);
document.addEventListener('mousedown', onDocumentMouseDown, false);
document.getElementById("start").addEventListener("click", beginTour);
function beginTour(params) {
    document.getElementById("start").style.display = 'none'
    started = true
    intro = true

}

const cameraControls = new CameraControls(camera, renderer.domElement);
cameraControls.minDistance = 0;
cameraControls.azimuthRotateSpeed = camSpeed; // negative value to invert rotation direction
cameraControls.polarRotateSpeed = camSpeed; // negative value to invert rotation direction
cameraControls.minZoom = 1;
//cameraControls.draggingDampingFactor = 0.01;
cameraControls.maxZoom = 1;
cameraControls.mouseButtons.wheel = CameraControls.ACTION.ZOOM;
cameraControls.touches.two = CameraControls.ACTION.TOUCH_ZOOM_TRUCK;
cameraControls.enabled = testing ? true : false
cameraControls.minPolarAngle = Math.PI /2
cameraControls.maxPolarAngle = Math.PI /2
cameraControls.saveState();

// inital view
camera.lookAt(new THREE.Vector3(0, 0, 0))
const cameraStand = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
);
scene.add(cameraStand);
cameraStand.geometry.computeBoundingBox();
cameraStand.visible = false
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
cameraControls.setPosition(0, 0, -230)
async function startTour() {
    await cameraControls.setPosition(0, 0, 0, true);
    intro = false
    ready = true
    cameraControls.enabled = true
    return true
}
var nextPos = {}
async function lookAtArtifact(params) {
    nextPos.x = artifacts[selectSpot].position.x
    nextPos.y = artifacts[selectSpot].position.y
    nextPos.z = artifacts[selectSpot].position.z

    // move camera up for pedistal
    if(artifacts[selectSpot].userData.pedistal){
        nextPos.y +=10
    }

    cameraControls.setTarget(nextPos.x, nextPos.y, nextPos.z, true)


    if (selectSpot <= 9) {
        cameraStand.position.set(nextPos.x - 30, nextPos.y, nextPos.z)
        await cameraControls.setPosition(nextPos.x - 30, nextPos.y, nextPos.z, true)

    } else {
        cameraStand.position.set(nextPos.x + 30, nextPos.y, nextPos.z)
        await cameraControls.setPosition(nextPos.x + 30, nextPos.y, nextPos.z, true)
    }

    cameraControls.saveState()
    backButton.style.display = 'block'

}

async function turnAround() {
    // cameraControls.setPosition(0, 0, 0, true)
    // cameraControls.setTarget(0, 0, -300, true)

    await cameraControls.setLookAt(cameraStand.position.x, 0, cameraStand.position.z, 0, 0, cameraStand.position.z, true)
    selectSpot = null
    backButton.style.display = 'none'
}

const animate = () => {
    // INTRO - WALK INTO ROOM

    if (!testing) {
        if (intro && started) {
            startTour()
            // canvas.style.cursor = 'pointer'
        } else if (selectSpot) {
            lookAtArtifact()
        }
        // else if (intro && started && !selectSpot) {
        //     alert('move back to room')
        //   }
    }


    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();
    const updated = cameraControls.update(delta);
    requestAnimationFrame(animate);
    customFitTo()
    return renderer.render(scene, camera);

};
animate()





