import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import gsap from 'gsap'

// Canvas
const canvas = document.querySelector('canvas.webgl')
// Scene
const scene = new THREE.Scene()
// Object 1
const geometry1 = new THREE.BoxGeometry(0.1, 0.1, 0.1)
const material1 = new THREE.MeshStandardMaterial({ color: 0xfc038c })
const mesh1 = new THREE.Mesh(geometry1, material1)
mesh1.name = 'box1'
mesh1.position.set(17.360, 0, 25.860)
mesh1.scale.set(5.000, 5.000, 5.000)
scene.add(mesh1)
// Object 2
const geometry2 = new THREE.BoxGeometry(0.1, 0.1, 0.1)
const material2 = new THREE.MeshStandardMaterial({ color: 0xfcba03 })
const mesh2 = new THREE.Mesh(geometry2, material2)
mesh2.name = 'box2'
mesh2.position.set(-72.820, 0, 25.86)
mesh2.scale.set(5.000, 5.000, 5.000)
scene.add(mesh2)
// Object 3
const geometry3 = new THREE.BoxGeometry(0.1, 0.1, 0.1)
const material3 = new THREE.MeshStandardMaterial({ color: 0x7703fc })
const mesh3 = new THREE.Mesh(geometry3, material3)
mesh3.name = 'box3'
mesh3.scale.set(5.000, 5.000, 5.000)
mesh3.position.set(-72.820, 0, -109.540)
scene.add(mesh3)
// Object 4
const geometry4 = new THREE.BoxGeometry(0.1, 0.1, 0.1)
const material4 = new THREE.MeshStandardMaterial({ color: 0x1aff00 })
const mesh4 = new THREE.Mesh(geometry4, material4)
mesh4.name = 'box4'
mesh4.position.set(17.360, 0, -109.540)
mesh4.scale.set(5.000, 5.000, 5.000)
scene.add(mesh4)

// Object 5
const geometry5 = new THREE.BoxGeometry(0.1, 0.1, 0.1)
const material5 = new THREE.MeshStandardMaterial({ color: 0x1aff00 })
const mesh5 = new THREE.Mesh(geometry5, material5)
mesh5.name = 'box5'
mesh5.position.set(17.360, 0, -37.480)
mesh5.scale.set(5.000, 5.000, 5.000)
scene.add(mesh5)



// LOOK ATS
const geometry10 = new THREE.BoxGeometry(0.3, 1, 0.3)
const material10 = new THREE.MeshStandardMaterial({ color: 0xff0055 })
const mesh10 = new THREE.Mesh(geometry10, material10)
mesh10.name = 'lookAt1'
mesh10.position.set(-0.070, 2.070, 7.500)
mesh10.scale.set(20.000, 3.000, 17.240)
mesh10.material.wireframe = true
scene.add(mesh10)


const geometry7 = new THREE.BoxGeometry(0.3, 1, 0.3)
const material7 = new THREE.MeshStandardMaterial({ color: 0xff0055 })
const mesh7 = new THREE.Mesh(geometry7, material7)
mesh7.name = 'lookAt2'
mesh7.position.set(-63.670, 1.300, 5.110)
mesh7.scale.set(20.000, 3.000, 17.240)
mesh7.material.wireframe = true
scene.add(mesh7)

const geometry8 = new THREE.BoxGeometry(0.3, 1, 0.3)
const material8 = new THREE.MeshStandardMaterial({ color: 0xff0055 })
const mesh8 = new THREE.Mesh(geometry8, material8)
mesh8.name = 'lookAt3'
mesh8.position.set(-61.620, 1.300, -87.900)
mesh8.scale.set(20.000, 3.000, 17.240)
mesh8.material.wireframe = true
scene.add(mesh8)


const geometry9 = new THREE.BoxGeometry(0.3, 1, 0.3)
const material9 = new THREE.MeshStandardMaterial({ color: 0xff0055 })
const mesh9 = new THREE.Mesh(geometry9, material9)
mesh9.name = 'lookAt4'
mesh9.position.set(0.260, 1.610, -86.610)
mesh9.scale.set(20.000, 3.000, 17.240)
mesh9.material.wireframe = true
scene.add(mesh9)


if (window.location.hash) {
    const geometryTest = new THREE.BoxGeometry(0.3, 1, 0.3)
    const materialTest = new THREE.MeshStandardMaterial({ color: 0xff0055 })
    const meshTest = new THREE.Mesh(geometry9, material9)
    meshTest.position.set(0.260, 1.610, -86.610)
    meshTest.scale.set(20.000, 3.000, 17.240)
    meshTest.material.wireframe = true
    meshTest.name = 'test cam'
    scene.add(meshTest)
}




// box sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
// Load a glTF resource
const loader = new GLTFLoader();
loader.load(
    // resource URL
    './gallery.gltf',
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
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 1000);
scene.add(camera)
// const helper = new THREE.CameraHelper(camera);
// scene.add(helper);



//Create a closed wavey loop
const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(mesh1.position.x, 0, mesh1.position.z),
    new THREE.Vector3(mesh2.position.x, 0, mesh2.position.z),
    new THREE.Vector3(mesh3.position.x, 0, mesh3.position.z),
    new THREE.Vector3(mesh4.position.x, 0, mesh4.position.z),
    new THREE.Vector3(mesh5.position.x, 0, mesh5.position.z),
]);
curve.closed = true;
const points = curve.getPoints(50);
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
// Create the final object to add to the scene
const curveObject = new THREE.Line(geometry, material);
curveObject.closed = true
scene.add(curveObject)
// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    castShadow: true
})
const controls = new OrbitControls(camera, renderer.domElement);
renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true

var classname = document.getElementsByClassName("goTO");
Array.from(classname).forEach((el) => {
    el.addEventListener("click", changeObject);
});


function changeObject(e) {
    playing = true
    selectSpot = e.currentTarget.getAttribute("data-goTo") - 1
    lookAtMesh = e.currentTarget.getAttribute("data-lookAt")
}

// LOOK AT
function lookAtObject(obj) {
    var startRotation = new THREE.Euler().copy(camera.rotation);
    camera.lookAt(obj.position);
    var endRotation = new THREE.Euler().copy(camera.rotation);
    camera.rotation.copy(startRotation);
    // Tween
    gsap.to(camera.rotation, { x: endRotation.x, y: endRotation.y, z: endRotation.z, duration: 1 }).then(() => {
        playing = false
        lookAtMesh = ''

    })
}

var t = 0
var p1 = new THREE.Vector3();
var p2 = new THREE.Vector3();
var lookAt = new THREE.Vector3();
var axis = new THREE.Vector3(0, 0, 0);
var selectSpot = 0
var lookAtMesh = ''
var pos = 0
var playing = false
var camPos = new THREE.Vector3(0, 0, 0); // Holds current camera position
var pos = curve.getPointAt((t + 0.001) % 1, p2);
var pause = false

if (scene.getObjectByName('lookAt1')) {
    camera.lookAt(scene.getObjectByName('lookAt1'))
}

camera.position.set(mesh1.position.x, mesh1.position.y, mesh1.position.z)

const animate = () => {

    if (playing) {
        if (!window.location.hash) {
            if (!window.location.hash) {
                if (camera.position.distanceTo(curve.points[selectSpot]) < 2) {
                    if (scene.getObjectByName(lookAtMesh)) {
                        lookAtObject(scene.getObjectByName(lookAtMesh))
                    }
                } else {
                    t += 0.003;
                    curve.getPointAt(t % 1, p1);
                    curve.getPointAt((t + 0.001) % 1, p2);
                    lookAt.copy(p2).sub(p1).applyAxisAngle(axis, -Math.PI * 0.5).add(p1); // look at the point 90 deg from the path
                    camera.position.copy(p1);
                    camera.lookAt(lookAt);
                    camPos = lookAt
                }
            }
        }else{
            
        }
    }
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    return renderer.render(scene, camera);
}

animate()
