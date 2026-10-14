import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Resident from './Resident';
import EngineerDesk from './EngineerDesk';
import { residents } from '../data/residents';

function ForestWorld({ onResidentClick, joystick }) {
  const playerRef = useRef();
  const keys = useRef({});
  const lastTalkTime = useRef(0);
  const playerPosition = useRef({ x: 0, z: 0 });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyE'].includes(event.code)) {
        event.preventDefault();
      }
      keys.current[event.code] = true;
    };

    const handleKeyUp = (event) => {
      keys.current[event.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    const moveX =
      (keys.current.KeyD || keys.current.ArrowRight ? 1 : 0) -
      (keys.current.KeyA || keys.current.ArrowLeft ? 1 : 0) +
      joystick.x;

    const moveZ =
      (keys.current.KeyW || keys.current.ArrowUp ? 1 : 0) -
      (keys.current.KeyS || keys.current.ArrowDown ? 1 : 0) +
      -joystick.y;

    const moveLength = Math.hypot(moveX, moveZ);
    const directionX = moveLength > 0 ? moveX / moveLength : 0;
    const directionZ = moveLength > 0 ? moveZ / moveLength : 0;

    const speed = 2.8;
    playerPosition.current.x = THREE.MathUtils.clamp(
      playerPosition.current.x + directionX * speed * delta,
      -6.5,
      6.5,
    );
    playerPosition.current.z = THREE.MathUtils.clamp(
      playerPosition.current.z + directionZ * speed * delta,
      -6.7,
      6.7,
    );

    if (playerRef.current) {
      playerRef.current.position.set(playerPosition.current.x, 0.38, playerPosition.current.z);

      if (moveLength > 0.01) {
        playerRef.current.rotation.y = Math.atan2(directionX, directionZ);
      }
    }

    const camera = state.camera;
    const cameraTarget = new THREE.Vector3(
      playerPosition.current.x,
      1.2,
      playerPosition.current.z,
    );
    const desiredPosition = new THREE.Vector3(
      playerPosition.current.x,
      5.2,
      playerPosition.current.z + 7.2,
    );

    camera.position.lerp(desiredPosition, 1 - Math.exp(-delta * 4));
    camera.lookAt(cameraTarget);

    lastTalkTime.current = Math.max(0, lastTalkTime.current - delta);

    if (keys.current.KeyE || keys.current.KeyQ) {
      const nearestResident = residents.find((resident) => {
        const [rx, , rz] = resident.position;
        return Math.hypot(playerPosition.current.x - rx, playerPosition.current.z - rz) < 1.5;
      });

      if (nearestResident && lastTalkTime.current === 0) {
        onResidentClick(nearestResident);
        lastTalkTime.current = 0.4;
      }
    }
  });

  return (
    <>
      <color attach="background" args={['#edf7ef']} />
      <ambientLight intensity={2.2} color="#fff6d5" />
      <directionalLight
        castShadow
        position={[7, 10, 5]}
        intensity={1.8}
        color="#fff3bb"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <group position={[0, -0.8, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#a8d58d" />
        </mesh>

        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <ringGeometry args={[5.3, 6.4, 64]} />
          <meshStandardMaterial color="#cfeab4" />
        </mesh>

        <RoundedBox args={[2.6, 0.2, 1.1]} radius={0.08} position={[0, 0.12, 0]} receiveShadow>
          <meshStandardMaterial color="#d9c8a1" />
        </RoundedBox>

        {[
          [-2.7, 0.2, -2.8],
          [2.8, 0.2, -3.1],
          [3.8, 0.2, 1.8],
          [-2.8, 0.3, 2.6],
          [4.3, 0.3, 3.1],
          [-4.2, 0.2, -1.2],
        ].map(([x, y, z], index) => (
          <group key={index} position={[x, y, z]}>
            <mesh castShadow position={[0, 0.18, 0]}>
              <cylinderGeometry args={[0.18, 0.24, 0.35, 12]} />
              <meshStandardMaterial color="#8a6548" />
            </mesh>
            <mesh castShadow position={[0, 0.8, 0]}>
              <coneGeometry args={[0.75, 1.5, 14]} />
              <meshStandardMaterial color={index % 2 === 0 ? '#4a9b67' : '#67b77e'} />
            </mesh>
          </group>
        ))}

        {[
          [-1.6, 0.08, 2.4, '#ffbfd7'],
          [1.9, 0.08, 2.5, '#ffd88a'],
          [-3.2, 0.08, 0.5, '#ffbfd7'],
          [2.3, 0.08, -0.6, '#ffd88a'],
          [4.4, 0.08, 0.8, '#ffbfd7'],
          [-4.3, 0.08, -3.2, '#ffd88a'],
          [0.8, 0.08, 3.7, '#ffbfd7'],
        ].map(([x, y, z, color], index) => (
          <mesh key={index} position={[x, y, z]} castShadow>
            <sphereGeometry args={[0.16, 10, 10]} />
            <meshStandardMaterial color={color} />
          </mesh>
        ))}

        {residents.map((resident) => (
          <Resident
            key={resident.id}
            resident={resident}
            onSelect={onResidentClick}
          />
        ))}

        <EngineerDesk />

        <group ref={playerRef} position={[0, 0.38, 0]}>
          <mesh castShadow position={[0, 0.7, 0]}>
            <sphereGeometry args={[0.42, 24, 24]} />
            <meshStandardMaterial color="#f4d3a9" />
          </mesh>
          <mesh castShadow position={[0, 1.15, 0.12]}>
            <sphereGeometry args={[0.22, 18, 18]} />
            <meshStandardMaterial color="#f4d3a9" />
          </mesh>
          <mesh castShadow position={[0, 0.28, 0.42]}>
            <boxGeometry args={[0.46, 0.16, 0.22]} />
            <meshStandardMaterial color="#f5f3ee" />
          </mesh>
        </group>
      </group>
    </>
  );
}

export default function ForestScene({ onResidentClick, joystick }) {
  return (
    <div className="scene-wrap">
      <Canvas shadows camera={{ position: [0, 5.2, 7.2], fov: 42 }}>
        <ForestWorld onResidentClick={onResidentClick} joystick={joystick} />
      </Canvas>
    </div>
  );
}
