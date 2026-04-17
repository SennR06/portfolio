// js/main.js

import * as THREE from './three.module.js';
import { OBJLoader } from './OBJLoader.js';

let scene, camera, renderer;
let points;
let mouse;          // NDC (-1..1)
let mouseWorld;     // 3D punt onder cursor in wereldruimte
let raycaster;
let interactionPlane;
const localMouse = new THREE.Vector3();
let targetRotationY = 0;
let baseRotationY = 0;

window.addEventListener('load', () => {
    console.log('window loaded, THREE is:', typeof THREE);
    init();
    animate();
});

function init() {
    console.log('inside init, THREE is:', typeof THREE);

    mouse = new THREE.Vector2();
    mouseWorld = new THREE.Vector3();
    raycaster = new THREE.Raycaster();

    const container = document.getElementById('app');
    if (!container) {
        console.error('#app container not found');
        return;
    }

    scene = new THREE.Scene();

    const aspect = container.clientWidth / container.clientHeight;
    camera = new THREE.PerspectiveCamera(45, aspect, 0.01, 100);
    camera.position.set(0, 0, 3);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0); // transparante achtergrond
    container.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0x2c52e5, 1);
    light.position.set(1, 1, 1);
    scene.add(light);

    // vlak Z=0 voor muis-intersectie
    interactionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);

    onWindowResize();
    loadObjPointCloud();
}

function onWindowResize() {
    const container = document.getElementById('app');
    if (!container || !camera || !renderer) return;

    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

function onMouseMove(event) {
    if (!renderer || !camera) return;

    const canvas = renderer.domElement;
    const rect = canvas.getBoundingClientRect();

    // Muis -> NDC op basis van daadwerkelijke canvas-pixels
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(interactionPlane, mouseWorld);

    mouseWorld.z = 0;

    const maxRotation = 0.2; // ongeveer 30 graden naar links/rechts
    targetRotationY = mouse.x * maxRotation;
}

const lightMapTexture = new THREE.TextureLoader().load('img/senn.jpg');
lightMapTexture.colorSpace = THREE.SRGBColorSpace;

function loadObjPointCloud() {
    const loader = new OBJLoader();
    console.log('Loading OBJ…');

    loader.load(
        'senn.obj',
        (obj) => {
            console.log('OBJ loaded:', obj);

            let mesh = null;
            obj.traverse((child) => {
                // Pak óf een Mesh óf een LineSegments als bron
                if ((child.isMesh || child.type === 'LineSegments') && !mesh) {
                    mesh = child;
                }
            });

            if (!mesh) {
                console.error('No mesh/lines found in OBJ file.');
                return;
            }

            // Zorg dat we UV's uit de geometry krijgen
            const baseGeometry = mesh.geometry;
            const geometryNonIndexed = baseGeometry.index
                ? baseGeometry.toNonIndexed()
                : baseGeometry.clone();

            const posAttr = geometryNonIndexed.getAttribute('position');
            if (!posAttr) {
                console.error('No position attribute on geometry.');
                return;
            }

            const uvAttr = geometryNonIndexed.getAttribute('uv');
            if (!uvAttr) {
                console.warn('No UV attribute on geometry. Check your OBJ export + OBJLoader.');
            } else {
                console.log('UV attribute found with count:', uvAttr.count);
            }

            const vertexCount = posAttr.count;
            console.log('Vertex count:', vertexCount);

            const positions = new Float32Array(vertexCount * 3);
            const originalPositions = new Float32Array(vertexCount * 3);

            for (let i = 0; i < vertexCount; i++) {
                const x = posAttr.getX(i);
                const y = posAttr.getY(i);
                const z = posAttr.getZ(i);

                positions[i * 3] = x;
                positions[i * 3 + 1] = y;
                positions[i * 3 + 2] = z;

                originalPositions[i * 3] = x;
                originalPositions[i * 3 + 1] = y;
                originalPositions[i * 3 + 2] = z;
            }

            const pointsGeometry = new THREE.BufferGeometry();
            pointsGeometry.setAttribute(
                'position',
                new THREE.BufferAttribute(positions, 3)
            );
            pointsGeometry.setAttribute(
                'originalPosition',
                new THREE.BufferAttribute(originalPositions, 3)
            );

            // UV's kopiëren als ze bestaan
            if (uvAttr) {
                const uvs = new Float32Array(vertexCount * 2);
                for (let i = 0; i < vertexCount; i++) {
                    uvs[i * 2] = uvAttr.getX(i);
                    uvs[i * 2 + 1] = uvAttr.getY(i);
                }
                pointsGeometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
            }

            // centreer model rond (0,0,0)
            pointsGeometry.center();
            const box = new THREE.Box3().setFromBufferAttribute(
                pointsGeometry.getAttribute('position')
            );
            const size = new THREE.Vector3();
            box.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z) || 1;
            const targetSize = 1.6;
            const uniformScale = targetSize / maxDim;

            // ShaderMaterial dat UV's gebruikt voor licht / schaduw
            const pointsMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    uHighlightStrength: { value: 0.1 },
                    uShadowStrength: { value: 0.8 },
                    uPointSize: { value: 0.08 },
                    uLightMap: { value: lightMapTexture }
                },
                vertexShader: `
                    uniform float uPointSize;
                    varying vec2 vUv;

                    void main() {
                        vUv = uv;
                        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                        gl_Position = projectionMatrix * mvPosition;
                        gl_PointSize = uPointSize * (180.0 / -mvPosition.z);
                    }
                `,
                fragmentShader: `
                    varying vec2 vUv;
                    uniform float uHighlightStrength;
                    uniform float uShadowStrength;
                    uniform sampler2D uLightMap;

                    // simpele noise-functie voor subtiel geflikker
                    float rand(vec2 co) {
                        return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453);
                    }

                    void main() {
                        vec2 p = gl_PointCoord - 0.5;
                        float r = length(p);
                        if (r > 0.5) discard; // ronde punten

                        // kleur uit texture (foto)
                        vec3 texColor = texture2D(uLightMap, vUv).rgb;

                        // exposure / brightness boost
                        float exposure = 1.8;
                        texColor = clamp(texColor * exposure, 0.0, 1.0);

                        // brightness uit texture zelf (na exposure)
                        float brightness = dot(texColor, vec3(0.299, 0.587, 0.114));

                        float contrast = (brightness - 0.5) * 2.0; // -1..1

                        float lightFactor;
                        if (contrast > 0.0) {
                            lightFactor = mix(1.0, uHighlightStrength, contrast);
                        } else {
                            lightFactor = mix(uShadowStrength, 1.0, contrast + 1.0);
                        }

                        // radiale falloff binnen de cirkel -> glow in het midden
                        float falloff = smoothstep(0.5, 0.0, r);

                        // klein beetje random jitter per punt
                        float n = rand(vUv * 50.0);
                        lightFactor *= 0.9 + 0.2 * n;

                        vec3 finalColor = texColor * lightFactor * falloff;

                        gl_FragColor = vec4(finalColor, 1.0);
                    }
                `,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });



            points = new THREE.Points(pointsGeometry, pointsMaterial);

            points.scale.set(uniformScale, uniformScale, uniformScale);
            points.scale.multiplyScalar(1.2);

            points.position.y = -0.1;

            baseRotationY = -Math.PI / 2;   // of een andere waarde die jij mooi vindt
            points.rotation.y = baseRotationY;

            scene.add(points);

            console.log('OBJ point cloud loaded with', vertexCount, 'points');
        },
        undefined,
        (error) => {
            console.error('Error loading OBJ:', error);
        }
    );
}

function animate() {
    requestAnimationFrame(animate);

    if (points) {
        updatePoints();

        const lerpSpeed = 0.08;
        const desired = baseRotationY + targetRotationY;
        points.rotation.y += (desired - points.rotation.y) * lerpSpeed;
    }

    if (renderer && camera && scene) {
        renderer.render(scene, camera);
    }
}

function updatePoints() {
    if (!points) return;

    const geometry = points.geometry;
    const positions = geometry.attributes.position.array;
    const original = geometry.attributes.originalPosition.array;

    // Interactie
    const radius = 2.8;  // grootte van de “bubble”
    const forceStrength = 0.6;  // hoe hard de duw is
    const returnSpeed = 0.05; // hoe snel punten terugveren

    // cursor naar lokale ruimte van points
    localMouse.copy(mouseWorld);
    points.worldToLocal(localMouse);

    const cx = localMouse.x;
    const cy = localMouse.y;
    const cz = localMouse.z; // ~0

    for (let i = 0; i < positions.length; i += 3) {
        const ox = original[i];
        const oy = original[i + 1];
        const oz = original[i + 2];

        let x = positions[i];
        let y = positions[i + 1];
        let z = positions[i + 2];

        const dx = x - cx;
        const dy = y - cy;
        const dz = z - cz;
        const distSq = dx * dx + dy * dy + dz * dz;
        const radiusSq = radius * radius;

        if (distSq < radiusSq) {
            const dist = Math.sqrt(distSq); // alleen hier sqrt
            const t = (radius - dist) / radius;
            const strength = forceStrength * t;

            const invDist = dist || 1;
            const nx = dx / invDist;
            const ny = dy / invDist;
            const nz = dz / invDist;

            x += nx * strength;
            y += ny * strength;
            z += nz * strength;
        } else {
            x += (ox - x) * returnSpeed;
            y += (oy - y) * returnSpeed;
            z += (oz - z) * returnSpeed;
        }

        positions[i] = x;
        positions[i + 1] = y;
        positions[i + 2] = z;
    }

    geometry.attributes.position.needsUpdate = true;
}