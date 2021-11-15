import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { VectorKeyframeTrack } from 'three'
// Canvas
const canvas = document.querySelector('canvas.webgl')
// Scene
const scene = new THREE.Scene()
// Object 1
const geometry1 = new THREE.BoxGeometry(0.3, 1, 0.3)
const material1 = new THREE.MeshStandardMaterial({ color: 0xfc038c })
const mesh1 = new THREE.Mesh(geometry1, material1)
mesh1.name = 'box1'
mesh1.position.set(17.360, 0, 25.860)
mesh1.scale.set(5.810, 15.190, 5.000)
scene.add(mesh1)
// Object 2
const geometry2 = new THREE.BoxGeometry(0.3, 1, 0.3)
const material2 = new THREE.MeshStandardMaterial({ color: 0xfcba03 })
const mesh2 = new THREE.Mesh(geometry2, material2)
mesh2.name = 'box2'
mesh2.position.set(-72.820, 0, 25.86)
mesh2.scale.set(5.810, 15.190, 5.000)
scene.add(mesh2)
// Object 3
const geometry3 = new THREE.BoxGeometry(0.3, 1, 0.3)
const material3 = new THREE.MeshStandardMaterial({ color: 0x7703fc })
const mesh3 = new THREE.Mesh(geometry3, material3)
mesh3.name = 'box3'
mesh3.scale.set(5.810, 15.190, 5.000)
mesh3.position.set(-72.820, 0, -109.540)
scene.add(mesh3)
// Object 4
const geometry4 = new THREE.BoxGeometry(0.3, 1, 0.3)
const material4 = new THREE.MeshStandardMaterial({ color: 0x1aff00 })
const mesh4 = new THREE.Mesh(geometry4, material4)
mesh4.name = 'box4'
mesh4.position.set(17.360, 0, -109.540)
mesh4.scale.set(5.810, 15.190, 5.000)
scene.add(mesh4)
// Object 5
const geometry6 = new THREE.BoxGeometry(0.3, 1, 0.3)
const material6 = new THREE.MeshStandardMaterial({ color: 0x1aff00 })
const mesh6 = new THREE.Mesh(geometry6, material6)
mesh6.name = 'box6'
mesh6.position.set(17.360, 0, -37.480)
mesh6.scale.set(5.810, 15.190, 5.000)
scene.add(mesh6)
// MOVE ME -- TEST
const geometry5 = new THREE.BoxGeometry(0.3, 0.3, 0.3)
const material5 = new THREE.MeshStandardMaterial({ color: 0x1aff00 })
const mesh5 = new THREE.Mesh(geometry5, material5)
mesh5.name = 'MoveMe'
mesh5.position.set(4, 0, -4)
mesh5.scale.set(20, 20, 20)
scene.add(mesh5)
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
// var light = new THREE.SpotLight(0xffa95c,4);
// light.position.set(-50,50,50);
// light.castShadow = true;
// scene.add( light );
// light.shadow.bias = -0.0001;
// light.shadow.mapSize.width = 1024*4;
// light.shadow.mapSize.height = 1024*4;
// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 1000);
camera.position.z = 5
camera.position.y = 1
scene.add(camera)
//Create a closed wavey loop
const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(mesh1.position.x, 0, mesh1.position.z),
    new THREE.Vector3(mesh2.position.x, 0, mesh2.position.z),
    new THREE.Vector3(mesh3.position.x, 0, mesh3.position.z),
    new THREE.Vector3(mesh4.position.x, 0, mesh4.position.z),
    new THREE.Vector3(mesh6.position.x, 0, mesh6.position.z),
    //new THREE.Vector3( mesh1.position.x, 0, mesh1.position.z ),
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
//const controls = new OrbitControls(camera, renderer.domElement);
renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true
var t = 0
var p1 = new THREE.Vector3();
var p2 = new THREE.Vector3();
var lookAt = new THREE.Vector3();
var axis = new THREE.Vector3(0, 0, 0);
var percentage = 0;
var stopAt = mesh2.position
var selectSpot = 3
var pos = 0
const animate = () => {
    requestAnimationFrame(animate);
    // TEST BOX FOLLOW
    // camera.lookAt(scene.getObjectByName('Cube011').position)
    // if (Math.round(curve.points[selectSpot].x * 10) / 10 == Math.round(pos.x * 10) / 10 && Math.round(curve.points[selectSpot].z * 10) / 10 == Math.round(pos.z * 10) / 10) {
    //     camera.lookAt(scene.getObjectByName('Cube011').position)
    // } else {
    //     pos = curve.getPointAt(t)
    //     t += 0.004;
    //     camera.position.set(pos.x, pos.y, pos.z);
    // }
    // TEST END
    // CAMERA FOLLOW
    var pos = curve.getPointAt((t + 0.001) % 1, p2);
    if (Math.round(curve.points[selectSpot].x * 10) / 10 == Math.round(pos.x * 10) / 10 && Math.round(curve.points[selectSpot].z * 10) / 10 == Math.round(pos.z * 10) / 10) {
        camera.lookAt(scene.getObjectByName('Cube011').position)
    } else {
        t += 0.004;
        curve.getPointAt(t % 1, p1);
        curve.getPointAt((t + 0.001) % 1, p2);
        lookAt.copy(p2).sub(p1).applyAxisAngle(axis, -Math.PI * 0.5).add(p1); // look at the point 90 deg from the path
        camera.position.copy(p1);
        camera.lookAt(lookAt);
    }
    renderer.render(scene, camera);
    return renderer.render(scene, camera);
}
animate()
