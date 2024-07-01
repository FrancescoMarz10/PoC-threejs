<template>
  <div ref="modelContainer" class="model-container"></div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";
import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  addLights,
  addShadows,
  addWoodFloor,
  configureControls,
  setInitialModelsPosition,
} from "./ThreeSceneUtil";

const modelContainer = ref<HTMLElement | null>(null);
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls | undefined;
let tableModel: THREE.Object3D | undefined;
let coffeeCupModel: THREE.Object3D | undefined;

async function initScene(): Promise<void> {
  if (!modelContainer.value) return;

  const scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({ antialias: true });

  controls = new OrbitControls(camera, renderer.domElement);
  configureControls(controls);
  controls.update();

  renderer.setSize(window.innerWidth, window.innerHeight);
  modelContainer.value.appendChild(renderer.domElement);

  // init GLTFLoader to load 3D models
  const loader = new GLTFLoader();

  // Wait for the table model to finish loading
  await loadTableModel(loader);

  // wait for the coffee cup model to finish
  await loadCoffeeCupModel(loader);

  if (scene && tableModel && coffeeCupModel) {
    scene.add(tableModel);

    tableModel.add(coffeeCupModel);

    scene.background = new THREE.Color(0xaaaaaa);

    setInitialModelsPosition(tableModel, coffeeCupModel, camera);

    addShadows(tableModel, coffeeCupModel);

    addLights(scene);

    addWoodFloor(scene);
  }

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };

  animate();
}

async function loadTableModel(loader: GLTFLoader): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const tableModelUrl = "./src/assets/models/bar_table.glb";

    loader.load(
      tableModelUrl,
      (gltf: GLTF) => {
        tableModel = gltf.scene;
        resolve();
      },
      undefined,
      (error) => {
        console.error("Error table model model:", error);
        reject(error);
      }
    );
  });
}

async function loadCoffeeCupModel(loader: GLTFLoader): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const coffeeCupPath = "./src/assets/models/coffee_cup.glb";

    loader.load(
      coffeeCupPath,
      (gltf: GLTF) => {
        coffeeCupModel = gltf.scene;
        resolve();
      },
      undefined,
      (error) => {
        console.error("Error coffee cup model model:", error);
        reject(error);
      }
    );
  });
}

onMounted(async () => {
  await initScene();
});
</script>

<style scoped>
.model-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
