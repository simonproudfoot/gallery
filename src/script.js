import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
import gsap from 'gsap'

import { makeTextSprite } from './makeTextSprite.js'
const showCurve = false
let direction = 'forward'
let selectSpot = null
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
        curvePositions.push({ x: -10, y: 8, z: -140 + offset })
        spritey.position.set(cube[i].position.x - 15, cube[i].position.y, cube[i].position.z)
    }
    else if (i <= 21) {
        cube[i].position.set(-89.560, 8, cube[10].position.z - offset)
        cube[i].rotation.y = Math.PI * 2
        curvePositions.push({ x: -50, y: 8, z: cube[10].position.z - offset })
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
var cameraTest = new THREE.Mesh(geometry1, material1);
cameraTest.scale.z = 4
cameraTest.scale.y = 10
cameraTest.name = 'testCam'
//scene.add(cameraTest)
var fogColor = new THREE.Color(0xffffff);
scene.background = fogColor;
scene.fog = new THREE.Fog(fogColor, 0.0025, 700);
// CAMERA PATH
const curve = new THREE.CatmullRomCurve3();
// ENTER THE LOBBY
curvePositions.forEach(position => {
    curve.points.push(new THREE.Vector3(position.x, position.y, position.z - 10))
});


curve.closed = true
//curve.curveType = "centripetal";
const curveGeometry = new THREE.BufferGeometry().setFromPoints(curve.points);
const curveMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
console.log(curveMaterial)
// Create the final object to add to the scene
const curveObject = new THREE.Line(curveGeometry, curveMaterial);
scene.add(curveObject)
curvePositions.forEach(curve => {
    var curveHelper = new THREE.Mesh(geometry1, materialRed);
    if(!showCurve){
        curveHelper.visible = false
    }
    curveHelper.position.x = curve.x
    curveHelper.position.y = curve.y
    curveHelper.position.z = curve.z
    scene.add(curveHelper)
})


if(!showCurve){
    curve.visible = false
    curveMaterial.visible = false
}

// ENTER THE LOBBY
const curveLobby = new THREE.CatmullRomCurve3();
// ENTER THE LOBBY
curveLobby.points.push(new THREE.Vector3(0, 9, -300))
curveLobby.points.push(new THREE.Vector3(-0.940, 9, -130))
curveLobby.closed = false
curveLobby.curveLobbyType = "centripetal";
const lobbyPoints = curveLobby.getPoints(16);
const curveLobbyGeometry = new THREE.BufferGeometry().setFromPoints(lobbyPoints);
const curveLobbyMaterial = new THREE.LineBasicMaterial({ color: 0xeee });
const curveLobbyObject = new THREE.Line(curveLobbyGeometry, curveLobbyMaterial);
scene.add(curveLobbyObject)
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
document.addEventListener('mouseup', () => {
    if (!mouseDown) {
        mouseDown = false
    }
})
function onDocumentMouseDown(event) {
    mouseDown = true
    //controls.enabled = false
    event.preventDefault();
    var mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(artifacts);
    var matched_marker = null;
    if (intersects.length > 0) {
        for (var i = 0; intersects.length > 0 && i < intersects.length; i++) {
            const chosen = intersects[0].object.userData.id - 1
            direction = chosen < selectSpot ? 'backward' : 'forward'
            selectSpot = chosen
            console.log('choosing: ' + chosen)
            console.log(direction)
            //intro = true
            playing = true
        }
    }
}
document.addEventListener('mousedown', onDocumentMouseDown, false);
document.getElementById("start").addEventListener("click", beginTour);
function beginTour(params) {
    document.getElementById("start").style.display = 'd'
    started = true
    intro = true
}
// LOOK AT
function lookAtObject(cam, obj) {
    controls.enabled = false
    var item = scene.getObjectByName('Artifact' + selectSpot)
    var startRotation = new THREE.Euler().copy(cam.rotation);
    cam.lookAt(item.position);
    var endRotation = new THREE.Euler().copy(cam.rotation);
    cam.rotation.copy(startRotation);
    gsap.to(cam.rotation, {
        y: endRotation.y,
        duration: 2
    }).then(() => {
        // controls.enabled = true
        //alert('read')
    })
}



camera.position.copy(curveLobby.points[0])
const controls = new FirstPersonControls(camera, document.body);
controls.lookSpeed = 0.06;
controls.movementSpeed = 0.001;
controls.noFly = true;
controls.lookVertical = false;
controls.constrainVertical = true;
controls.verticalMin = 1.0;
controls.verticalMax = 2.0;
controls.object.position.copy(curveLobby.getPoint(0))
controls.enabled = false
controls.autoForward = true
controls.moveForward = false;
controls.moveBackward = false;
controls.moveLeft = false;
controls.moveRight = false;
controls.mouseDragOn = true

console.log(controls)
var delta;
var playing = false
var intro = false
var started = false
var clock = new THREE.Clock();
var t = 0
var ready;
// inital view
camera.lookAt(new THREE.Vector3(0, 0, 0))
controls.lookAt(new THREE.Vector3(0, 0, 0))
console.log('curve points:', curve.points.length)
console.log('artifacts count:', artifacts.length)

const animate = () => {
    var delta = clock.getDelta();
    // INTRO - WALK INTO ROOM
    if (intro && started) {
        t += 0.007
        if (t < 1) {
            var pos = curveLobby.getPoint(t);
            camera.position.set(pos.x, pos.y, pos.z);
            controls.lookAt = new THREE.Vector3(camera.matrix[8], camera.matrix[9], camera.matrix[10])
        }
        else {
            intro = false
            ready = true
            controls.enabled = true
        }
    }


    // GO TO THE OBJECT
    if (selectSpot && camera.position.distanceTo(curvePositions[selectSpot]) > 5 && playing && !intro) {
        //controls.enabled = false
        direction == 'forward' ? t += 0.001 : t -= 0.001
        var pos = curve.getPoint(t);
        camera.position.set(pos.x, pos.y, pos.z);
        //lookAtObject(camera, artifacts[selectSpot-3])
        // cam
        //  controls.target = artifacts[selectSpot].position
        // lookAtObject(camera, artifacts[selectSpot])
        // camera.updateProjectionMatrix();
    } else if (playing && !intro && camera.zoom < 1.2) {
        //   controls.enabled = false
        // lookAtObject(camera, artifacts[selectSpot-2])
        //  camera.zoom += 0.004;
    }








    requestAnimationFrame(animate);
    camera.updateProjectionMatrix();
    controls.update(delta)
    return renderer.render(scene, camera);
};
animate()
