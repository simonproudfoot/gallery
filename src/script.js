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
let waiting;
let stepOneDone = false
let stepTwoDone = false
let waitForStep2 = true
let artifacstLoaded = false
const cameraHeight = 7
const roomCenter = { x: -30.000, y: 10.000, z: 0 }
let zoneTitles;
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

// LISTENERS
document.getElementById("enterGallery").addEventListener("click", enterGallery);
document.getElementById("infoButton").addEventListener("click", toggleHowTo);
document.getElementById("menuButton").addEventListener("click", toggleMenu);
document.getElementById("left").addEventListener("click", sideMoves);
document.getElementById("right").addEventListener("click", sideMoves);

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
const ambientLight = new THREE.HemisphereLight(
    0xFFFFFF, // bright sky color
    0xe0d3af, // dim ground color
    0.8, // intensity
);
let guttmanPosition;
scene.add(ambientLight)
// Load a glTF resource
if (!testing) {
    var galleryModelUrl = process.env.NODE_ENV !== 'production' ? './NPHT.gltf' : themeDir + '/dist/NPHT.gltf'
    loader.load(galleryModelUrl, (gltf) => {
        gltf.scene.scale.set(0.0005, 0.0005, 0.0005)
        gltf.scene.name = 'gallerySpace'
        gltf.scene.position.y = -6
        scene.add(gltf.scene);
        guttmanPosition = gltf.scene.getObjectByName('Dr_Guttman_Bust').position
    },
    );
}


// Create center reference box
const centerBox = new THREE.Mesh(
    new THREE.BoxGeometry(5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true, visible: false })
);
centerBox.position.set(roomCenter.x, roomCenter.y, roomCenter.z)
scene.add(centerBox);


// lights
const guttmanLight = new THREE.RectAreaLight(0xEBFAFF, 7, 300, 10)
guttmanLight.name = 'guttmanLight'
guttmanLight.position.set(-20, 7, -200)
guttmanLight.rotation.y = Math.PI * 7
scene.add(guttmanLight)
// light above guttman
// Create bounding box for pedistal items to fit into
const boundingBoxGeom = new THREE.Mesh(
    new THREE.BoxGeometry(5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true, visible: false })
);
boundingBoxGeom.visible = false
scene.add(boundingBoxGeom);
// ADD THE USERS artifacts
await axios.get(afcUrl)
    .then(function (response) {
        database = response.data.acf.artifacts.sort((a, b) => a.location - b.location)
        console.log(database)
        zoneTitles = response.data.acf.zones
    })
    .catch(function (error) {
        console.log(error);
    })
    .then(function () {

        loadartifacts()
    });
// MOVE ALONG

function sideMoves(event) {
    const indexIs = (element) => element.location == selectSpot;
    let currentIndex = database.findIndex(indexIs)
    let nextIndex = database.findIndex(indexIs) + 1
    let prevIndex = database.findIndex(indexIs) - 1

    if (event.target.id == 'right') {
        if (database[nextIndex] != undefined) {
            selectSpot = database[nextIndex].location
        } else {
            selectSpot = database[0].location
        }
    }

    if (event.target.id == 'left') {
        if (selectSpot != 1) {
            selectSpot = database[prevIndex].location
        } else {
            selectSpot = database.slice(-1).pop().location
        }
    }


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
const infoPointGeometry = new THREE.PlaneBufferGeometry(3, 5);
const infoPointMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, color: '#000' })
function makeInfoPoint(location, name, wallmount) {
    let infoPoint = new THREE.Mesh(infoPointGeometry, infoPointMaterial);
    infoPoint.position.copy(positions[location])
    infoPoint.position.y = 10
    infoPoint.name = name

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
    if (between(location, 10, 14)) {
        infoPoint.position.z = 212
        if (wallmount) {
            infoPoint.position.x -= 13
        } else {
            infoPoint.position.x -= 8
        }
    }

    if (between(location, 15, 24)) {
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
    if (between(location, 10, 14)) {
        spritey.position.z -= 10
    }
    if (between(location, 15, 24)) {
        spritey.position.x += 5
    }
    sprites.push(spritey)
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
    if (between(location, 10, 14)) {
        rectAreaLight.rotation.y = -Math.PI
        rectAreaLight.position.z -= 15
    }
    if (between(location, 15, 24)) {
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
    newLI.appendChild(document.createTextNode(title));
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
    if (between(location, 10, 14)) {
        position.z -= 10
    }
    if (between(location, 15, 24)) {
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
    if (between(location, 10, 14)) {
        rotation = Math.PI / 2
    }
    if (between(location, 15, 24)) {
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


function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a.userData[property] < b.userData[property]) ? -1 : (a.userData[property] > b.userData[property]) ? 1 : 0;
        return result * sortOrder;
    }
}


function loadartifacts(params) {
    database.forEach(async (element, i) => {
        // LOAD artifacts
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
            makeMenuItem(element.artifact_title, element.location, i)
            makeInfoPoint(location, 'info-' + location, null)
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
                makeInfoPoint(location, 'info-' + location, true)
                var imgSize = tex.image.height / tex.image.width
                var maxHeight = 1.3
                if (imgSize > maxHeight) {
                    var diff = Math.abs(imgSize - maxHeight)
                    imgSize -= diff
                }
                mount.scale.set(1.0, imgSize, 1.0);
                artifacts.push(mount)

            });
        }
        // finished
        if (i == database.length - 1) {
            artifacts.sort(dynamicSort("location")); // reforder the array for easy location find
            artifacstLoaded = true
            //   lCount = true
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
    const val = event.target.attributes['data-artifact'].value
    const open = document.getElementById('menu').classList.contains('open')
    selectSpot = val
    toggleMenu()

    setTimeout(() => {
        showArrows()
    }, 1000);

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
    edgeGlow: 2,
    edgeThickness: 0.5,
    pulsePeriod: 0.2,
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
        // var intersectsA = raycaster.intersectObjects(infoPoints)
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
document.addEventListener('mousedown', onDocumentMouseDown, false);
start.addEventListener("click", beginTour);
// create text labels
zoneTitles.forEach((zone, i) => {

    var wrapper = document.createElement('div');
    wrapper.classList.add('zoneTitles')
    document.body.appendChild(wrapper);

    var ele = document.createElement('h1');
    ele.innerHTML = zone.zone
    wrapper.appendChild(ele);

    var canvas = document.createElement('canvas');
    wrapper.appendChild(canvas);

    var img = document.createElement('img');
    wrapper.appendChild(img);

    var context = canvas.getContext("2d");
    context.font = "30px gothammedium";
    context.fillStyle = "#000";

    if (ele.textContent) {
        // for firefox
        context.fillText(ele.textContent, 0, canvas.height / 2);
    } else {
        context.fillText(ele.innerText, 0, canvas.height / 2);
    }

    //onsole.log(canvas.toDataURL('image/png'))
    img.src = canvas.toDataURL('image/png');
    const title = textureLoader.load(img.src)
    let ratio = canvas.width < 500 ? 7 : 15
    const geometry = new THREE.PlaneGeometry(canvas.width / ratio, canvas.height / ratio);
    const material = new THREE.MeshBasicMaterial({
        map: title,
        color: 0xffffff,
        side: THREE.DoubleSide,
        alphaTest: 0.5
    });

    const plane = new THREE.Mesh(geometry, material);
    plane.position.y = 18
    plane.name = 'title:' + ele.innerHTML
    // left
    if (i == 0) {
        plane.position.set(29.460, 18.990, -107.880)
        plane.rotation.y = -Math.PI / 2
    }
    if (i == 1) {
        plane.position.set(29.460, 18.990, 100)
        plane.rotation.y = -Math.PI / 2
    }
    // backwall
    if (i == 2) {
        plane.position.set(0, 18.990, 213)
        plane.rotation.y = Math.PI
    }
    // right
    if (i == 3) {
        plane.position.set(-87.890, 18.990, 100)
        plane.rotation.y = Math.PI / 2
    }
    if (i == 4) {
        plane.material.color.setHex(0xff0000)
        plane.position.set(-87.890, 18.990, -107.880)
        plane.rotation.y = Math.PI / 2
    }

    scene.add(plane);
})
// ZONE LIGHTS
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
}
// inital view
camera.lookAt(new THREE.Vector3(roomCenter.x, roomCenter.y, roomCenter.z))
// CREATE A BOX TO FOLLOW
const cameraStand = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.2, 0.2),
    new THREE.MeshBasicMaterial({ color: '0xff0000', wireframe: true, visible: false })
);
cameraStand.position.set(roomCenter.x, roomCenter.y, roomCenter.z)
scene.add(cameraStand);
cameraStand.geometry.computeBoundingBox();
if (testing) {
    cameraStand.visible = true
}
const meshBBSize = cameraStand.geometry.boundingBox.getSize(new THREE.Vector3());
const meshBBWidth = meshBBSize.x;
const meshBBHeight = meshBBSize.y;
const meshBBDepth = meshBBSize.z;
function customFitTo() {
    const distanceToFit = cameraControls.getDistanceToFitBox(meshBBWidth, meshBBHeight, meshBBDepth);
    ///alert(distanceToFit)
    cameraControls.moveTo(
        cameraStand.position.x,
        cameraHeight,
        cameraStand.position.z + distanceToFit,
        true
    );


}
if (!testing) {
    cameraControls.setPosition(0, cameraHeight, -210)
}

let nextPos = {}
let lastPosition = null
async function lookAtArtifact(params, firstStep) {

    if (selectSpot) {
        document.getElementById('lookAt').innerHTML = selectSpot
        outlinePass.selectedObjects = []
        const location = selectSpot - 1
        lastPosition = selectSpot

        artifacts.forEach((element, i) => {
            if (element.userData.location == location) {

                nextPos.x = element.position.x
                nextPos.z = element.position.z
            }
        })
        if (between(selectSpot, 0, 10)) {
            cameraStand.position.set(nextPos.x - 30, cameraHeight, nextPos.z)
            if (!testing) {
                await cameraControls.setLookAt(cameraStand.position.x, cameraHeight, cameraStand.position.z, nextPos.x, cameraHeight, nextPos.z, true)
            }
        }
        if (between(selectSpot, 11, 14)) {
            cameraStand.position.set(nextPos.x, cameraHeight, nextPos.z - 30)
            if (!testing) {
                await cameraControls.setLookAt(cameraStand.position.x, cameraHeight, cameraStand.position.z, nextPos.x, cameraHeight, nextPos.z, true)
            }
        }
        if (between(selectSpot, 15, 25)) {
            cameraStand.position.set(nextPos.x + 30, cameraHeight, nextPos.z)
            // alert('me')
            // cameraStand.lookAt(centerBox.position.x, centerBox.position.y, centerBox.position.z)
            if (!testing) {
                await cameraControls.setLookAt(cameraStand.position.x, cameraHeight, cameraStand.position.z, nextPos.x, cameraHeight, nextPos.z, true)
            }
        }
    } else if (firstStep) {
        if (!testing) {
            if (!stepOneDone) {
                cameraStand.position.set(cameraStand.position.x, cameraHeight, 20)
                stepOneDone = true
                gsap.fromTo('.howto', { display: 'none', autoAlpha: 0, x: 100 }, { display: 'block', autoAlpha: 1, x: 0, duration: 1, delay: 1 })
            }
        }
    }
    if (waiting && !selectSpot) {
        if (!testing) {
            cameraControls.setTarget(centerBox.position.x, centerBox.position.y, centerBox.position.z, true)
            cameraControls.dollyTo(3, true);
            cameraControls.fitToBox(cameraStand, true);
            cameraControls.enabled = true
            lastPosition = null
            waiting = false
        }
    }
}
document.getElementById("closeHowTo").addEventListener("click", closeHowTo);
function closeHowTo() {
    gsap.to('.howto', {
        display: 'none', autoAlpha: 0, x: 100, duration: 0.5
    })
}
function enterGallery() {
    gsap.to('.howto', {
        display: 'none', autoAlpha: 0, x: 100, duration: 0.5
    })
    gsap.to('#menuButton', { display: 'block', opacity: 1, delay: 1, duration: 1 })
    gsap.to('#infoButton', { display: 'block', opacity: 1, delay: 1, duration: 1 })
    gsap.to(scene.getObjectByName('Glass_Door_Right').position, {
        x: -94000, delay: 1, duration: 1,
    })
    gsap.to(scene.getObjectByName('Glass_Door_Left').position, {
        x: -33000, delay: 1, duration: 1, onComplete: async () => {
            await cameraControls.dollyTo(100, true);
            selectSpot = 1
            showArrows()
            stepTwoDone = true
            document.getElementById('enterGallery').style.display = 'none'
            document.getElementById('closeHowTo').style.display = 'block'
        }
    })
}
async function turnAround() {

    hideArrows()

    selectSpot = null
    waiting = true
}
function flashInfo(i) {
    var start = new THREE.Color(0x000000);
    var value = new THREE.Color(0xff0000);
    gsap.fromTo(i.material.color, {
        r: start.r,
        g: start.g,
        b: start.b,
    }, {
        r: value.r,
        g: value.g,
        b: value.b,
        yoyo: true,
        duration: 1,
        repeat: -1
    });
}
let doneLoading = false
const animate = () => {
    if (!testing) {
        customFitTo()
    }
    // INTRO - WALK INTO ROOM
    if (intro && started && doneLoading) {
        lookAtArtifact(false, true)
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
    // check model 
    if (scene.getObjectByName('gallerySpace') && artifacstLoaded && !doneLoading) {
        doneLoading = true
        start.style.display = 'block'
        loading.style.display = 'none'
    }
    return compose.render(scene, camera) && renderer.render(scene, camera);
    // return renderer.render(scene, camera);
};
animate()
// unhide doc
document.body.style.display = 'block'

// menus
function toggleMenu() {
    const sideMenu = document.getElementById('menu')
    const button = document.getElementById('menuButton').children[0];
    if (sideMenu.style.display == 'none') {
        button.classList.add('open')
        gsap.to(sideMenu, { opacity: 1, x: 0, display: 'block', duration: 0.5 })
    } else {
        button.classList.remove('open')
        gsap.to(sideMenu, { opacity: 0, x: 300, display: 'none' })
    }
}

function toggleHowTo() {
    const sideMenu = document.getElementById('infoWindow')
    const button = document.getElementById('menuButton').children[0];
    if (sideMenu.style.display == 'none') {
        button.classList.add('open')
        gsap.to(sideMenu, { opacity: 1, x: 0, display: 'block', duration: 0.5 })
    } else {
        button.classList.remove('open')
        gsap.to(sideMenu, { opacity: 0, x: 300, display: 'none' })
    }
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
    if (!testing) {
        backButton.style.display = 'block'
        // if (selectSpot > 0) {
        gsap.to('#left', { x: 0, opacity: 1, duration: 1, display: 'block' })
        //} else {
        //left.style.display = 'none'
        //}
        //if (selectSpot <= artifacts.length) {
        gsap.to('#right', { x: 0, opacity: 1, duration: 1, display: 'block' })
        //} else {
        //right.style.display = 'none'
        //}
        // alert(selectSpot)
        gsap.to('#goback', { y: 0, opacity: 1, duration: 1 })
        cameraControls.enabled = false
    }
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
            sprite.visible = false
        }
        else {
            sprite.position.y = - 2
            sprite.position.y = + distance / 15
            sprite.visible = true
        }
    });
}
