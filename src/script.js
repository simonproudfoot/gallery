import './style.scss'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import CameraControls from 'camera-controls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
CameraControls.install({ THREE: THREE });
import { makeTextSprite } from './makeTextSprite.js'
import { enterDoor } from './animations.js'
import woodenFloor from './images/Wood_Floor_006_COLOR.jpg'
import woodenFloorBump from './images/Wood_Floor_006_DISP.png'
import { RenderPass, EffectComposer, OutlinePass } from "three-outlinepass"
import positions from './positions.json'
import gsap from 'gsap';
import * as dat from 'dat.gui';
const axios = require('axios').default;
const loader = new GLTFLoader();
let testing = false;
function getThemeDir() {
    var scripts = document.getElementsByTagName('script'),
        index = scripts.length - 1,
        myScript = scripts[index];
    return myScript.src.replace(/themes\/(.*?)\/(.*)/g, 'themes/$1');
}
var themeDir = getThemeDir();
const afcUrl = process.env.NODE_ENV == 'production' ? window.location.href.split('#')[0] + '/wp-json/acf/v3/options/acf-options-gallery' : 'http://localhost:8888/npht/wp-json/acf/v3/options/acf-options-gallery'
let database;
const backButton = document.getElementById('goback')
const left = document.getElementById('left')
const right = document.getElementById('right')
//const pos = document.getElementById('pos')
const loading = document.getElementById('loading')
const start = document.getElementById('start')
const textureLoader = new THREE.TextureLoader()
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
const colors = ['#fffdf9', '#5bb5e7', '#159d74', '#d25e1a', '#ca7aa7', '#1074af', '#159d74', '#f5bb4a']
var delta;
var playing = false
var intro = false
var started = false
var clock = new THREE.Clock();
let infoWindowOpen = false
var t = 0
var ready;
var last = {}
var lastTarget;
let selectSpot = null
var camSpeed = -0.3
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
//const positions = [{ "x": 29, "y": 8, "z": -118 }, { "x": 29, "y": 8, "z": -86 }, { "x": 29, "y": 8, "z": -54 }, { "x": 29, "y": 8, "z": -22 }, { "x": 29, "y": 8, "z": 10 }, { "x": 20, "y": -2.5, "z": 42 }, { "x": 20, "y": -2.5, "z": 74 }, { "x": 20, "y": -2.5, "z": 106 }, { "x": 20, "y": -2.5, "z": 138 }, { "x": 20, "y": -2.5, "z": 170 }, { "x": -89.56, "y": 8, "z": 178 }, { "x": -89.56, "y": 8, "z": 146 }, { "x": -89.56, "y": 8, "z": 114 }, { "x": -89.56, "y": 8, "z": 82 }, { "x": -89.56, "y": 8, "z": 50 }, { "x": -83, "y": -2.5, "z": 18 }, { "x": -83, "y": -2.5, "z": -14 }, { "x": -83, "y": -2.5, "z": -46 }, { "x": -83, "y": -2.5, "z": -78 }, { "x": -83, "y": -2.5, "z": -110 }]
let artifacts = []
let sprites = []
let infoPoints = []
var offset = 0
var x = 10
var i = 1
let gui = null
let showSettings = false
if (window.location.hash.substr(1).length && window.location.hash.substr(1) == 'settings') {
    gui = new dat.GUI();
    showSettings = true
    document.getElementById('welcomeScreen').style.display = 'none';
    intro = true
    started = true
}
if (window.location.hash.substr(1).length && window.location.hash.substr(1) == 'test') {
    testing = true
    document.getElementById('controls').style.display = 'none'
    document.getElementById('testmode').style.display = 'block'
    document.getElementById('welcomeScreen').style.display = 'none';
}
// remove positons button
// if (!testing) {
//     pos.style.display = 'none'
// }
// FLOOR
const colorTexture = textureLoader.load(woodenFloor)
const bumpmap = textureLoader.load(woodenFloorBump)
colorTexture.wrapS = THREE.RepeatWrapping
colorTexture.wrapT = THREE.RepeatWrapping
colorTexture.repeat.x = 20
colorTexture.repeat.y = 11
colorTexture.rotation = Math.PI / 2
//console.log(colorTexture)
bumpmap.wrapS = THREE.RepeatWrapping
bumpmap.wrapT = THREE.RepeatWrapping
bumpmap.repeat.x = 20
bumpmap.repeat.y = 11
bumpmap.rotation = Math.PI / 2
const geometry = new THREE.PlaneBufferGeometry(150, 600);
const material = new THREE.MeshPhysicalMaterial({ map: colorTexture })
material.displacementMap = bumpmap
const floor = new THREE.Mesh(geometry, material);
floor.rotation.set(-Math.PI / 2, 0, 0)
floor.position.set(-25, -6.5, 0)
floor.name = 'floor'
scene.add(floor);
if (!testing) {
    const ceilingMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, color: '#171616' })
    ceilingMaterial.displacementMap = bumpmap
    const ceiling = new THREE.Mesh(geometry, ceilingMaterial);
    ceiling.rotation.set(-Math.PI / 2, 0, 0)
    ceiling.position.set(-25, 24.210, 0)
    ceiling.name = 'ceiling'
    scene.add(ceiling);
}
// CREATE OBJECTS ON LONG
// positions.forEach(element => {
//     let infoPoint = new THREE.Mesh(infoPointGeometry, infoPointMaterial);
//     // if (i <= 5 || i > 10 && i < 16) {
//     //     var newArtifact = new THREE.Mesh(wallMountedGeometry, material1);
//     //     newArtifact.name = 'Wallmount-' + i
//     //     newArtifact.position.copy(element)
//     //     newArtifact.userData.pedistal = false
//     //     infoPoint.position.copy(element)
//     //     infoPoint.position.z = newArtifact.position.z + 13
//     //     infoPoint.rotation.y = Math.PI / 2
//     // }
//     // else {
//            // newArtifact.name = 'position-' + i +'-'+ element.info
//         // newArtifact.position.y = -2.5 // touch floor
//         // newArtifact.userData.pedistal = true
//     //     infoPoint.position.copy(element)
//     //     infoPoint.position.x = +3
//     //     infoPoint.position.z = newArtifact.position.z + 8
//     //     infoPoint.position.y = 2
//     //     infoPoint.rotation.y = Math.PI / 2
//     // //}
//     // infoPoint.position.y = 10
//     // if (i > 10) {
//     //     newArtifact.rotation.y = Math.PI
//     //     infoPoint.position.x = 0
//     //     infoPoint.position.x = -90
//     // }
//     // else {
//     //     infoPoint.position.x = +30
//     // }
//     // makeSprite(newArtifact.position.copy(element), newArtifact.name, newArtifact.position)
//    // infoPoints.push(infoPoint)
//    // artifacts.push(newArtifact)
//    // scene.add(newArtifact)
//    // scene.add(infoPoint)
//     i++
// });
const ambientLight = new THREE.HemisphereLight(
    0xFFFFFF, // bright sky color
    0xe0d3af, // dim ground color
    0.8, // intensity
);
scene.add(ambientLight)
// Load a glTF resource
var galleryModelUrl = process.env.NODE_ENV !== 'production' ? './gallery_extended.gltf' : themeDir + '/dist/gallery_extended.gltf'
loader.load(galleryModelUrl, function (gltf) {
    gltf.scene.scale.set(0.05, 0.05, 0.05)
    // remove from model later 
    gltf.scene.getObjectByName('Cube011').visible = false
    gltf.scene.getObjectByName('Cube011_1').visible = false
    gltf.scene.getObjectByName('Cube012').visible = false
    gltf.scene.getObjectByName('Cube012_1').visible = false
    gltf.scene.getObjectByName('Cube014').visible = false
    gltf.scene.getObjectByName('Cube014_1').visible = false
    gltf.scene.getObjectByName('Cube015').visible = false
    gltf.scene.getObjectByName('Cube015_1').visible = false
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
        //((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // called when loading has errors
    function (error) {
        console.log('An error happened' + error);
    }
);
// Create bounding box for pedistal items to fit into
const boundingBoxGeom = new THREE.Mesh(
    new THREE.BoxGeometry(5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
);
boundingBoxGeom.visible = false
scene.add(boundingBoxGeom);
// ADD THE USERS artifacts
await axios.get(afcUrl)
    .then(function (response) {
        database = response.data.acf.artifacts
    })
    .catch(function (error) {
        console.log(error);
    })
    .then(function () {
        loadartifacts()
    });
// MOVE ALONG
document.getElementById("left").addEventListener("click", sideMoves);
document.getElementById("right").addEventListener("click", sideMoves);
function sideMoves(event) {
    const cur = selectSpot - 1
    if (event.target.id == 'left') {
        artifacts.forEach((element, i) => {
            if (element.userData.location == cur) {
                const prev = i - 1
                console.log('prev name', artifacts[prev].name)
                console.log('prev to', artifacts[prev].userData.location)
                selectSpot = artifacts[prev].userData.location + 1
            }
        });
    }
    if (event.target.id == 'right') {
        artifacts.forEach((element, i) => {
            if (element.userData.location == cur) {
                const next = i + 1
                selectSpot = artifacts[next].userData.location + 1
            }
        });
    }
    lookAtArtifact()
}
// INFO WINDOW
document.getElementById("infoClose").addEventListener("click", closeInfoWindow);
function closeInfoWindow() {
    const infoWin = document.getElementById('infoWindow')
    gsap.to(infoWin, { display: 'none', scale: 0.3, x: 400, opacity: 0, duration: 0.3 })
    infoWindowOpen = false
    if (selectSpot) {
        showArrows()
    }
}
//welcomeMessage
function welcomeMessage() {
    sprites.forEach(x => x.visible = true)
    document.getElementById('menuButton').style.display = 'block'
}
const infoPointGeometry = new THREE.PlaneBufferGeometry(3, 5);
const infoPointMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, color: '#000' })
function makeInfoPoint(location, wallmount) {
    let infoPoint = new THREE.Mesh(infoPointGeometry, infoPointMaterial);
    infoPoint.position.copy(positions[location])
    infoPoint.position.y = 10
    if (between(location, 0, 9)) {
        infoPoint.name = 'infoPoint' + location
        if (wallmount) {
            infoPoint.position.z += 5
        }
        infoPoint.position.x = 30
        infoPoint.position.z += 8
        infoPoint.rotation.y = Math.PI / 2
        // infoPoint.position.x 
    }
    if (between(location, 9, 16)) {
        infoPoint.position.z = 212
        if (wallmount) {
            infoPoint.position.x -= 13
        } else {
            infoPoint.position.x -= 8
        }
    }
    if (between(location, 15, 20)) {
        infoPoint.rotation.y = Math.PI / 2
        infoPoint.position.x = -89.380

        if (wallmount) {
            infoPoint.position.z -= 13

        } else {
            infoPoint.position.z -= 8

        }
    }
    infoPoints.push(infoPoint)
    scene.add(infoPoint)
}
function makeSprite(location, position, i) {
    var ranHex = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
    var spritey = makeTextSprite('', colors[i]);
    spritey.userData.id = parseInt(location)
    if (!testing) { spritey.visible = false }
    spritey.position.copy(position)
    if (between(location, 0, 9)) {
        spritey.position.x -= 10
    }
    if (between(location, 9, 16)) {
        spritey.position.z -= 10
    }
    if (between(location, 15, 20)) {
        spritey.position.x += 5
    }
    sprites.push(spritey)
    scene.add(spritey);
}
function makeClickSprite(position, location) {
    var ranHex = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
    var spritey = makeTextSprite(0xFFFFFF);
    spritey.position.copy(position)
    if (location <= 10) {
        spritey.position.x -= 3
    } else {
        spritey.position.x += 3
    }
    //    sprites.push(spritey)
    makeClickSprite = spritey.name = 'selectedSprite-' + location
    clickHere = spritey.namema
    scene.add(spritey);
}
function makeLight(location, position) {
    const rectAreaLight = new THREE.RectAreaLight(0xffffff, 5, 5, 30)
    rectAreaLight.position.copy(position)
    rectAreaLight.position.y += 20
    if (between(location, 0, 9)) {
        rectAreaLight.rotation.y = -Math.PI / 2
        rectAreaLight.position.x -= 20
    }
    if (between(location, 9, 16)) {
        rectAreaLight.rotation.y = -Math.PI
        rectAreaLight.position.z -= 15
    }
    if (between(location, 15, 20)) {
        rectAreaLight.rotation.y = Math.PI / 2
        rectAreaLight.position.x += 20
    }
    rectAreaLight.name = 'light-' + location
    scene.add(rectAreaLight)
}
function makeMenuItem(title, position, i) {
    // add items to menu
    var modList = document.getElementById('menuItems')
    var newLI = document.createElement('li');
    var newSprite = document.createElement('span');
    newLI.classList.add('text-white')
    newLI.classList.add('selectTargets')
    newLI.setAttribute("id", 'artifact-' + position);
    newLI.setAttribute("data-artifact", +position);
    newLI.appendChild(document.createTextNode(title + '-' + i));
    modList.appendChild(newLI);
    //  newLI.style.color = colors[i]
    newSprite.style.borderColor = colors[i]
    newLI.appendChild(newSprite)
    document.getElementById('artifact-' + position).addEventListener("click", selectObjectFromMenu);
}
function between(x, min, max) {
    return x >= min && x <= max;
}
function calcPesistalPosition(position, location) {
    if (between(location, 0, 9)) {
        position.x -= 10
    }
    if (between(location, 9, 16)) {
        position.z -= 10
    }
    if (between(location, 15, 20)) {
        //   alert('moe me ')
        position.x += 10
    }
    return position
}
function calcWallmountRotation(location) {
    var rotation;
    if (between(location, 0, 9)) {
        rotation = 0
    }
    if (between(location, 9, 16)) {
        rotation = Math.PI / 2
    }
    if (between(location, 15, 20)) {
        rotation = 0
    }
    return rotation
}
function makePedistal(position, location) {
    // create a pedistal
    var newArtifact = new THREE.Mesh(pedestalGeometry, material1);
    newArtifact.position.copy(position)
    newArtifact.position.copy(calcPesistalPosition(position, location))
    newArtifact.position.y = -2.2 // sit on floot
    scene.add(newArtifact)
}
function makeWallMount(location) {
    // create a pedistal
    const position = positions[location]
    var newWallmount = new THREE.Mesh(wallMountedGeometry, material1);
    newWallmount.position.set(position.x, position.y + 8, position.z)
    newWallmount.rotation.y = calcWallmountRotation(location)
    scene.add(newWallmount)
    return newWallmount
}
console.log(database)
function loadartifacts(params) {
    database.sort((a, b) => parseFloat(a.location) - parseFloat(b.location)).forEach(async (element, i) => {
        // LOAD artifactsf
        var location = parseInt(element.location) - 1
        var selected = positions[location]
        if (element.is_model) {
            const loadedArtifact = await loader.loadAsync(element['3d_model_']['url']);
            var boundingBox = new THREE.Box3().setFromObject(loadedArtifact.scene);
            let boundingBoxSize = boundingBox.getSize(new THREE.Vector3());
            const center = boundingBox.getCenter(new THREE.Vector3());
            boundingBox.center.y = 0
            let maxAxis = Math.max(boundingBoxSize.x, boundingBoxSize.y, boundingBoxSize.z);
            loadedArtifact.scene.scale.multiplyScalar(10 / maxAxis);
            loadedArtifact.scene.position.copy(selected)

            loadedArtifact.scene.position.copy(calcPesistalPosition(loadedArtifact.scene.position, location))
            loadedArtifact.scene.userData.pedistal = true
            loadedArtifact.scene.name = element.artifact_title
            if (showSettings) {
                const itemFolder = gui.addFolder(element.artifact_title)
                itemFolder.add(loadedArtifact.scene.rotation, 'y', 0, Math.PI * 2).name('Rotate');
                itemFolder.add(loadedArtifact.scene.position, 'y', 0, 20).name('Up/Down');
            }
            loadedArtifact.scene.position.y = element.model_position ? element.model_position : 5
            loadedArtifact.scene.rotation.y = element.model_rotate ? element.model_rotate : 0

            loadedArtifact.scene.userData.id = location
            loadedArtifact.scene.userData.pedistal = true
            loadedArtifact.scene.userData.index = i
            loadedArtifact.scene.userData.location = location

            artifacts.push(loadedArtifact.scene)
            scene.add(loadedArtifact.scene)

            makePedistal(selected, location) // position, i
            makeLight(location, selected)
            makeSprite(location, loadedArtifact.scene.position, i)
            makeMenuItem(element.artifact_title, location, location)
            makeInfoPoint(location)
        }
        // LOAD IMAGES
        else {
            let mount = makeWallMount(location) // position
            mount.userData.id = location
            mount.userData.pedistal = false
            mount.userData.index = i
            mount.userData.location = location
            mount.name = element.artifact_title
            textureLoader.load(element.image.url, (tex) => {
                // tex and texture are the same in this example, but that might not always be the case
                tex.name = 'image-' + element.artifact_title
                var cloned = mount.material.clone()
                cloned.map = tex
                mount.material = cloned
                makeLight(location, mount.position)
                makeSprite(location, mount.position, i)
                makeMenuItem(element.artifact_title, element.location, i)
                makeInfoPoint(location, selected, true)
                var imgSize = tex.image.height / tex.image.width
                var maxHeight = 1.3
                if (imgSize > maxHeight) {
                    var diff = Math.abs(imgSize - maxHeight)
                    imgSize -= diff
                }
                mount.scale.set(1.0, imgSize, 1.0);
                artifacts.push(mount)
                //mount.visible = false
            });
        }
        // finished
        if (i == database.length - 1) {
            start.style.display = 'block'
            loading.style.display = 'none'
            console.log(artifacts)
        }
    })
}
// Camera
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 1, 1000);
scene.add(camera)
if (testing) {
    camera.position.y = 400
}
// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    castShadow: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.physicallyCorrectLights = true
// CLICK ON OBJECTS
function selectObjectFromMenu() {
    const open = document.getElementById('menu').classList.contains('open')
    if (open) {
        closeMenu()
    }
    showArrows()
    selectSpot = event.target.attributes['data-artifact'].value
}
function onDocumentMouseDown(event) {
    if (!event.target.classList.contains('allowClick')) {
        event.preventDefault();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        var intersectsInfo = raycaster.intersectObjects(infoPoints);
        var intersects = raycaster.intersectObjects(sprites);
        if (intersects.length > 0) {
            // outlinePass.selectedObjects = artifacts
            for (var i = 0; intersects.length > 0 && i < intersects.length; i++) {
                showArrows()
                selectSpot = parseInt(intersects[0].object.userData.id + 1)

            }
        }
        else if (intersectsInfo.length > 0 && selectSpot) {
            openInfoWindow(database, selectSpot)
        } else {
            sprites.forEach(x => x.visible = true)
        }
    }
}
// outline effetct
var compose = new EffectComposer(renderer);
var renderPass = new RenderPass(scene, camera);
var outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
outlinePass.renderToScreen = true;
compose.addPass(renderPass);
compose.addPass(outlinePass);
var params = {
    edgeStrength: 1,
    edgeGlow: 4,
    edgeThickness: 0.5,
    pulsePeriod: 3,
};
outlinePass.edgeStrength = params.edgeStrength;
outlinePass.edgeGlow = params.edgeGlow;
outlinePass.visibleEdgeColor.set(0xffffff);
outlinePass.hiddenEdgeColor.set(0xffffff);
compose.render(scene, camera)
let hoverSpot = ''
console.log(outlinePass)
document.addEventListener('mousemove', onMouseMove, false);
function onMouseMove(event) {
    sprites.forEach(i => i.material.color.set(0xffffff));
    if (!intro && !selectSpot) {
        // calculate mouse position in normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        var intersects = raycaster.intersectObjects(sprites);
        // var intersectsA = raycaster.intersectObjects(infoPoints);
        // if (intersectsA.length > 0) {
        //    alert('ds')
        // } 
        if (intersects.length > 0) {
            document.body.style.cursor = "pointer";
            for (var i = 0; intersects.length > 0 && i < intersects.length; i++) {
                var hoverSpot = parseInt(intersects[0].object.userData.id)

                artifacts.forEach((element, i) => {

                    if (element.userData.id == hoverSpot) {
                        outlinePass.selectedObjects.push(element)
                    }
                    else {

                        outlinePass.selectedObjects.splice(i, 1);
                    }
                })
                intersects[i].object.material.color.set(0xff0000);
            }
        } else {
            document.body.style.cursor = "default";
            outlinePass.selectedObjects = []
        }
    }
}
// Which camera should we use?
const cameraControls = testing ? new OrbitControls(camera, renderer.domElement) : new CameraControls(camera, renderer.domElement)
// listeners
document.getElementById("goback").addEventListener("click", turnAround);
document.addEventListener('mousedown', onDocumentMouseDown, false);
document.getElementById("start").addEventListener("click", beginTour);
function beginTour(params) {
    enterDoor()
    setTimeout(() => {
        started = true
        intro = true
        document.getElementById("welcomeScreen").style.display = 'none'
        //   selectSpot = 1
    }, 400);
}
if (!testing) {
    cameraControls.minDistance = 0;
    cameraControls.azimuthRotateSpeed = camSpeed; // negative value to invert rotation direction
    cameraControls.polarRotateSpeed = camSpeed; // negative value to invert rotation direction
    cameraControls.minZoom = 1;
    //cameraControls.draggingDampingFactor = 0.01;
    cameraControls.maxZoom = 1;
    cameraControls.mouseButtons.wheel = CameraControls.ACTION.ZOOM;
    cameraControls.touches.two = CameraControls.ACTION.TOUCH_ZOOM_TRUCK;
    cameraControls.enabled = false
    cameraControls.minPolarAngle = Math.PI / 2
    cameraControls.maxPolarAngle = Math.PI / 2
    cameraControls.saveState();
} else {
    cameraControls.target.set(0.5, 1, .5)
    //cameraControls.update()
}
// inital view
camera.lookAt(new THREE.Vector3(1, 0, 0))
// CREATE A BOX TO FOLLOW
const cameraStand = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
);
scene.add(cameraStand);
cameraStand.geometry.computeBoundingBox();
cameraStand.visible = true
const meshBBSize = cameraStand.geometry.boundingBox.getSize(new THREE.Vector3());
const meshBBWidth = meshBBSize.x;
const meshBBHeight = meshBBSize.y;
const meshBBDepth = meshBBSize.z;
function customFitTo() {
    const distanceToFit = cameraControls.getDistanceToFitBox(meshBBWidth, meshBBHeight, meshBBDepth);
    ///alert(distanceToFit)
    cameraControls.moveTo(
        cameraStand.position.x,
        cameraStand.position.y,
        cameraStand.position.z + distanceToFit,
        true
    );
}
if (!testing) {
    cameraControls.setPosition(0, 0, -230)
}
async function startTour() {
    await cameraControls.setPosition(0, 0, 0, true);
    intro = false
    ready = true
    cameraControls.enabled = true
    welcomeMessage()
    return true
}
var nextPos = {}
async function lookAtArtifact(params) {
    if (selectSpot) {
        const location = selectSpot - 1
        // console.log(location)
        artifacts.forEach(element => {
            //console.log('obj',element.userData.location)
            if (element.userData.location == location) {
                nextPos.x = element.position.x
                nextPos.y = 2
                nextPos.z = element.position.z
            }
        })
    }
    if (between(selectSpot, 0, 9)) {
        cameraStand.position.set(nextPos.x - 30, nextPos.y, nextPos.z)
        if (!testing) {
            await cameraControls.setLookAt(cameraStand.position.x, 2, cameraStand.position.z, nextPos.x, nextPos.y, nextPos.z, true)
        }
    }
    if (between(selectSpot, 9, 16)) {
        cameraStand.position.set(nextPos.x, nextPos.y, nextPos.z - 30)
        if (!testing) {
            await cameraControls.setLookAt(cameraStand.position.x, 2, cameraStand.position.z, nextPos.x, nextPos.y, nextPos.z, true)
        }
    }
    if (between(selectSpot, 15, 20)) {
        cameraStand.position.set(nextPos.x + 30, nextPos.y, nextPos.z)
        if (!testing) {
            await cameraControls.setLookAt(cameraStand.position.x, 2, cameraStand.position.z, nextPos.x, nextPos.y, nextPos.z, true)
        }
    }
    //   outlinePass.selectedObjects = infoPoints
    backButton.style.display = 'block'
    left.style.display = 'block'
    right.style.display = 'block'
    // }
}
async function turnAround() {
    hideArrows()
    if (!testing) {
        await cameraControls.setLookAt(cameraStand.position.x, cameraStand.position.y, cameraStand.position.z, 0, 2, 0, true)
    }
    selectSpot = null
}
const animate = () => {
    // INTRO - WALK INTO ROOM
    if (intro && started) {
        startTour()
    } else if (selectSpot) {
        lookAtArtifact()
    }
    spriteOff()
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);
    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();
    const updated = cameraControls.update(delta);
    requestAnimationFrame(animate);
    if (!testing) {
        customFitTo()
    }
    return compose.render(scene, camera) && renderer.render(scene, camera);
    // return renderer.render(scene, camera);
};
animate()
// unhide doc
document.body.style.display = 'block'
// open menu
const menu = document.getElementById('menu')
const icons = document.querySelectorAll('.icon');
icons.forEach(icon => {
    icon.addEventListener('click', (event) => {
        icon.classList.toggle("open");
        menu.classList.toggle("open");
        if (menu.classList.contains('open')) {
            gsap.fromTo(menu, { opacity: 0, x: 300, duration: 0.5, display: 'none' }, { opacity: 1, x: 0, display: 'block' })
        } else {
            closeMenu()
        }
    });
});
function closeMenu() {
    gsap.fromTo(menu, { opacity: 1, x: 0, display: 'block', duration: 0.5 }, { opacity: 0, x: 300, display: 'none' })
    icons.forEach(icon => {
        icon.classList.remove("open");
    })
}
function openInfoWindow() {
    let footer = document.getElementById('infoWindow__footer')
    let contentTitle = ''
    let contentDisc = ''
    let next = {}
    if (database.find(x => x.is_model) && database.find(x => x.location == selectSpot)) {
        contentTitle = database.find(x => x.location == selectSpot).artifact_title
        contentDisc = database.find(x => x.location == selectSpot).artifact_description
        next.title = database.find(x => x.location == selectSpot + 1) ? database.find(x => x.location == selectSpot + 1).artifact_title : ''
    }
    if (database.find(x => x.is_model == false) && database.find(x => x.location == selectSpot)) {
        contentTitle = database.find(x => x.location == selectSpot).artifact_title
        contentDisc = database.find(x => x.location == selectSpot).artifact_description
        next.title = database.find(x => x.location == selectSpot + 1) ? database.find(x => x.location == selectSpot + 1).artifact_title : ''
    }
    const infoWin = document.getElementById('infoWindow')
    const title = document.getElementById('infoTitle')
    const disc = document.getElementById('infoDisc')
    const nextStory = document.getElementById('nextStory')
    disc.innerHTML = contentDisc
    title.innerHTML = contentTitle
    if (next.title) {
        footer.style.display = 'block'
        nextStory.innerHTML = next.title
        nextStory.setAttribute("data-artifact", +selectSpot + 1);
        nextStory.addEventListener("click", selectObjectFromMenu);
    } else {
        footer.style.display = 'none'
    }
    gsap.fromTo(infoWin, { display: 'none', scale: 0.3, x: 400, opacity: 0, duration: 1.5 }, { display: 'block', x: 0, scale: 1, opacity: 1 })
    hideArrows()
    infoWindowOpen = true
}
function showArrows() {
    gsap.to('#left', { x: 0, opacity: 1, duration: 1 })
    gsap.to('#right', { x: 0, opacity: 1, duration: 1 })
    gsap.to('#goback', { y: 0, opacity: 1, duration: 1 })
}
function hideArrows() {
    gsap.to('#left', { x: -100, opacity: 0, duration: 1 })
    gsap.to('#right', { x: 100, opacity: 0, duration: 1 })
    gsap.to('#goback', { y: 100, opacity: 0, duration: 1 })
}
document.getElementById("infoWindow__footer").addEventListener("click", closeInfoWindow);
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function spriteOff() {
    sprites.forEach(sprite => {
        let distance = cameraStand.position.distanceTo(sprite.position)
        if (distance < 30) {
            // console.log(cameraStand.position.distanceTo(sprite.position))
            // console.log('id',sprite.userData.id)
            sprite.visible = false
        }
        else {
            sprite.position.y = - 2
            sprite.position.y = + distance / 15
            sprite.visible = true
        }
        //}
        //   console.log(artifact.position)
    });
}
