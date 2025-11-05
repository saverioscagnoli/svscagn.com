import React from "react";
import * as THREE from "three";

type PlanetProps = {
  ref?: React.Ref<THREE.Group>;
  position: [number, number, number];
  radius: number;
  color: string;
  hasRing?: boolean;
  ringInnerRadius?: number;
  ringThickness?: number;
  ringSegments?: number;
  ringColor?: string;
  ringRotation?: [number, number, number];
};

const Planet: React.FC<PlanetProps> = ({
  ref,
  position,
  radius,
  color,
  hasRing = false,
  ringInnerRadius = 1.5,
  ringThickness = 0.2,
  ringSegments = 8,
  ringColor = "#aaaaaa",
  ringRotation = [Math.PI / 2, 0, 0]
}) => {
  return (
    <group position={position} ref={ref}>
      {/* Planet sphere */}
      <mesh>
        <sphereGeometry args={[radius, 10, 8]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>

      {/* Optional ring */}
      {hasRing && (
        <mesh rotation={ringRotation}>
          <torusGeometry
            args={[ringInnerRadius, ringThickness, ringSegments, 16]}
          />
          <meshStandardMaterial color={ringColor} flatShading />
        </mesh>
      )}
    </group>
  );
};

export { Planet };
