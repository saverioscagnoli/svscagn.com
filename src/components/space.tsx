import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Planet } from "~/components/planet";
import { Stars } from "~/components/stars";
import { TexturePlane } from "~/components/texture-plane";

const STARS_ROTATING_FACTOR = 0.001;
const PLANETS_ROTATING_FACTOR = [Math.random() * 0.5, Math.random() * 0.5];

const Space = () => {
  const groupRef = useRef<THREE.Group>(null);
  const planet1Ref = useRef<THREE.Group>(null);
  const planet2Ref = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  useEffect(() => {
    if (planet1Ref.current) {
      planet1Ref.current.rotation.x = Math.random() * Math.PI;
      planet1Ref.current.rotation.y = Math.random() * Math.PI;
      planet1Ref.current.rotation.z = Math.random() * Math.PI;
    }

    if (planet2Ref.current) {
      planet2Ref.current.rotation.x = Math.random() * Math.PI;
      planet2Ref.current.rotation.y = Math.random() * Math.PI;
      planet2Ref.current.rotation.z = Math.random() * Math.PI;
    }
  }, [planet1Ref.current, planet2Ref.current]);

  useFrame((_, dt) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += STARS_ROTATING_FACTOR * dt;
    }

    if (planet1Ref.current) {
      planet1Ref.current.rotation.y += dt * PLANETS_ROTATING_FACTOR[0];
      planet1Ref.current.rotation.x += dt * PLANETS_ROTATING_FACTOR[0];
    }

    if (planet2Ref.current) {
      planet2Ref.current.rotation.y += dt * PLANETS_ROTATING_FACTOR[1];
      planet2Ref.current.rotation.x += dt * PLANETS_ROTATING_FACTOR[1];
    }
  });

  const randomSeed = useRef(Math.random() * 1000);

  const positions = useMemo(() => {
    let seed = randomSeed.current;

    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const getRandomPosition = (
      zPos: number,
      existingPositions: Array<{ x: number; y: number }> = [],
      margin: number = 0.9,
      centerExclusion: number = 0.3,
      minDistance: number = 15
    ) => {
      const viewportAtZ = viewport.getCurrentViewport(undefined, [0, 0, zPos]);
      const maxX = (viewportAtZ.width / 2) * margin;
      const maxY = (viewportAtZ.height / 2) * margin;
      const centerX = (viewportAtZ.width / 2) * centerExclusion;
      const centerY = (viewportAtZ.height / 2) * centerExclusion;

      let x: number, y: number;
      let attempts = 0;
      const maxAttempts = 50;

      do {
        x = (seededRandom() - 0.5) * 2 * maxX;
        y = (seededRandom() - 0.5) * 2 * maxY;
        attempts++;

        const isOutsideCenter = Math.abs(x) > centerX || Math.abs(y) > centerY;

        const isFarEnough = existingPositions.every(pos => {
          const distance = Math.sqrt(
            Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2)
          );
          return distance >= minDistance;
        });

        if (isOutsideCenter && isFarEnough) {
          break;
        }
      } while (attempts < maxAttempts);

      return { x, y };
    };

    const existing: Array<{ x: number; y: number }> = [];

    const planet1 = { ...getRandomPosition(-50, existing), z: -50 };
    existing.push({ x: planet1.x, y: planet1.y });

    const planet2 = { ...getRandomPosition(-50, existing), z: -50 };
    existing.push({ x: planet2.x, y: planet2.y });

    const galaxy1 = { ...getRandomPosition(-50, existing), z: -50 };
    existing.push({ x: galaxy1.x, y: galaxy1.y });

    const galaxy2 = { ...getRandomPosition(-75, existing), z: -75 };
    existing.push({ x: galaxy2.x, y: galaxy2.y });

    const blackHole = { ...getRandomPosition(-100, existing), z: -100 };

    return {
      planet1,
      planet2,
      galaxy1,
      galaxy2,
      blackHole
    };
  }, [viewport]);

  return (
    <>
      <Planet
        position={[
          positions.planet1.x,
          positions.planet1.y,
          positions.planet1.z
        ]}
        radius={2}
        color="#ffffff"
        hasRing
        ringColor="orange"
        ringInnerRadius={3}
        ringThickness={0.4}
        ringRotation={[20, 120, 0]}
        ref={planet1Ref}
      />
      <Planet
        position={[
          positions.planet2.x,
          positions.planet2.y,
          positions.planet2.z
        ]}
        radius={2}
        color="red"
        hasRing
        ringColor="cyan"
        ringInnerRadius={3}
        ringThickness={0.4}
        ringRotation={[20, 120, 0]}
        ref={planet2Ref}
      />
      <TexturePlane
        textureUrl="/galaxy-1.webm"
        position={[
          positions.galaxy1.x,
          positions.galaxy1.y,
          positions.galaxy1.z
        ]}
      />
      <TexturePlane
        textureUrl="/galaxy-2.webm"
        position={[
          positions.galaxy2.x,
          positions.galaxy2.y,
          positions.galaxy2.z
        ]}
        scale={2}
      />
      <TexturePlane
        textureUrl="/black-hole.webm"
        position={[
          positions.blackHole.x,
          positions.blackHole.y,
          positions.blackHole.z
        ]}
        scale={3}
      />
      <group ref={groupRef}>
        <Stars count={2000} radius={1500} />
      </group>
    </>
  );
};

export { Space };
