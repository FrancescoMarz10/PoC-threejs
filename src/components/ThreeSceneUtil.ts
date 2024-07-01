import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function setInitialModelsPosition(
  tableModel: THREE.Object3D<THREE.Object3DEventMap>,
  coffeeCupModel: THREE.Object3D<THREE.Object3DEventMap>,
  camera: THREE.PerspectiveCamera
): void {
  // set model position in the scene
  tableModel.position.set(0, -1, 0);
  coffeeCupModel.position.set(0.25, 1.14, -0.25);

  // set camera position and view in the scene
  camera.position.set(0, 0.8, 3);
  camera.lookAt(0, 0, 0);

  camera.updateProjectionMatrix();
}

export function configureControls(controls: OrbitControls): void {
  // function used to set camera controls property
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.screenSpacePanning = false;
  controls.maxPolarAngle = Math.PI / 2;

  // set max and min zoom distance
  controls.minDistance = 0.8;
  controls.maxDistance = 4;
}

export function addLights(scene: THREE.Scene): void {
  // adding a white ambient light with 0.8 intensity to highlight the scene
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  // adding a spotlight white light with 10 intensity that highlight the coffee table
  const spotLight = new THREE.SpotLight(0xffffff, 10);
  spotLight.position.set(0, 2, 0);
  spotLight.angle = Math.PI / 6;
  spotLight.penumbra = 0.1;
  spotLight.decay = 2;
  spotLight.distance = 50;
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 8192;
  spotLight.shadow.mapSize.height = 8192;
  spotLight.shadow.camera.near = 0.5;
  spotLight.shadow.camera.far = 5000;
  spotLight.shadow.bias = -0.001;
  scene.add(spotLight);
}

// function used to make a model able to generate a shadow
export function castShadow(
  model: THREE.Object3D<THREE.Object3DEventMap>
): void {
  model.traverse((node: unknown) => {
    if (
      node instanceof THREE.Mesh ||
      node instanceof THREE.Object3D ||
      node instanceof THREE.Group
    ) {
      node.castShadow = true;
    }
  });
}

// function used to make a model able to receive a generated shadow
export function receiveShadow(
  model: THREE.Object3D<THREE.Object3DEventMap>
): void {
  model.traverse((node: unknown) => {
    if (
      node instanceof THREE.Mesh ||
      node instanceof THREE.Object3D ||
      node instanceof THREE.Group
    ) {
      node.receiveShadow = true;
    }
  });
}

export function addShadows(
  tableModel: THREE.Object3D<THREE.Object3DEventMap>,
  coffeeCupModel: THREE.Object3D<THREE.Object3DEventMap>
): void {
  castShadow(coffeeCupModel);
  castShadow(tableModel);
  receiveShadow(tableModel);
}

// add a floor to the scene, using a PlaneGeometry and applying a wood texture
export function addWoodFloor(scene: THREE.Scene): void {
  const loader = new THREE.TextureLoader();

  const woodTexture = loader.load(
    "src/assets/images/wood-floor.jpg",
    (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(300, 300);
    }
  );
  const floorGeometry = new THREE.PlaneGeometry(500, 500);
  const floorMaterial = new THREE.MeshStandardMaterial({ map: woodTexture });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  receiveShadow(floor);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1;
  scene.add(floor);
}
