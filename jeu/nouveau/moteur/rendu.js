import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';

export const PRESETS = {
  bas: { ratio: 0.75, msaa: 0, ao: false, bloom: false, fxaa: true, ombres: false, anisotropie: 2 },
  moyen: { ratio: 1.0, msaa: 0, ao: false, bloom: true, fxaa: true, ombres: false, anisotropie: 4 },
  eleve: { ratio: 1.25, msaa: 4, ao: true, aoMoitie: true, bloom: true, fxaa: false, ombres: true, anisotropie: 8 },
  ultra: { ratio: 2.0, msaa: 4, ao: true, aoMoitie: false, bloom: true, fxaa: false, ombres: true, anisotropie: 16 },
};

export function detecterQualite(renderer) {
  const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.userAgent));
  if (mobile) return 'bas';
  let nom = '';
  try {
    const gl = renderer.getContext();
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    nom = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : '';
  } catch { /* information indisponible */ }
  if (/RTX|GTX 1[6-9]|GTX 20|RX [5-7]\d{3}|Radeon Pro|Apple M[2-9]|Arc A/i.test(nom)) return 'eleve';
  if (/Intel|Radeon\(TM\) Graphics|Vega|Mali|Adreno|PowerVR|Apple M1|SwiftShader/i.test(nom)) return 'moyen';
  return 'moyen';
}

const LM_CHUNK = THREE.ShaderChunk.lights_fragment_maps
  .replace(
    'irradiance += lightMapIrradiance;',
    'irradiance += lightMapIrradiance;\n\t\tfloat lmLum = dot( lightMapIrradiance, vec3( 0.2126, 0.7152, 0.0722 ) );\n\t\tlmOcclusionSpec = clamp( lmLum * 1.4, 0.12, 1.0 );'
  )
  .replace('iblIrradiance += getIBLIrradiance( geometryNormal );', '')
  .replace(
    'radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );',
    'radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness ) * lmOcclusionSpec;'
  );

export function preparerMateriauLightmap(materiau) {
  if (materiau.userData.lmPatch) return;
  materiau.userData.lmPatch = true;
  materiau.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader
      .replace('void main() {', 'void main() {\n\tfloat lmOcclusionSpec = 1.0;')
      .replace('#include <lights_fragment_maps>', LM_CHUNK);
  };
  materiau.customProgramCacheKey = () => 'lm-v1';
  materiau.needsUpdate = true;
}

export function creerRendu(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    powerPreference: 'high-performance',
    stencil: false,
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.AgXToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = false;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.05, 900);
  scene.add(camera);
  const pmrem = new THREE.PMREMGenerator(renderer);

  let preset = PRESETS.moyen;
  let composer = null;
  let gtao = null, bloom = null, fxaa = null, bokeh = null;
  let flouVoulu = { actif: false, distance: 2 };
  const taille = new THREE.Vector2();

  function construireComposer() {
    composer?.dispose?.();
    composer = null; gtao = null; bloom = null; fxaa = null; bokeh = null;
    renderer.getSize(taille);
    const pr = renderer.getPixelRatio();
    const rt = new THREE.WebGLRenderTarget(taille.x * pr, taille.y * pr, {
      type: THREE.HalfFloatType,
      samples: preset.msaa,
    });
    composer = new EffectComposer(renderer, rt);
    composer.addPass(new RenderPass(scene, camera));
    if (preset.ao) {
      const w = taille.x * pr * (preset.aoMoitie ? 0.5 : 1);
      const h = taille.y * pr * (preset.aoMoitie ? 0.5 : 1);
      gtao = new GTAOPass(scene, camera, w, h);
      gtao.output = GTAOPass.OUTPUT.Default;
      gtao.blendIntensity = 0.85;
      gtao.updateGtaoMaterial({ radius: 0.45, distanceExponent: 1.4, thickness: 1.2, scale: 1.0, samples: 12 });
      gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 12 });
      composer.addPass(gtao);
    }
    if (preset.ao) {
      bokeh = new BokehPass(scene, camera, { focus: 2, aperture: 0.0025, maxblur: 0.006 });
      bokeh.enabled = flouVoulu.actif;
      composer.addPass(bokeh);
    }
    if (preset.bloom) {
      bloom = new UnrealBloomPass(new THREE.Vector2(taille.x, taille.y), 0.22, 0.55, 0.92);
      composer.addPass(bloom);
    }
    composer.addPass(new OutputPass());
    if (preset.fxaa) {
      fxaa = new ShaderPass(FXAAShader);
      fxaa.material.uniforms.resolution.value.set(1 / (taille.x * pr), 1 / (taille.y * pr));
      composer.addPass(fxaa);
    }
  }

  function redimensionner() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, preset.ratio));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (composer) {
      const pr = renderer.getPixelRatio();
      composer.setPixelRatio(pr);
      composer.setSize(w, h);
      if (fxaa) fxaa.material.uniforms.resolution.value.set(1 / (w * pr), 1 / (h * pr));
      if (gtao) gtao.setSize(w * pr * (preset.aoMoitie ? 0.5 : 1), h * pr * (preset.aoMoitie ? 0.5 : 1));
    }
  }

  function appliquerQualite(nom) {
    const cle = nom === 'auto' || !PRESETS[nom] ? detecterQualite(renderer) : nom;
    preset = PRESETS[cle];
    renderer.shadowMap.enabled = preset.ombres;
    redimensionner();
    construireComposer();
    return cle;
  }

  function flou(actif, distance = 2) {
    flouVoulu = { actif, distance };
    if (!bokeh) return;
    bokeh.enabled = actif;
    bokeh.uniforms.focus.value = distance;
  }

  function rendre() {
    if (composer) composer.render();
    else renderer.render(scene, camera);
  }

  window.addEventListener('resize', redimensionner);

  return {
    renderer, scene, camera, pmrem,
    appliquerQualite, redimensionner, rendre, flou,
    get preset() { return preset; },
  };
}
