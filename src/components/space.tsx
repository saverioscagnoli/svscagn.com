import React, { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Points } from "three";

type StarsProps = {
  count?: number;
  radius?: number;
};

const Stars: React.FC<StarsProps> = ({ count = 500, radius = 10 }) => {
  const ref = useRef<Points | null>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius + Math.random() * 4;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      arr[i * 3 + 0] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, [count, radius]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        {/* @ts-ignore */}
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.04}
        sizeAttenuation={true}
        transparent
        opacity={0.9}
      />
    </points>
  );
};

const Saturn = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [time] = useState(Math.random() * Math.PI * 2);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Wandering orbit path
      const t = clock.getElapsedTime() * 0.2 + time;
      const radius = 10;
      groupRef.current.position.x = Math.cos(t) * radius;
      groupRef.current.position.y = Math.sin(t * 0.7) * 2;
      groupRef.current.position.z = Math.sin(t) * radius - 8;

      // Slow rotation
      groupRef.current.rotation.y += 0.005;
      groupRef.current.rotation.x = Math.sin(t * 0.5) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[1.2, 8, 6]} />
        <meshStandardMaterial
          color="#f4d03f"
          flatShading
          emissive="#8b6914"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Ring */}
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[1.9, 0.25, 6, 16]} />
        <meshStandardMaterial
          color="#f9e79f"
          flatShading
          emissive="#c19a6b"
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
};

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
  }, 1);
  return null;
};

const Space = ({ pixelSize }: { pixelSize: number }) => {
  return (
    <>
      <color attach="background" args={["#1a1a2e"]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, 5]} color="#4ecdc4" intensity={0.8} />

      <Stars count={1000} radius={15} />
      <Saturn />

      <PixelatedEffect pixelSize={pixelSize} />
    </>
  );
};

export { Space };
