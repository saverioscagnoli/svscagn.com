import React, { useRef, useState, type JSX, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Planet } from "./planet";
import { pick, rng } from "~/lib/utils";
import { Stars } from "@react-three/drei";

type PixelatedEffectProps = {
  pixelSize: number;
};

const PixelatedEffect: React.FC<PixelatedEffectProps> = ({ pixelSize }) => {
  const composerRef = useRef<any>(null);
  const timeRef = useRef(0);

  useFrame(({ gl, scene, camera, size }, delta) => {
    timeRef.current += delta;

    const w = Math.floor(size.width / pixelSize);
    const h = Math.floor(size.height / pixelSize);

    if (!composerRef.current) {
      const renderTarget = new THREE.WebGLRenderTarget(w, h, {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat
      });

      composerRef.current = { renderTarget, w, h };
    } else if (composerRef.current.w !== w || composerRef.current.h !== h) {
      composerRef.current.renderTarget.setSize(w, h);
      composerRef.current.w = w;
      composerRef.current.h = h;
    }

    gl.setRenderTarget(composerRef.current.renderTarget);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    gl.clear();

    const quadScene = new THREE.Scene();
    const quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quadGeometry = new THREE.PlaneGeometry(2, 2);

    const quadMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: composerRef.current.renderTarget.texture },
        time: { value: timeRef.current },
        resolution: { value: new THREE.Vector2(size.width, size.height) }
      },
      vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
      fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform vec2 resolution;
    varying vec2 vUv;

    // --- CRT screen curvature ---
    vec2 curveRemapUV(vec2 uv) {
      uv = uv * 2.0 - 1.0;
      vec2 offset = abs(uv.yx) / vec2(4.0, 4.0); // higher = gentler curve
      uv += uv * offset * offset * 0.5;          // 0.5 multiplier softens more
      uv = uv * 0.5 + 0.5;
      return uv;
    }

    void main() {
      vec2 uv = curveRemapUV(vUv);

      // Discard outside curved area
      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        gl_FragColor = vec4(0.0);
        return;
      }

      vec4 color = texture2D(tDiffuse, uv);

      // --- Scanlines ---
      float scanIntensity = 0.08;
      float scanFreq = 2.5;
      float scanline = 0.5 + 0.5 * sin(uv.y * resolution.y * scanFreq);
      color.rgb *= 0.9 + 0.1 * scanline;

      float strongLine = smoothstep(0.95, 1.0, sin(uv.y * resolution.y * 0.3));
      color.rgb *= 1.0 - strongLine * 0.1;

      // --- Vignette ---
      vec2 vignetteUV = vUv * (1.0 - vUv.yx);
      float vignette = vignetteUV.x * vignetteUV.y * 15.0;
      vignette = pow(vignette, 0.25);
      color.rgb *= vignette;

      // --- Chromatic aberration ---
      float aberration = 0.002;
      float r = texture2D(tDiffuse, uv + vec2(aberration, 0.0)).r;
      float b = texture2D(tDiffuse, uv - vec2(aberration, 0.0)).b;
      color.r = r;
      color.b = b;

      // --- Flicker ---
      float flicker = 0.98 + 0.02 * sin(time * 20.0);
      color.rgb *= flicker;

      // --- Green tint ---
      color.g *= 1.05;

      // --- Glass reflection hint ---
      vec3 glassTint = vec3(0.05, 0.08, 0.1);
      float curveAmount = pow(abs(uv.x - 0.5) + abs(uv.y - 0.5), 2.0);
      color.rgb += glassTint * curveAmount * 0.6;

      // --- Glow center (emphasize curvature) ---
      float edgeDist = distance(vUv, vec2(0.5));
      float glow = smoothstep(0.8, 0.2, edgeDist);
      color.rgb *= 0.9 + 0.1 * glow;

      gl_FragColor = color;
    }
  `
    });

    const quad = new THREE.Mesh(quadGeometry, quadMaterial);

    quadScene.add(quad);
    gl.render(quadScene, quadCamera);
    quadGeometry.dispose();
    quadMaterial.dispose();
    2;
  }, 1);
  return null;
};

const planetColors = [
  "#FF6B6B",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#9D4EDD",
  "#FF8FAB",
  "#00F5D4",
  "#F15BB5",
  "#C1C8E4"
];

const randomPlanet = (
  frustumWidth: number,
  frustumHeight: number,
  z: number,
  ring: boolean
): JSX.Element => {
  const excludeZoneWidth = frustumWidth * 0.4;
  const excludeZoneHeight = frustumHeight * 0.4;

  let x, y;
  do {
    x = rng(-frustumWidth / 2, frustumWidth / 2);
    y = rng(-frustumHeight / 2, frustumHeight / 2);
  } while (
    Math.abs(x) < excludeZoneWidth / 2 &&
    Math.abs(y) < excludeZoneHeight / 2
  );

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  // Always tilt ring slightly so it passes behind the planet
  const tiltDir = Math.random() < 0.5 ? 1 : -1; // flip tilt direction
  const xRotation = toRad(rng(55, 70) * tiltDir); // always has backward tilt
  const zRotation = toRad(rng(-15, 15));

  return (
    <Planet
      position={[x, y, z]}
      radius={rng(8, 12)}
      color={pick(planetColors)}
      hasRing={ring}
      ringInnerRadius={18}
      ringRotation={[xRotation, 0, zRotation]}
      ringThickness={1.5}
    />
  );
};

const Space = ({ pixelSize }: { pixelSize: number }) => {
  const [planets, setPlanets] = useState<JSX.Element[]>();
  const { camera, size } = useThree();

  const frustumAtZ = (z: number) => {
    let cam = camera as THREE.PerspectiveCamera;
    let distance = cam.position.z - z;
    let fovRad = (cam.fov * Math.PI) / 180;
    let height = 2 * Math.tan(fovRad / 2) * distance;
    let width = height * (size.width / size.height);

    return { width, height };
  };

  useEffect(() => {
    const newPlanets: JSX.Element[] = [];
    const z = -300;
    const frustum = frustumAtZ(z);

    for (let i = 0; i < 2; i++) {
      newPlanets.push(randomPlanet(frustum.width, frustum.height, z, !i));
    }

    setPlanets(newPlanets);
  }, []);

  return (
    <>
      <color attach="background" args={["#1a1a2e"]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, 5]} color="#4ecdc4" intensity={0.8} />
      <Stars count={1500} radius={150} speed={0.1} />
      {planets}
      <PixelatedEffect pixelSize={pixelSize} />
    </>
  );
};

export { Space };
