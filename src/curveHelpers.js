// Object 1
import * as THREE from 'three'

//Create a closed wavey loop
const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(mesh1.position.x, 0, mesh1.position.z),
    new THREE.Vector3(mesh2.position.x, 0, mesh2.position.z),
    new THREE.Vector3(mesh3.position.x, 0, mesh3.position.z),
    new THREE.Vector3(mesh4.position.x, 0, mesh4.position.z),
    new THREE.Vector3(mesh5.position.x, 0, mesh5.position.z),
]);



export default curve;