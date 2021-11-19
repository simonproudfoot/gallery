import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import gsap from 'gsap'
import * as dat from 'lil-gui'

const gui = new dat.GUI()




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


// Entrance 
const geometryEntrance = new THREE.BoxGeometry(0.1, 0.1, 0.1)
const materialEntrance = new THREE.MeshStandardMaterial({ color: 0x1aff00 })
const meshEntrance = new THREE.Mesh(geometryEntrance, materialEntrance)
meshEntrance.name = 'Path entrance'
meshEntrance.position.set(17.360, 0, -37.480)
meshEntrance.scale.set(5.000, 5.000, 5.000)
scene.add(meshEntrance)

var distanceBetween = 40
// Artifact 1
const artifact1Geometry = new THREE.BoxGeometry(1, 1, 1)
const artifact1Material = new THREE.MeshStandardMaterial({ color: 0x3d87ff })
const Artifact1 = new THREE.Mesh(artifact1Geometry, artifact1Material)
Artifact1.name = 'Artifact1'
Artifact1.position.set(29, 8, 20)
Artifact1.material.wireframe = true
Artifact1.scale.set(1, 18, 18)
scene.add(Artifact1)
const Artifact1dat = gui.addFolder('Artifact 1')
Artifact1dat.add(Artifact1.position, 'x', "slider").name("Position X");
Artifact1dat.add(Artifact1.position, 'y').name("Position Y");
Artifact1dat.add(Artifact1.position, 'z').name("Position Z");
Artifact1dat.add(Artifact1.scale, 'x').name("Scale X");
Artifact1dat.add(Artifact1.scale, 'y').name("Scale Y");
Artifact1dat.add(Artifact1.scale, 'z').name("Scale Z");
Artifact1dat.close()

// Artifact 2
const artifact2Geometry = new THREE.BoxGeometry(1, 1, 1)
const artifact2Material = new THREE.MeshStandardMaterial({ color: 0xd83dff })
const Artifact2 = new THREE.Mesh(artifact2Geometry, artifact2Material)
Artifact2.name = 'Artifact2'
Artifact2.position.set(29, 8, Artifact1.position.z - distanceBetween)
Artifact2.material.wireframe = true
Artifact2.scale.set(1, 18, 18)
scene.add(Artifact2)
const Artifact2dat = gui.addFolder('Artifact 2')
Artifact2dat.add(Artifact2.position, 'x', "slider").name("Position X");
Artifact2dat.add(Artifact2.position, 'y').name("Position Y");
Artifact2dat.add(Artifact2.position, 'z').name("Position Z");
Artifact2dat.add(Artifact2.scale, 'x').name("Scale X");
Artifact2dat.add(Artifact2.scale, 'y').name("Scale Y");
Artifact2dat.add(Artifact2.scale, 'z').name("Scale Z");
Artifact2dat.close()


// Artifact 2 stopper
const geometry5 = new THREE.BoxGeometry(0.1, 0.1, 0.1)
const material5 = new THREE.MeshStandardMaterial({ color: 0x1aff00 })
const mesh5 = new THREE.Mesh(geometry5, material5)
mesh5.name = 'Artifact2Stopper'
mesh5.position.set(Artifact2.position.x - 20, 0, Artifact2.position.z)
mesh5.scale.set(5.000, 5.000, 5.000)
scene.add(mesh5)


// Artifact 3
const artifact3Geometry = new THREE.BoxGeometry(1, 1, 1)
const artifact3Material = new THREE.MeshStandardMaterial({ color: 0x4dff3d })
const artifact3 = new THREE.Mesh(artifact3Geometry, artifact3Material)
artifact3.name = 'artifact3'
artifact3.position.set(29, 8, Artifact2.position.z - distanceBetween)
artifact3.material.wireframe = true
artifact3.scale.set(1, 18, 18)
scene.add(artifact3)
const artifact3dat = gui.addFolder('Artifact 3')
artifact3dat.add(artifact3.position, 'x', "slider").name("Position X");
artifact3dat.add(artifact3.position, 'y').name("Position Y");
artifact3dat.add(artifact3.position, 'z').name("Position Z");
artifact3dat.add(artifact3.scale, 'x').name("Scale X");
artifact3dat.add(artifact3.scale, 'y').name("Scale Y");
artifact3dat.add(artifact3.scale, 'z').name("Scale Z");
artifact3dat.close()

// Artifact 4
const artifact4Geometry = new THREE.BoxGeometry(1, 1, 1)
const artifact4Material = new THREE.MeshStandardMaterial({ color: 0x03f4fc })
const artifact4 = new THREE.Mesh(artifact4Geometry, artifact4Material)
artifact4.name = 'artifact4'
artifact4.position.set(29, 8, artifact3.position.z - distanceBetween)
artifact4.material.wireframe = true
artifact4.scale.set(1, 18, 18)
scene.add(artifact4)
const artifact4dat = gui.addFolder('Artifact 4')
artifact4dat.add(artifact4.position, 'x', "slider").name("Position X");
artifact4dat.add(artifact4.position, 'y').name("Position Y");
artifact4dat.add(artifact4.position, 'z').name("Position Z");
artifact4dat.add(artifact4.scale, 'x').name("Scale X");
artifact4dat.add(artifact4.scale, 'y').name("Scale Y");
artifact4dat.add(artifact4.scale, 'z').name("Scale Z");
artifact4dat.close()

const artifact5Geometry = new THREE.BoxGeometry(1, 1, 1)
const artifact5Material = new THREE.MeshStandardMaterial({ color: 0x3d87ff })
const artifact5 = new THREE.Mesh(artifact5Geometry, artifact5Material)
artifact5.name = 'artifact5'
artifact5.position.set(-89, 8, 20)
artifact5.material.wireframe = true
artifact5.scale.set(1, 18, 18)
scene.add(artifact5)
const artifact5dat = gui.addFolder('Artifact 5')
artifact5dat.close()
artifact5dat.add(artifact5.position, 'x', "slider").name("Position X");
artifact5dat.add(artifact5.position, 'y').name("Position Y");
artifact5dat.add(artifact5.position, 'z').name("Position Z");
artifact5dat.add(artifact5.scale, 'x').name("Scale X");
artifact5dat.add(artifact5.scale, 'y').name("Scale Y");
artifact5dat.add(artifact5.scale, 'z').name("Scale Z");
artifact5dat.close()

const artifact6Geometry = new THREE.BoxGeometry(1, 1, 1)
const artifact6Material = new THREE.MeshStandardMaterial({ color: 0x3d87ff })
const artifact6 = new THREE.Mesh(artifact6Geometry, artifact6Material)
artifact6.name = 'artifact6'
artifact6.position.set(-89, 8, artifact5.position.z - distanceBetween)
artifact6.material.wireframe = true
artifact6.scale.set(1, 18, 18)
scene.add(artifact6)
const artifact6dat = gui.addFolder('Artifact 6')
artifact6dat.close()
artifact6dat.add(artifact6.position, 'x', "slider").name("Position X");
artifact6dat.add(artifact6.position, 'y').name("Position Y");
artifact6dat.add(artifact6.position, 'z').name("Position Z");
artifact6dat.add(artifact6.scale, 'x').name("Scale X");
artifact6dat.add(artifact6.scale, 'y').name("Scale Y");
artifact6dat.add(artifact6.scale, 'z').name("Scale Z");
artifact6dat.close()


const artifact7Geometry = new THREE.BoxGeometry(1, 1, 1)
const artifact7Material = new THREE.MeshStandardMaterial({ color: 0x03f4fc })
const artifact7 = new THREE.Mesh(artifact7Geometry, artifact7Material)
artifact7.name = 'artifact7'
artifact7.position.set(-89, 8, artifact6.position.z - distanceBetween)
artifact7.material.wireframe = true
artifact7.scale.set(1, 18, 18)
scene.add(artifact7)
const artifact7dat = gui.addFolder('Artifact 7')
artifact7dat.close()
artifact7dat.add(artifact7.position, 'x', "slider").name("Position X");
artifact7dat.add(artifact7.position, 'y').name("Position Y");
artifact7dat.add(artifact7.position, 'z').name("Position Z");
artifact7dat.add(artifact7.scale, 'x').name("Scale X");
artifact7dat.add(artifact7.scale, 'y').name("Scale Y");
artifact7dat.add(artifact7.scale, 'z').name("Scale Z");
artifact7dat.close()


const artifact8Geometry = new THREE.BoxGeometry(1, 1, 1)
const artifact8Material = new THREE.MeshStandardMaterial({ color: 0x3d87ff })
const artifact8 = new THREE.Mesh(artifact8Geometry, artifact8Material)
artifact8.name = 'artifact8'
artifact8.position.set(-89, 8, artifact7.position.z - distanceBetween)
artifact8.material.wireframe = true
artifact8.scale.set(1, 18, 18)
scene.add(artifact8)
const artifact8dat = gui.addFolder('Artifact 8')
artifact8dat.close()
artifact8dat.add(artifact8.position, 'x', "slider").name("Position X");
artifact8dat.add(artifact8.position, 'y').name("Position Y");
artifact8dat.add(artifact8.position, 'z').name("Position Z");
artifact8dat.add(artifact8.scale, 'x').name("Scale X");
artifact8dat.add(artifact8.scale, 'y').name("Scale Y");
artifact8dat.add(artifact8.scale, 'z').name("Scale Z");
artifact8dat.close()


function getMouse(event) { event.preventDefault(); var rect = container.getBoundingClientRect(); mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1; mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1; }

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
const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 1, 1000);
camera.position.set(-0.603, 1.955, 29.095)
camera.rotation.y = Math.PI / 2
scene.add(camera)
//Create a closed wavey loop
const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(mesh1.position.x, 0, mesh1.position.z),
    new THREE.Vector3(mesh2.position.x, 0, mesh2.position.z),
    new THREE.Vector3(mesh3.position.x, 0, mesh3.position.z),
    new THREE.Vector3(mesh4.position.x, 0, mesh4.position.z),
    new THREE.Vector3(mesh5.position.x, 0, mesh5.position.z),
]);
curve.closed = true

const points = curve.getPoints(50);
console.log(curve.points)
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

renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true

var classname = document.getElementsByClassName("goTO");
Array.from(classname).forEach((el) => {
    el.addEventListener("click", changeObject);
});


function changeObject(e) {
    playing = true
    direction = e.currentTarget.getAttribute("data-goTo") < selectSpot ? 'backward' : 'forward'
    selectSpot = e.currentTarget.getAttribute("data-goTo")
    lookAtMesh = e.currentTarget.getAttribute("data-lookAt")
}

// LOOK AT
function lookAtObject(obj) {
    var item = scene.getObjectByName(lookAtMesh)
    var startRotation = new THREE.Euler().copy(camera.rotation);
    camera.lookAt(item.position);
    var endRotation = new THREE.Euler().copy(camera.rotation);
    camera.rotation.copy(startRotation);
    // Tween
    gsap.to(camera.rotation, { x: endRotation.x, y: endRotation.y, z: endRotation.z, duration: 1 }).then(() => {
        //  playing = false
    })
}



function moveAlong() {
    // BASIC
    console.log(direction)
    direction == 'forward' ? t += 0.003 : t -= 0.003

    pos = curve.getPointAt(t);
    camera.position.set(pos.x, pos.y, pos.z);
    

    // t += 0.003;
    // curve.getPointAt(t % 1, p1);
    // curve.getPointAt((t + 0.001) % 1, p2);
    // lookAt.copy(p2).sub(p1).applyAxisAngle(axis, -Math.PI * 0.5).add(p1); // look at the point 90 deg from the path
    // camera.position.copy(p1);
    // camera.lookAt(lookAt);
    // camPos = lookAt
}
var direction = 'forward'
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
//const controls = new OrbitControls(camera, renderer.domElement);


//camera.lookAt
const animate = () => {
    console.log(camera.position.distanceTo(curve.points[2]))

    if (camera.position.distanceTo(curve.points[selectSpot]) > 2) {
        moveAlong()
        lookAtObject()
    }


    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    return renderer.render(scene, camera);
}

animate()
