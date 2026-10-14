import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import Resident from './Resident';
import EngineerDesk from './EngineerDesk';
import { residents } from '../data/residents';

const FOREST_LIMITS = {
  minX: -7,
  maxX: 7,
  minZ: -7,
  maxZ: 7,
};

const initialCameraPosition = new THREE.Vector3(9, 7, 12);
const initialTarget = new THREE.Vector3(0, 0.8, 0);

const clampPoint = (point) =>
  new THREE.Vector3(
    THREE.MathUtils.clamp(point.x, FOREST_LIMITS.minX, FOREST_LIMITS.maxX),
    THREE.MathUtils.clamp(point.y, 1.2, 18),
    THREE.MathUtils.clamp(point.z, FOREST_LIMITS.minZ, FOREST_LIMITS.maxZ),
  );

const buildings = [
  {
    id: 'engineering-desk',
    name: '仕様書作成室',
    description:
      '森の端にある作業台。ここでは、曖昧な要件を丁寧に書き起こして、みんなの気持ちが揃う場所です。',
    position: [5.4, 0, -2.2],
  },
];

function ForestWorld({ onResidentClick, onBuildingClick, onUserGesture }) {
  const controlsRef = useRef(null);

  const handleGroundDoubleClick = (event) => {
    event.stopPropagation();
    onUserGesture?.();

    if (!controlsRef.current) {
      return;
    }

    const clickedPoint = clampPoint(event.point.clone());
    const cameraOffset = controlsRef.current.object.position
      .clone()
      .sub(controlsRef.current.target.clone());

    controlsRef.current.target.lerp(clickedPoint.setY(0.8), 0.18);
    controlsRef.current.object.position.lerp(clickedPoint.clone().setY(0.8).add(cameraOffset), 0.18);
  };

  useFrame((state) => {
    if (!controlsRef.current) {
      return;
    }

    const target = controlsRef.current.target;
    const clampedTarget = clampPoint(target.clone());
    target.x = THREE.MathUtils.lerp(target.x, clampedTarget.x, 0.15);
    target.y = THREE.MathUtils.lerp(target.y, clampedTarget.y, 0.15);
    target.z = THREE.MathUtils.lerp(target.z, clampedTarget.z, 0.15);

    const camera = state.camera;
    const clampedCamera = clampPoint(camera.position.clone());
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, clampedCamera.x, 0.15);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, clampedCamera.y, 0.15);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, clampedCamera.z, 0.15);
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
            onSelect={(clickedResident) => {
              onUserGesture?.();
              onResidentClick(clickedResident);
            }}
          />
        ))}

        {buildings.map((building) => (
          <group
            key={building.id}
            position={building.position}
            onClick={(event) => {
              event.stopPropagation();
              onUserGesture?.();
              onBuildingClick(building);
            }}
          >
            <mesh castShadow receiveShadow position={[0, 0.8, 0]}>
              <boxGeometry args={[1.5, 1.2, 1.2]} />
              <meshStandardMaterial color="#c7d5ff" />
            </mesh>
            <mesh castShadow position={[0, 1.7, 0]}>
              <boxGeometry args={[1.7, 0.16, 1.4]} />
              <meshStandardMaterial color="#a0b0ee" />
            </mesh>
          </group>
        ))}

        <EngineerDesk
          onSelect={(clickedBuilding) => {
            onUserGesture?.();
            onBuildingClick(clickedBuilding);
          }}
        />

        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
          onDoubleClick={handleGroundDoubleClick}
          onContextMenu={(event) => event.preventDefault()}
        >
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#a8d58d" transparent opacity={0.01} />
        </mesh>
      </group>

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enablePan
        enableRotate
        enableZoom
        minDistance={5}
        maxDistance={18}
        minPolarAngle={0.7}
        maxPolarAngle={1.35}
        target={[initialTarget.x, initialTarget.y, initialTarget.z]}
        mouseButtons={{ LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN }}
        touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }}
        onStart={onUserGesture}
        onChange={onUserGesture}
      />
    </>
  );
}

export default function ForestScene({ onResidentClick, onBuildingClick, onUserGesture }) {
  return (
    <div className="scene-wrap">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [initialCameraPosition.x, initialCameraPosition.y, initialCameraPosition.z], fov: 42 }}
        onPointerMissed={() => onUserGesture?.()}
      >
        <ForestWorld
          onResidentClick={onResidentClick}
          onBuildingClick={onBuildingClick}
          onUserGesture={onUserGesture}
        />
      </Canvas>
    </div>
  );
}
