import { useVideoTexture } from "@react-three/drei";
import { useTexture } from "@react-three/drei";
import React from "react";
import * as THREE from "three";

interface TexturePlaneProps {
  textureUrl: string;
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  ref?: React.Ref<THREE.Mesh>;
}

const TexturePlane: React.FC<TexturePlaneProps> = ({
  textureUrl,
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
  ref
}) => {
  const isVideo = textureUrl.match(/\.(mp4|webm|ogg)$/i);

  const texture = isVideo
    ? useVideoTexture(textureUrl, { loop: true, muted: true, start: true })
    : useTexture(textureUrl);

  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <planeGeometry args={[scale * 10, scale * 10]} />
      <meshBasicMaterial
        map={texture}
        transparent
        side={THREE.DoubleSide}
        alphaTest={0.01}
      />
    </mesh>
  );
};

export { TexturePlane };
