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
import gsap from 'gsap';
import * as dat from 'dat.gui';
const auth = document.body.classList.contains('logged-in') ? true : false
const axios = require('axios').default;
const loader = new GLTFLoader();
let testing = false;
if (window.location.hash.substr(1).length && window.location.hash.substr(1) == 'test') {
    testing = true
    document.getElementById('controls').style.display = 'none'
    document.getElementById('testmode').style.display = 'block'
}
function getThemeDir() {
    var scripts = document.getElementsByTagName('script'),
        index = scripts.length - 1,
        myScript = scripts[index];
    return myScript.src.replace(/themes\/(.*?)\/(.*)/g, 'themes/$1');
}
var themeDir = getThemeDir();
const afcUrl = process.env.NODE_ENV == 'production' ? 'http://ducknest.co.uk/npht-gallery/wp-json/acf/v3/options/acf-options-gallery' : 'http://localhost:8888/npht/wp-json/acf/v3/options/acf-options-gallery'
let database;
const backButton = document.getElementById('goback')
const left = document.getElementById('left')
const right = document.getElementById('right')
const pos = document.getElementById('pos')
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
const positions = [{ "x": 29, "y": 8, "z": -118 }, { "x": 29, "y": 8, "z": -86 }, { "x": 29, "y": 8, "z": -54 }, { "x": 29, "y": 8, "z": -22 }, { "x": 29, "y": 8, "z": 10 }, { "x": 20, "y": -2.5, "z": 42 }, { "x": 20, "y": -2.5, "z": 74 }, { "x": 20, "y": -2.5, "z": 106 }, { "x": 20, "y": -2.5, "z": 138 }, { "x": 20, "y": -2.5, "z": 170 }, { "x": -89.56, "y": 8, "z": 178 }, { "x": -89.56, "y": 8, "z": 146 }, { "x": -89.56, "y": 8, "z": 114 }, { "x": -89.56, "y": 8, "z": 82 }, { "x": -89.56, "y": 8, "z": 50 }, { "x": -83, "y": -2.5, "z": 18 }, { "x": -83, "y": -2.5, "z": -14 }, { "x": -83, "y": -2.5, "z": -46 }, { "x": -83, "y": -2.5, "z": -78 }, { "x": -83, "y": -2.5, "z": -110 }]
let artifacts = []
let sprites = []
let infoPoints = []
var offset = 0
var x = 10
var i = 1
// remove positons button
if (!testing) {
    pos.style.display = 'none'
}
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
const plane = new THREE.Mesh(geometry, material);
plane.rotation.set(-Math.PI / 2, 0, 0)
plane.position.set(-25, -6.5, 0)
scene.add(plane);
const infoPointGeometry = new THREE.PlaneBufferGeometry(3, 5);
const infoPointMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, color: '#171616' })
// CREATE OBJECTS ON LONG
positions.forEach(element => {
    let infoPoint = new THREE.Mesh(infoPointGeometry, infoPointMaterial);
    if (i <= 5 || i > 10 && i < 16) {
        var newArtifact = new THREE.Mesh(wallMountedGeometry, material1);
        newArtifact.name = 'Wallmount-' + i
        newArtifact.position.copy(element)
        newArtifact.userData.pedistal = false
        infoPoint.position.copy(element)
        infoPoint.position.z = newArtifact.position.z + 13
        infoPoint.rotation.y = Math.PI / 2
    }
    else {
        var newArtifact = new THREE.Mesh(pedestalGeometry, material1);
        newArtifact.position.copy(element)
        newArtifact.name = 'Pedistal-' + i
        newArtifact.position.y = -2.5 // touch floor
        newArtifact.userData.pedistal = true
        infoPoint.position.copy(element)
        infoPoint.position.x = +3
        infoPoint.position.z = newArtifact.position.z + 8
        infoPoint.position.y = 2
        infoPoint.rotation.y = Math.PI / 2
    }
    infoPoint.position.y = 10
    if (i > 10) {
        newArtifact.rotation.y = Math.PI
        infoPoint.position.x = 0
        infoPoint.position.x = -90
    }
    else {
        infoPoint.position.x = +30
    }
    //    makeSprite(newArtifact.position.copy(element), newArtifact.name, newArtifact.position)
    infoPoints.push(infoPoint)
    artifacts.push(newArtifact)
    scene.add(newArtifact)
    scene.add(infoPoint)
    i++
});
const ambientLight = new THREE.HemisphereLight(
    0xFFFFFF, // bright sky color
    0xe0d3af, // dim ground color
    0.8, // intensity
);
scene.add(ambientLight)
document.getElementById("pos").addEventListener("click", getAllPositons);
function getAllPositons(params) {
    var posi = []
    artifacts.forEach(element => {
        posi.push(element.position)
    });
    document.getElementById('positions').innerHTML = JSON.stringify(posi);
}
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
// ADD THE USERS MODELS
await axios.get(afcUrl)
    .then(function (response) {
        database = response.data.acf.artifacts
    })
    .catch(function (error) {
        console.log(error);
    })
    .then(function () {
        loadModels()
    });
// MOVE ALONG
document.getElementById("left").addEventListener("click", sideMoves);
document.getElementById("right").addEventListener("click", sideMoves);
function sideMoves(event) {
    if (selectSpot > 19) {
        selectSpot = 0
    }
    if (event.target.id == 'left') {
        selectSpot--
    }
    else {
        selectSpot++
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
function makeSprite(location, label, position, i) {
    var ranHex = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
    var spritey = makeTextSprite(label, colors[i]);
    spritey.userData.id = parseInt(location)
    if (!testing) { spritey.visible = false }
    spritey.position.copy(position)
    if (location <= 10) {
        spritey.position.x -= 10
    } else {
        spritey.position.x += 5
    }
    sprites.push(spritey)
    scene.add(spritey);
}
function makeLight(location, position) {
    const rectAreaLight = new THREE.RectAreaLight(0xffffff, 5, 5, 30)
    rectAreaLight.position.copy(position)
    rectAreaLight.position.y += 20
    if (location < 11) {
        rectAreaLight.rotation.y = -Math.PI / 2
        rectAreaLight.position.x -= 20
    } else {
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

let models = []
function loadModels(params) {
    database.forEach(async (element, i) => {
        var back = i - 1
        // LOAD MODELS
        if (element.is_model) {
            var location = parseInt(element.pedistal_location)
            var selected = scene.getObjectByName('Pedistal-' + element.pedistal_location)
            const loadedArtifact = await loader.loadAsync(element['3d_model_']['url']);
            var boundingBox = new THREE.Box3().setFromObject(loadedArtifact.scene);
            let boundingBoxSize = boundingBox.getSize(new THREE.Vector3());
            const center = boundingBox.getCenter(new THREE.Vector3());
            boundingBox.center.y = 0
            let maxAxis = Math.max(boundingBoxSize.x, boundingBoxSize.y, boundingBoxSize.z);
            loadedArtifact.scene.scale.multiplyScalar(10 / maxAxis);
            loadedArtifact.scene.position.copy(selected.position)
            loadedArtifact.scene.rotation.copy(selected.rotation)
            loadedArtifact.scene.userData.location = element.pedistal_location
            loadedArtifact.scene.userData.index = i
            loadedArtifact.scene.position.y += 12
            if (auth) {
                const itemFolder = gui.addFolder(element.artifact_title)
                itemFolder.add(loadedArtifact.scene.rotation, 'y', 0, Math.PI * 2).name('Rotate');
                itemFolder.add(loadedArtifact.scene.position, 'y', 0, 20).name('Up/Down');
            }
            models.push(loadedArtifact.scene)
            scene.add(loadedArtifact.scene)
            makeLight(location, selected.position)
            makeSprite(parseInt(element.pedistal_location), element.artifact_title, loadedArtifact.scene.position, i)
            makeMenuItem(element.artifact_title, element.pedistal_location, i)
        }
        // LOAD IMAGES
        else {
            var selected = scene.getObjectByName('Wallmount-' + element.image_location)
            const colorTexture = textureLoader.load(element.image.url)
            var cloned = artifacts[0].material.clone()
            cloned.map = colorTexture
            selected.material = cloned
            makeLight(element.image_location, selected.position)
            makeSprite(element.image_location, element.artifact_title, selected.position, i)
            makeMenuItem(element.artifact_title, element.image_location, i)
        }




        // finished
        if (i == database.length - 1) {
            start.style.display = 'block'
            loading.style.display = 'none'
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
if (auth) {
    const gui = new dat.GUI();
}


function selectObjectFromMenu() {
    const open = document.getElementById('menu').classList.contains('open')
    if (open) {
        closeMenu()
    }


    selectSpot = event.target.attributes['data-artifact'].value


}

function onDocumentMouseDown(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    var intersectsInfo = raycaster.intersectObjects(infoPoints);
    var intersects = raycaster.intersectObjects(sprites);
    if (intersects.length > 0 && !selectSpot) {

        for (var i = 0; intersects.length > 0 && i < intersects.length; i++) {
            showArrows()
            selectSpot = parseInt(intersects[0].object.userData.id)
            // intersects[0].object.visible = false
        }

        outlinePass.selectedObjects = []

    }
    else if (intersectsInfo.length > 0 && selectSpot) {

        openInfoWindow(database, selectSpot)
    } else {
        sprites.forEach(x => x.visible = true)
    }
}
// outline effetct
var compose = new EffectComposer(renderer);
var renderPass = new RenderPass(scene, camera);
var outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera, models);
outlinePass.renderToScreen = true;
outlinePass.selectedObjects = '';
compose.addPass(renderPass);
compose.addPass(outlinePass);
var params = {
    edgeStrength: 1,
    edgeGlow: 2,
    edgeThickness: 0.5,
    pulsePeriod: 3,
};
outlinePass.edgeStrength = params.edgeStrength;
outlinePass.edgeGlow = params.edgeGlow;
outlinePass.visibleEdgeColor.set(0xffffff);
outlinePass.hiddenEdgeColor.set(0xffffff);
compose.render(scene, camera)
let hoverSpot = ''
document.addEventListener('mousemove', onMouseMove, false);
function onMouseMove(event) {
    sprites.forEach(i => i.material.color.set(0xffffff));
    if (!intro && !selectSpot) {
        // calculate mouse position in normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        var intersects = raycaster.intersectObjects(sprites);
        if (intersects.length > 0) {
            document.body.style.cursor = "pointer";
            for (var i = 0; intersects.length > 0 && i < intersects.length; i++) {
                var hoverSpot = parseInt(intersects[0].object.userData.id)
                models.forEach(element => {
                    if (element.userData.location == hoverSpot) {
                        outlinePass.selectedObjects = [element, artifacts[hoverSpot - 1]]
                    }
                    else {
                        outlinePass.selectedObjects = [artifacts[hoverSpot - 1]]
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
        console.log(selectSpot)
        nextPos.x = artifacts[selectSpot - 1].position.x
        nextPos.y = artifacts[selectSpot - 1].position.y
        nextPos.z = artifacts[selectSpot - 1].position.z
        // move camera up for pedistal
        if (artifacts[selectSpot - 1].userData.pedistal) {
            nextPos.y += 10
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
        //  outlinePass.selectedObjects = infoPoints
        backButton.style.display = 'block'
        left.style.display = 'block'
        right.style.display = 'block'
    }
}
async function turnAround() {
    hideArrows()
    await cameraControls.setLookAt(cameraStand.position.x, 0, cameraStand.position.z, 0, 0, cameraStand.position.z, true)
    selectSpot = null

}
const animate = () => {
    // INTRO - WALK INTO ROOM
    if (!testing) {
        if (intro && started) {
            startTour()
        } else if (selectSpot) {
            lookAtArtifact()
        }
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
            console.log('close')
            gsap.fromTo(menu, { opacity: 0, x: 300, duration: 0.5, display: 'none' }, { opacity: 1, x: 0, display: 'block' })
        } else {
            console.log('open')
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
    let contentTitle = ''
    let contentDisc = ''
    let next = {}

    if (database.find(x => x.is_model) && database.find(x => x.pedistal_location == selectSpot)) {

        contentTitle = database.find(x => x.pedistal_location == selectSpot).artifact_title
        contentDisc = database.find(x => x.pedistal_location == selectSpot).artifact_description
        next.title = database.find(x => x.pedistal_location == selectSpot + 1) ? database.find(x => x.pedistal_location == selectSpot + 1).artifact_title : ''
    }
    if (database.find(x => x.is_model == false) && database.find(x => x.image_location == selectSpot)) {
        contentTitle = database.find(x => x.image_location == selectSpot).artifact_title
        contentDisc = database.find(x => x.image_location == selectSpot).artifact_description
        next.title = database.find(x => x.image_location == selectSpot + 1) ? database.find(x => x.image_location == selectSpot + 1).artifact_title : ''

    }
    const infoWin = document.getElementById('infoWindow')
    const title = document.getElementById('infoTitle')
    const disc = document.getElementById('infoDisc')
    const nextStory = document.getElementById('nextStory')
    disc.innerHTML = contentDisc
    title.innerHTML = contentTitle

    nextStory.innerHTML = next.title
    nextStory.setAttribute("data-artifact", +selectSpot + 1);
    nextStory.addEventListener("click", selectObjectFromMenu);

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

function spriteOff() {
    sprites.forEach(sprite => {
        let distance = cameraStand.position.distanceTo(sprite.position)
        if (distance < 100 && selectSpot) {
            // console.log(cameraStand.position.distanceTo(sprite.position))
            // console.log('id',sprite.userData.id)
            sprite.visible = false
        }
        else {
            sprite.position.y =- 2
            sprite.position.y =+ distance / 15 
            sprite.visible = true

        }
        //}
        //   console.log(artifact.position)
    });
}
