import * as THREE from "three";
import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";

interface PixelatedEffectProps {
  pixelSize?: number;
}

const PixelatedCRTEffect: React.FC<PixelatedEffectProps> = ({
  pixelSize = 4
}) => {
  const composerRef = useRef<any>(null);
  const timeRef = useRef(0);
  const quadSceneRef = useRef<THREE.Scene | null>(null);
  const quadCameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const quadGeometryRef = useRef<THREE.PlaneGeometry | null>(null);
  const quadMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const quadMeshRef = useRef<THREE.Mesh | null>(null);

  const { gl, scene, camera, size } = useThree();

  useEffect(() => {
    if (!quadSceneRef.current) {
      quadSceneRef.current = new THREE.Scene();
      quadCameraRef.current = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      quadGeometryRef.current = new THREE.PlaneGeometry(2, 2);

      quadMaterialRef.current = new THREE.ShaderMaterial({
        uniforms: {
          tDiffuse: { value: null },
          time: { value: 0 },
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

            // Discard outside curved area - make it black
            if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
              gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
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

      quadMeshRef.current = new THREE.Mesh(
        quadGeometryRef.current,
        quadMaterialRef.current
      );
      quadSceneRef.current.add(quadMeshRef.current);
    }

    // Cleanup on unmount
    return () => {
      if (quadGeometryRef.current) quadGeometryRef.current.dispose();
      if (quadMaterialRef.current) quadMaterialRef.current.dispose();
      if (composerRef.current?.renderTarget)
        composerRef.current.renderTarget.dispose();
    };
  }, []);

  useFrame((_, delta) => {
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

    // Render main scene to render target
    gl.setRenderTarget(composerRef.current.renderTarget);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    gl.clear();

    // Update shader uniforms
    if (quadMaterialRef.current) {
      quadMaterialRef.current.uniforms.tDiffuse.value =
        composerRef.current.renderTarget.texture;
      quadMaterialRef.current.uniforms.time.value = timeRef.current;
      quadMaterialRef.current.uniforms.resolution.value.set(
        size.width,
        size.height
      );
    }

    // Render quad with effects to screen
    if (quadSceneRef.current && quadCameraRef.current) {
      gl.render(quadSceneRef.current, quadCameraRef.current);
    }
  }, 1);

  return null;
};

export { PixelatedCRTEffect };
