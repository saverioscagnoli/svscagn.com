import React, { useEffect, useRef } from "react";
import * as THREE from "three";

type PlanetProps = {
  ref?: React.Ref<THREE.Group>;
  position: [number, number, number];
  radius: number;
  color: string;
  emissive: string;
  emissiveIntensity: number;
  hasRing?: boolean;
  ringInnerRadius?: number;
  ringThickness?: number;
  ringSegments?: number;
  ringColor?: string;
  ringEmissive?: string;
  ringEmissiveIntensity?: number;
  ringRotation?: [number, number, number];
};

const Planet: React.FC<PlanetProps> = ({
  ref,
  position,
  radius,
  color,
  emissive,
  emissiveIntensity,
  hasRing = false,
  ringInnerRadius = 1.5,
  ringThickness = 0.2,
  ringSegments = 8,
  ringColor = "#aaaaaa",
  ringEmissive = "#555555",
  ringEmissiveIntensity = 0.3,
  ringRotation = [Math.PI / 2, 0, 0]
}) => {
  return (
    <group position={position} ref={ref}>
      {/* Planet sphere */}
      <mesh>
        <sphereGeometry args={[radius, 10, 8]} />
        <meshStandardMaterial
          color={color}
          flatShading
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Optional ring */}
      {hasRing && (
        <mesh rotation={ringRotation}>
          <torusGeometry
            args={[ringInnerRadius, ringThickness, ringSegments, 16]}
          />
          <meshStandardMaterial
            color={ringColor}
            flatShading
            emissive={ringEmissive}
            emissiveIntensity={ringEmissiveIntensity}
          />
        </mesh>
      )}
    </group>
  );
};

export { Planet };
