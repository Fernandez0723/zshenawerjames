import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'https://cdn.skypack.dev/gsap';

const camera = new THREE.PerspectiveCamera(
    10,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 13;

const scene = new THREE.Scene();

let bee;
let mixer;

// Load the 3D model
const loader = new GLTFLoader();
loader.load(
    '/demon_bee_full_texture.glb',
    function (gltf) {
        bee = gltf.scene;
        scene.add(bee);

        // Set up animation mixer if there are animations
        if (gltf.animations && gltf.animations.length) {
            mixer = new THREE.AnimationMixer(bee);
            mixer.clipAction(gltf.animations[0]).play();
        }

        // Trigger model movement based on scroll
        modelMove();
    },
    undefined, // Optional loading progress function
    function (error) {
        console.error('An error occurred while loading the model:', error);
    }
);

// Set up renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container3D').appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
scene.add(topLight);

// Render loop
const reRender3D = () => {
    requestAnimationFrame(reRender3D);
    renderer.render(scene, camera);
    if (mixer) mixer.update(0.02);
};
reRender3D();

// Define model positions for different sections
const arrPositionModel = [
    { id: 'banner', position: { x: 0, y: -1, z: 0 }, rotation: { x: 0, y: 1.5, z: 0 } },
    { id: "intro", position: { x: 1, y: -1, z: -5 }, rotation: { x: 0.5, y: -0.5, z: 0 } },
    { id: "description", position: { x: -1, y: -1, z: -5 }, rotation: { x: 0, y: 0.5, z: 0 } },
    { id: "contact", position: { x: 0.8, y: -1, z: 0 }, rotation: { x: 0.3, y: -0.5, z: 0 } },
];

// Function to handle model movement
const modelMove = () => {
    const sections = document.querySelectorAll('.section');
    let currentSection;

    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 3) {
            currentSection = section.id;
        }
    });

    let position_active = arrPositionModel.findIndex(val => val.id === currentSection);
    if (position_active >= 0) {
        let newCoordinates = arrPositionModel[position_active];
        gsap.to(bee.position, {
            x: newCoordinates.position.x,
            y: newCoordinates.position.y,
            z: newCoordinates.position.z,
            duration: 3,
            ease: "power1.out"
        });
        gsap.to(bee.rotation, {
            x: newCoordinates.rotation.x,
            y: newCoordinates.rotation.y,
            z: newCoordinates.rotation.z,
            duration: 3,
            ease: "power1.out"
        });
    }
}

// Event listeners
window.addEventListener('scroll', () => {
    if (bee) {
        modelMove();
    }
});

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
