import './style.css';
import * as THREE from "three";
import spaceBG from "./bg/space.jpg";

//canvas
const canvas = document.querySelector("#webgl");
 
//シーン
const scene = new THREE.Scene();

//背景用のテクスチャ
const textureLoader = new THREE.TextureLoader();
const bgTexture = textureLoader.load(spaceBG);
scene.background = bgTexture;
 
//サイズ
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
 
//カメラ
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
 
//レンダラー
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

//オブジェクトを作成
const boxGeometry = new THREE.BoxGeometry(5, 5, 5, 10);
const boxMaterial = new THREE.MeshNormalMaterial();
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0, 0.5, -15);
box.rotation.set(1, 1, 0);

const torusGeometry = new THREE.TorusGeometry(8, 2, 16, 100);
const torusMaterial = new THREE.MeshNormalMaterial();
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(0, 1, 10);

scene.add(box, torus);

//線形補間で滑らかに移動
function lerp(x, y, a) {
  return (1- a) * x + a * y;
};

//スクロールアニメーション
const animationScripts = [];
animationScripts.push({
  start: 0,
  end: 40,
  function() {
    camera.lookAt(box.position);
    camera.position.set(0, 1, 10);
    box.position.z = lerp(-15, 2, scalePercent(0, 40));
    torus.position.z = lerp(10, -20, scalePercent(0, 40));
  },
});

animationScripts.push({
  start: 40,
  end: 60,
  function() {
    camera.lookAt(box.position);
    camera.position.set(0, 1, 10);
    box.rotation.z = lerp(1, Math.PI, scalePercent(40, 60));
  },
});

animationScripts.push({
  start: 60,
  end: 80,
  function() {
    camera.lookAt(box.position);
    camera.position.x = lerp(0, -15, scalePercent(60, 80));
    camera.position.y = lerp(1, 15, scalePercent(60, 80));
    camera.position.z = lerp(10, 15, scalePercent(60, 80));
  },
});

animationScripts.push({
  start: 80,
  end: 90,
  function() {
    camera.lookAt(box.position);
    box.rotation.x += 0.02;
    box.rotation.y += 0.02;
    torus.rotation.y += 0.04;
    torus.rotation.z += 0.04;
  },
});

let rot = 0;
animationScripts.push({
  start: 90,
  end: 100,
  function() {
    box.rotation.x += 0.02;
    box.rotation.y += 0.02;
    torus.rotation.y += 0.04;
    torus.rotation.z += 0.04;
    rot += 0.5;
    let radian = rot * (Math.PI / 180);
    camera.position.x = lerp(-15, Math.sin(radian) * 30, scalePercent(80, 100));
    camera.position.y = lerp(15, Math.cos(radian) * 30, scalePercent(80, 100));
    camera.position.z = lerp(15, 20, scalePercent(90, 100));
    camera.lookAt(box.position);
  },
});

//どの区間のどの割合の位置にいるかの確認
function scalePercent(start, end) {
  return (scrollParcent - start) / (end - start);
};

//アニメーションを開始
function playScrollAnimation() {
  animationScripts.forEach((animation) => {
    if(scrollParcent >= animation.start && scrollParcent <= animation.end)
    animation.function();
  });
};

//ブラウザのスクロール率を取得
let scrollParcent = 0;
document.body.onscroll = () => {
  scrollParcent = 
    ((document.documentElement.scrollTop / 
      (document.documentElement.scrollHeight - 
        document.documentElement.clientHeight))) * 100;
        // console.log(scrollParcent);
};

//アニメーション
const tick = () => {
  window.requestAnimationFrame(tick);
  playScrollAnimation();
  renderer.render(scene, camera);
};
 
tick();
 
//ブラウザのリサイズ操作
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
 
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
 
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});