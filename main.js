import './style.css';
import * as THREE from "three";
import starsBG from "./bg/stars.jpeg";

//canvas
const canvas = document.querySelector("#webgl");
 
//シーン
const scene = new THREE.Scene();

//背景用のテクスチャ
const textureLoader = new THREE.TextureLoader();
const bgTexture = textureLoader.load(starsBG);
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
const sphereGeometry = new THREE.SphereGeometry(10, 32, 16);
const sphereMaterial = new THREE.MeshNormalMaterial({
  wireframe: true,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 0.5, -20);

const torusGeometry1 = new THREE.TorusGeometry(5, 1, 16, 100);
const torusGeometry2 = new THREE.TorusGeometry(10, 1.5, 16, 150);
const torusMaterial = new THREE.MeshNormalMaterial();
const torus1 = new THREE.Mesh(torusGeometry1, torusMaterial);
const torus2 = new THREE.Mesh(torusGeometry2, torusMaterial);
torus1.position.set(0, 1, 15);
torus2.position.set(0, 1, 30);

scene.add(sphere, torus1, torus2);

// //線形補間で滑らかに移動
function lerp(x, y, a) {
  return (1- a) * x + a * y;
};

// //スクロールアニメーション
const animationScripts = [];
animationScripts.push({
  start: 0,
  end: 30,
  function() {
    camera.lookAt(sphere.position);
    camera.position.set(0, 1, 15);
    sphere.position.z = lerp(-30, 0, scalePercent(0, 35));
    torus1.position.z = lerp(15, -30, scalePercent(0, 35));
    torus2.position.z = lerp(30, -20, scalePercent(0, 35));
  },
});

animationScripts.push({
  start: 35,
  end: 60,
  function() {
    camera.lookAt(sphere.position);
    camera.position.set(0, 1, 15);
    torus1.rotation.y = lerp(0, Math.PI * 2, scalePercent(35, 60));
    torus2.rotation.y = lerp(0, -Math.PI * 2, scalePercent(35, 60));
  },
});

animationScripts.push({
  start: 60,
  end: 80,
  function() {
    camera.lookAt(sphere.position);
    camera.position.x = lerp(0, -40, scalePercent(60, 80));
    camera.position.y = lerp(1, 0, scalePercent(60, 80));
    camera.position.z = lerp(15, -5, scalePercent(60, 80));
    torus2.position.z = lerp(-20, 30, scalePercent(60, 80));
  },
});


animationScripts.push({
  start: 80,
  end: 100,
  function() {
    camera.lookAt(sphere.position);

    sphere.rotation.x += 0.02;
    sphere.rotation.y += 0.02;
    torus1.rotation.y += 0.06;
    torus1.rotation.z += 0.06;
    torus2.rotation.y += 0.04;
    torus2.rotation.z += 0.04;
    
    const radian = lerp(0, Math.PI * 2, scalePercent(80, 100));

    torus1.position.x = 30 * Math.sin(radian);
    torus1.position.z = -30 * Math.cos(radian);

    torus2.position.x = 30 * Math.sin(radian);
    torus2.position.z = 30 * Math.cos(radian);

    camera.position.z = lerp(-5, 50, scalePercent(80, 100));
  },
});

//各区間のどの割合の位置にいるかの確認
function scalePercent(start, end) {
  return (scrollParcent - start) / (end - start);
};

// //アニメーションを開始
function playScrollAnimation() {
  animationScripts.forEach((animation) => {
    if (scrollParcent >= animation.start && scrollParcent <= animation.end)
    animation.function();
  });
};

// //ブラウザのスクロール率を取得
let scrollParcent = 0;
document.body.onscroll = () => {
  scrollParcent = 
    ((document.documentElement.scrollTop / 
      (document.documentElement.scrollHeight - document.documentElement.clientHeight))) * 100;
  console.log(scrollParcent);
};

//アニメーション
const tick = () => {
  window.requestAnimationFrame(tick);
  playScrollAnimation();
  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;
  sphere.rotation.z += 0.01;
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