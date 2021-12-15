import * as THREE from 'three'
export function makeTextSprite(message, color) {
    
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.beginPath();
    context.arc(100, 75, 50, Math.PI, 3 * Math.PI);
    context.strokeStyle = color
    context.lineWidth = 15;
    context.stroke();
    
    var texture = new THREE.Texture(canvas)
    texture.needsUpdate = true;
    var spriteMaterial = new THREE.SpriteMaterial({ map: texture, useScreenCoordinates: false });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(0.5 * 15, 0.25 * 15, 0.75 * 15);
    
    return sprite;
}

