// js/main.js

let scene, camera, renderer;
let points;
let mouse;          // NDC (-1..1)
let mouseWorld;     // 3D punt onder cursor
let raycaster;
let interactionPlane;

const _projVec = new THREE.Vector3(); // mag blijven, wordt straks niet meer gebruikt

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

    // Scene zonder vaste achtergrondkleur (canvas wordt transparant)
    scene = new THREE.Scene();

    const aspect = container.clientWidth / container.clientHeight;
    camera = new THREE.PerspectiveCamera(45, aspect, 0.01, 100);
    camera.position.set(0, 0, 3);
    camera.lookAt(0, 0, 0);

    // Renderer met alpha, zodat achtergrond transparant is
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // volledig transparant
    container.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0x2c52e5, 1);
    light.position.set(1, 1, 1);
    scene.add(light);

    interactionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);

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

  const rect = renderer.domElement.getBoundingClientRect();

  // Muis in NDC t.o.v. canvas
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  // Ray van camera door cursor
  raycaster.setFromCamera(mouse, camera);
  // snij met Z=0 vlak
  raycaster.ray.intersectPlane(interactionPlane, mouseWorld);

  // zorg dat de sphere altijd op vaste diepte staat
  mouseWorld.z = 0;  // vaste Z (past bij gecentreerde geometrië)
}

function loadObjPointCloud() {
    if (!THREE.OBJLoader) {
        console.error('OBJLoader not found. Check script tags in index.html');
        return;
    }

    const loader = new THREE.OBJLoader();
    console.log('Loading OBJ…');

    loader.load(
        'decimated-normal.obj',
        (obj) => {
            console.log('OBJ loaded:', obj);

            let mesh = null;
            obj.traverse((child) => {
                if (child.isMesh && !mesh) {
                    mesh = child;
                }
            });

            if (!mesh) {
                console.error('No mesh found in OBJ file.');
                return;
            }

            const baseGeometry = mesh.geometry;
            const geometryNonIndexed = baseGeometry.index
                ? baseGeometry.toNonIndexed()
                : baseGeometry.clone();

            const posAttr = geometryNonIndexed.getAttribute('position');
            if (!posAttr) {
                console.error('No position attribute on geometry.');
                return;
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

            pointsGeometry.center();
            const box = new THREE.Box3().setFromBufferAttribute(
                pointsGeometry.getAttribute('position')
            );
            const size = new THREE.Vector3();
            box.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z) || 1;
            const targetSize = 1.5;
            const uniformScale = targetSize / maxDim;

            points = new THREE.Points(
                pointsGeometry,
                new THREE.PointsMaterial({
                    size: 0.025,
                    color: 0x2c52e5,
                    sizeAttenuation: true,
                    transparent: true,
                    opacity: 0.4
                })
            );

            // 1) basis-schaal zoals eerder
            points.scale.set(uniformScale, uniformScale, uniformScale);

            // 2) extra 1.2x groter maken
            points.scale.multiplyScalar(1.2);

            // 3) 90 graden draaien zodat je naar voren kijkt
            // als het nu naar rechts (positieve X) kijkt, draai het rond Y-as:
            points.rotation.y = -Math.PI / 2; // of +Math.PI / 2 proberen als het de andere kant op staat

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
    }

    if (renderer && camera && scene) {
        renderer.render(scene, camera);
    }
}

function updatePoints() {
  const geometry = points.geometry;
  const positions = geometry.attributes.position.array;
  const original = geometry.attributes.originalPosition.array;

  // Kies een radius die iets groter is dan de "dikte" van je model
  const radius = 2;        // experiment: 0.5–1.0
  const forceStrength = 0.15;
  const returnSpeed = 0.06;

  const cx = mouseWorld.x;
  const cy = mouseWorld.y;
  const cz = 0;              // vaste diepte van de sphere

  for (let i = 0; i < positions.length; i += 3) {
    const ox = original[i];
    const oy = original[i + 1];
    const oz = original[i + 2];

    let x = positions[i];
    let y = positions[i + 1];
    let z = positions[i + 2];

    // afstand tot de vaste bol-center
    const dx = x - cx;
    const dy = y - cy;
    const dz = z - cz;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (dist < radius) {
      const t = (radius - dist) / radius; // 0..1
      const strength = forceStrength * t;

      const invDist = dist || 1;
      const nx = dx / invDist;
      const ny = dy / invDist;
      const nz = dz / invDist;

      // radiale duw rond de bol
      x += nx * strength;
      y += ny * strength;
      z += nz * strength;
    } else {
      // rustig terug naar originele positie
      x += (ox - x) * returnSpeed;
      y += (oy - y) * returnSpeed;
      z += (oz - z) * returnSpeed;
    }

    positions[i]     = x;
    positions[i + 1] = y;
    positions[i + 2] = z;
  }

  geometry.attributes.position.needsUpdate = true;
}