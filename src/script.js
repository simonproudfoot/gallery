import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
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
var x = 10
for (var i = 1; i <= 20;) {
    offset += 32
    cube[i] = new THREE.Mesh(geometry1, material1);
    cube[i].name = 'Artifact' + i
    cube[i].userData.id = i
    var spritey = makeTextSprite(cube[i].name, { borderColor: { r: 255, g: 255, b: 200, a: 1.0 }, fontsize: 44, textColor: { r: 255, g: 255, b: 255, a: 1.0 } });

    cube[i].scale.set(1, 18, 18)
    if (i <= 10) {
        cube[i].position.set(29, 8, -140 + offset)
        curvePositions.push({ x: -10, y: 8, z: -140 + offset })
        spritey.position.set(cube[i].position.x - 15, cube[i].position.y, cube[i].position.z)
    }
    else if (i <= 20) {
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
cameraTest.scale.y = 4
cameraTest.name = 'testCam'
//scene.add(cameraTest)


// CAMERA PATH
const curve = new THREE.CatmullRomCurve3();
curvePositions.forEach(position => {
    curve.points.push(new THREE.Vector3(position.x, position.y, position.z - 10))
});
curve.closed = true
curve.curveType = "centripetal";
const points = curve.getPoints(16);
// console.log(curve.points)
const curveGeometry = new THREE.BufferGeometry().setFromPoints(points);
const curveMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
// // Create the final object to add to the scene
const curveObject = new THREE.Line(curveGeometry, curveMaterial);
scene.add(curveObject)


curvePositions.forEach(curve => {
    var curveHelper = new THREE.Mesh(geometry1, material1);
    curveHelper.position.x = curve.x
    curveHelper.position.y = curve.y
    curveHelper.position.z = curve.z
    //curveHelper.material.color.setHex(0,0,0)
    scene.add(curveHelper)
})




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
    if (!playing) {
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
                playing = true
            }

        }
    }
}

document.addEventListener('mousedown', onDocumentMouseDown, false);

// document.addEventListener('mousemove', function (e) {
//     var mouse3D = new THREE.Vector3((event.clientX) * 100 - 1, 0.5);
//     camera.lookAt(mouse3D);
// });


// LOOK AT
function lookAtObject(cam, obj) {
    // if (!controls.enabled) {
    var item = scene.getObjectByName('Artifact' + selectSpot)
    var startRotation = new THREE.Euler().copy(cam.rotation);
    cam.lookAt(item.position);
    var endRotation = new THREE.Euler().copy(cam.rotation);
    cam.rotation.copy(startRotation);
    console.log(obj)
    // Tweex
    gsap.to(cam.rotation, {
        //x: endRotation.x,
        y: endRotation.y,
        // z: endRotation.z,
        duration: 0.2
    }).then(() => {
        // playing = false
    })
    // }
}

var t = 0
function moveAlong() {
    // BASIC
    direction == 'forward' ? t += 0.005 : t -= 0.005
    var pos = curve.getPointAt(t)
    cameraTest.position.set(pos.x, pos.y, pos.z)


}
var p1 = new THREE.Vector3();
var p2 = new THREE.Vector3();
var lookAt = new THREE.Vector3();
var axis = new THREE.Vector3(0, 0, 0);
var pos = 0
var playing = false
var camPos = new THREE.Vector3(0, 0, 0);
var diff = {}
var cameraTurned = false
var cameraLastRotation = 0
var prevTime = 0
var rotation = 0
var raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);


const controls = new FirstPersonControls(camera, document.body);
controls.lookSpeed = 0.03;
controls.movementSpeed = 20;
controls.noFly = true;
controls.lookVertical = false;
controls.constrainVertical = true;
controls.verticalMin = 1.0;
controls.verticalMax = 2.0;

console.log(controls)



var clock = new THREE.Clock();
const animate = () => {
    var delta = clock.getDelta();
    requestAnimationFrame(animate);
    if (playing) {
        controls.enabled = false
    } else {
        controls.enabled = true
    }
    //lookAtObject(cameraTest, artifacts[selectSpot])


    if (camera.position.distanceTo(curvePositions[selectSpot]) > 1.5 && playing) {

        direction == 'forward' ? t += 0.005 : t -= 0.005
        var pos = curve.getPoint(t);
        camera.position.set(pos.x, pos.y, pos.z);
        //     controls.getObject().position.copy(camera.position);
        controls.target = artifacts[selectSpot].position
        lookAtObject(camera, artifacts[selectSpot])


        // if (selectSpot < 9 && direction == 'forward') {
        //     lookAtObject(cameraTest, curvePositions[9])
        // }
        // if (selectSpot < 9 && selectSpot > 9 && direction == 'forward') {
        //     lookAtObject(cameraTest, curvePositions[10])
        // }
        // if (selectSpot > 9 && direction == 'forward') {
        //     lookAtObject(cameraTest, curvePositions[19])
        // }
    } else {
        controls.target = artifacts[selectSpot].position
        //  playing = false
        lookAtObject(camera, artifacts[selectSpot])

    }
    camera.lookAt(controls.target)


    controls.update(delta);


    return renderer.render(scene, camera);
};


animate()
