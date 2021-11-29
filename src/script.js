import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import gsap from 'gsap'
import * as dat from 'lil-gui'
import { makeTextSprite } from './makeTextSprite.js'
let direction = 'forward'
let selectSpot = 1
const gui = new dat.GUI()
// Canvas
const canvas = document.querySelector('canvas.webgl')
// Scene
const scene = new THREE.Scene()
var curvePositions = []
// RIGHT WALL ARTIFACTS
var cube = [];
const geometry1 = new THREE.BoxGeometry(1, 1, 1)
const material1 = new THREE.MeshStandardMaterial({ color: 0x3d87ff })
let artifacts = []
var offset = 0
var total = 10
var i = total
for (var i = total - 1; i >= 1; i--) {
    if (i >= 1) {
        offset += 35
    }
    cube[i] = new THREE.Mesh(geometry1, material1);
    cube[i].name = 'Artifact' + i
    cube[i].userData.id = i
    cube[i].scale.set(1, 18, 18)
    cube[i].position.set(29, 8, 210 - offset)

    curvePositions.push({ x: -1.380, y: 8, z: 210 - offset })
    artifacts.push(cube[i])
    scene.add(cube[i]);
    var spritey = makeTextSprite(cube[i].name, { borderColor: { r: 255, g: 255, b: 200, a: 1.0 }, fontsize: 44, textColor: { r: 255, g: 255, b: 255, a: 1.0 } });
    spritey.position.set(cube[i].position.x - 10, cube[i].position.y, cube[i].position.z)
    scene.add(spritey);
}
// LEFT WALL ARTIFACTS
var cubeLeft = [];
offset = 0
var plus = 0
for (let x = total; x < total * 2 - 1; x++) {
    if (x >= total) {
        offset += 35
    }
    cubeLeft[x] = new THREE.Mesh(geometry1, material1);
    cubeLeft[x].name = 'Artifact' + x
    cubeLeft[x].scale.set(1, 18, 18)
    cubeLeft[x].position.set(-89.770, 8, -130 + offset)
    cubeLeft[x].userData.id = x
    artifacts.push(cubeLeft[x])
    curvePositions.push({ x: -59.520, y: 8, z: -130 + offset })
    scene.add(cubeLeft[x]);
    var spritey = makeTextSprite(cubeLeft[x].name, { borderColor: { r: 255, g: 255, b: 200, a: 1.0 }, fontsize: 44, textColor: { r: 255, g: 255, b: 255, a: 1.0 } });
    spritey.position.set(cubeLeft[x].position.x + 10, cubeLeft[x].position.y, cubeLeft[x].position.z)
    scene.add(spritey);
}
var cameraTest = new THREE.Mesh(geometry1, material1);
cameraTest.name = 'testCam'
scene.add(cameraTest)
const curve = new THREE.CatmullRomCurve3();
curvePositions.forEach(position => {
    curve.points.push(new THREE.Vector3(position.x, position.y, position.z - 10))
});
curve.closed = false
const points = curve.getPoints(16);
// console.log(curve.points)
const curveGeometry = new THREE.BufferGeometry().setFromPoints(points);
const curveMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
// // Create the final object to add to the scene
const curveObject = new THREE.Line(curveGeometry, curveMaterial);
scene.add(curveObject)
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
var hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 2.5);
scene.add(hemiLight);
const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);
// Camera
const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 1, 1000);
camera.position.set(-0.603, 1.955, 29.095)
camera.rotation.y = Math.PI / 2
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
    var intersects = raycaster.intersectObjects(artifacts);

    var matched_marker = null;
    if (intersects.length > 0) {
        //$('html,body').css('cursor','pointer');//mouse cursor change
        for (var i = 0; intersects.length > 0 && i < intersects.length; i++) {



            playing = true

            const chosen = intersects[0].object.userData.id

            direction = chosen < selectSpot ? 'backward' : 'forward'
            selectSpot = chosen
            console.log('choosing: ' + chosen)
            console.log(direction)
        }
    }
    else {
        //$('html,body').css('cursor','cursor');
    }
}

document.addEventListener('mousedown', onDocumentMouseDown, false);


// LOOK AT
function lookAtObject(obj) {
    if (!controls.enabled) {
        var item = scene.getObjectByName('Artifact' + selectSpot)
        var startRotation = new THREE.Euler().copy(camera.rotation);
        camera.lookAt(item.position);
        var endRotation = new THREE.Euler().copy(camera.rotation);
        camera.rotation.copy(startRotation);
        console.log('looking at' + selectSpot)
        // Tweex
        gsap.to(camera.rotation, {
            //x: endRotation.x,
            y: endRotation.y,
            // z: endRotation.z,
            duration: 1
        }).then(() => {
            playing = false
        })
    }
}
var vt = t * 0.01
function userLookAt() {
    console.log('looking at')
}
var t = 0
function moveAlong() {
    // BASIC
    direction == 'forward' ? t += 0.003 : t -= 0.003
    if (curve.getPointAt(t) != undefined && t != undefined) {
        pos = curve.getPointAt(t);
        cameraTest.position.copy(pos);
    }
   
}
var p1 = new THREE.Vector3();
var p2 = new THREE.Vector3();
var lookAt = new THREE.Vector3();
var axis = new THREE.Vector3(0, 0, 0);
var pos = 0
var playing = false
var camPos = new THREE.Vector3(0, 0, 0);
var diff = {}
// Holds current camera position
var pause = false
const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableZoom = false
// controls.enablePan = false
// controls.enabled = false
// console.log(controls)
//camera.lookAt
const animate = () => {
    //lookAtObject()
    if (camera.position.distanceTo(curve.points[selectSpot]) > 5) {
        //  controls.enabled = false
    }

    diff.x = Math.abs(cameraTest.position.x - curve.points[selectSpot].x);
    diff.y = Math.abs(cameraTest.position.y - curve.points[selectSpot].y);
    diff.z = Math.abs(cameraTest.position.z - curve.points[selectSpot].z);

    if (diff.x < 1 && diff.y < 1 && diff.z < 1) {

    } else {
        moveAlong()
        lookAtObject()
    }
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    return renderer.render(scene, camera);
}
animate()
