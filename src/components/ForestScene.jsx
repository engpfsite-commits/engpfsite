import { Canvas, useFrame } from '@react-three/fiber';
import { Instances, Instance, OrbitControls, RoundedBox } from '@react-three/drei';
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
      '森の広場にある仕様書作成室。ここでは、曖昧な要件を丁寧に書き起こして、みんなの気持ちが揃う場所です。',
    position: [3.1, 0, -2.2],
  },
];

const trees = [
  [-5.1, -4.1, 1.05, 0], [-3.1, -5.3, 0.82, 1], [-0.2, -5.6, 1.12, 2],
  [2.7, -5.0, 0.86, 0], [5.1, -4.5, 1.04, 1], [-5.5, -1.4, 0.88, 2],
  [5.7, 1.3, 0.94, 0], [-4.8, 4.0, 1.05, 1], [-1.4, 5.2, 0.82, 2],
  [2.0, 5.4, 0.96, 0], [5.1, 4.2, 0.82, 2], [-5.9, 1.8, 0.7, 3],
];

const treeCanopyColors = ['#57966a', '#75ad75', '#91bd7d', '#d995a9'];

function ForestCanopies() {
  return (
    <>
      <Instances limit={trees.length} castShadow receiveShadow>
        <cylinderGeometry args={[0.16, 0.24, 1, 7]} />
        <meshStandardMaterial color="#956d51" roughness={0.95} />
        {trees.map(([x, z, scale], index) => (
          <Instance key={`trunk-${index}`} position={[x, scale * 0.52, z]} scale={scale} />
        ))}
      </Instances>

      {treeCanopyColors.map((color, colorIndex) => {
        const matchingTrees = trees.filter((tree) => tree[3] === colorIndex);
        return (
          <Instances key={color} limit={matchingTrees.length * 4} castShadow receiveShadow>
            <dodecahedronGeometry args={[0.72, 1]} />
            <meshStandardMaterial color={color} roughness={0.9} />
            {matchingTrees.flatMap(([x, z, scale], treeIndex) => {
              const crownY = 1.38 * scale;
              return [
                <Instance key={`${colorIndex}-${treeIndex}-crown`} position={[x, crownY, z]} scale={[scale * 0.93, scale, scale * 0.93]} />,
                <Instance key={`${colorIndex}-${treeIndex}-left`} position={[x - scale * 0.43, crownY - scale * 0.17, z + scale * 0.08]} scale={scale * 0.73} />,
                <Instance key={`${colorIndex}-${treeIndex}-right`} position={[x + scale * 0.4, crownY - scale * 0.12, z - scale * 0.06]} scale={scale * 0.7} />,
                <Instance key={`${colorIndex}-${treeIndex}-top`} position={[x + scale * 0.04, crownY + scale * 0.48, z]} scale={scale * 0.57} />,
              ];
            })}
          </Instances>
        );
      })}
    </>
  );
}

const flowerPositions = [
  [-4.2, 0.08, -2.9, 0.8], [-3.4, 0.08, -2.2, 1.1], [-2.8, 0.08, -3.4, 0.75],
  [-4.3, 0.08, 1.6, 0.9], [-3.7, 0.08, 2.3, 1.05], [-2.9, 0.08, 3.1, 0.8],
  [-4.9, 0.08, -2.2, 0.7], [-3.3, 0.08, -1.5, 0.85], [-4.7, 0.08, 2.7, 0.78], [-2.2, 0.08, 2.7, 0.72],
  [2.7, 0.08, 2.8, 1], [3.6, 0.08, 2.3, 0.75], [4.2, 0.08, 1.6, 0.9],
  [1.4, 0.08, -3.8, 0.8], [2.3, 0.08, -4.1, 1.05], [3.4, 0.08, -3.3, 0.78],
  [4.6, 0.08, 2.4, 0.72], [3.1, 0.08, 3.5, 0.82], [1.2, 0.08, -4.8, 0.72], [2.5, 0.08, -2.9, 0.84],
  [-1.1, 0.08, 4.1, 0.8], [0.1, 0.08, 4.5, 1], [1.1, 0.08, 3.9, 0.75],
  [-1.8, 0.08, 4.7, 0.72], [-0.6, 0.08, 3.6, 0.82], [0.3, 0.08, 5.1, 0.76], [1.8, 0.08, 4.6, 0.8],
];

function FlowerPatch({ color, positions }) {
  return (
    <>
      <Instances limit={positions.length}>
        <cylinderGeometry args={[0.018, 0.028, 0.25, 5]} />
        <meshStandardMaterial color="#527f4d" roughness={1} />
        {positions.map(([x, y, z, scale], index) => (
          <Instance key={`stem-${index}`} position={[x, y + 0.12 * scale, z]} scale={scale} />
        ))}
      </Instances>
      <Instances limit={positions.length * 5} castShadow>
        <sphereGeometry args={[0.085, 8, 6]} />
        <meshStandardMaterial color={color} roughness={0.82} />
        {positions.flatMap(([x, y, z, scale], index) => Array.from({ length: 5 }, (_, petal) => {
          const angle = (petal / 5) * Math.PI * 2;
          return (
            <Instance
              key={`petal-${index}-${petal}`}
              position={[x + Math.cos(angle) * 0.075 * scale, y + 0.29 * scale, z + Math.sin(angle) * 0.075 * scale]}
              rotation={[0, -angle, 0]}
              scale={[scale, scale * 0.68, scale * 1.18]}
            />
          );
        }))}
      </Instances>
      <Instances limit={positions.length}>
        <sphereGeometry args={[0.045, 7, 5]} />
        <meshStandardMaterial color="#f7d782" roughness={0.8} />
        {positions.map(([x, y, z, scale], index) => (
          <Instance key={`heart-${index}`} position={[x, y + 0.31 * scale, z]} scale={scale * 0.8} />
        ))}
      </Instances>
    </>
  );
}

const grassTufts = [
  [-5.4, 0.02, -3.1], [-4.8, 0.02, -0.8], [-5.3, 0.02, 2.7], [-3.8, 0.02, 4.4],
  [-2.5, 0.02, -4.5], [-2.4, 0.02, 3.7], [-0.8, 0.02, -4.8], [0.6, 0.02, 4.9],
  [1.1, 0.02, -4.7], [2.2, 0.02, 4.3], [4.5, 0.02, -4.7], [5.1, 0.02, 2.8],
];

function ForestGrass() {
  return (
    <Instances limit={grassTufts.length * 3} castShadow>
      <coneGeometry args={[0.075, 0.3, 5]} />
      <meshStandardMaterial color="#6f9e61" roughness={1} />
      {grassTufts.flatMap(([x, y, z], tuftIndex) => Array.from({ length: 3 }, (_, bladeIndex) => {
        const angle = (bladeIndex / 3) * Math.PI * 2;
        return (
          <Instance
            key={`grass-${tuftIndex}-${bladeIndex}`}
            position={[x + Math.cos(angle) * 0.07, y + 0.15, z + Math.sin(angle) * 0.07]}
            rotation={[0, angle, 0]}
            scale={0.75 + bladeIndex * 0.12}
          />
        );
      }))}
    </Instances>
  );
}

function ForestGround() {
  return (
    <>
      <mesh position={[0, -0.28, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[7.8, 8.15, 0.56, 64]} />
        <meshStandardMaterial color="#8d694d" roughness={1} />
      </mesh>
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[7.8, 64]} />
        <meshStandardMaterial color="#9fc981" roughness={1} />
      </mesh>
      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[7.68, 7.82, 64]} />
        <meshStandardMaterial color="#c6a77a" roughness={0.95} />
      </mesh>
    </>
  );
}

function SpecificationHouse({ building, onClick }) {
  return (
    <group position={building.position} onClick={onClick}>
      <RoundedBox args={[2.35, 0.22, 2.05]} radius={0.08} position={[0, 0.14, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#a77c5b" roughness={0.9} />
      </RoundedBox>
      <RoundedBox args={[2.05, 1.5, 1.72]} radius={0.1} position={[0, 1, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#f1d9a9" roughness={0.88} />
      </RoundedBox>
      <RoundedBox args={[0.56, 1.04, 0.09]} radius={0.08} position={[0, 0.78, 0.9]} castShadow>
        <meshStandardMaterial color="#8e6248" roughness={0.88} />
      </RoundedBox>
      <mesh position={[0, 1.14, 0.96]}>
        <circleGeometry args={[0.045, 10]} />
        <meshStandardMaterial color="#f6d66e" emissive="#d99645" emissiveIntensity={0.24} />
      </mesh>
      {[-0.64, 0.64].map((x) => (
        <group key={x} position={[x, 1.18, 0.9]}>
          <RoundedBox args={[0.48, 0.48, 0.08]} radius={0.06} castShadow>
            <meshStandardMaterial color="#fff1cf" roughness={0.7} />
          </RoundedBox>
          <mesh position={[0, 0, 0.05]}>
            <planeGeometry args={[0.34, 0.34]} />
            <meshStandardMaterial color="#9ac7cf" roughness={0.55} />
          </mesh>
          <mesh position={[0, 0, 0.07]}>
            <boxGeometry args={[0.045, 0.39, 0.025]} />
            <meshStandardMaterial color="#fff0d0" />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 1.78, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.68, 1.08, 4]} />
        <meshStandardMaterial color="#c97669" roughness={0.92} />
      </mesh>
      <mesh position={[0.72, 2.14, -0.35]} castShadow>
        <cylinderGeometry args={[0.16, 0.2, 0.62, 8]} />
        <meshStandardMaterial color="#b77963" roughness={0.9} />
      </mesh>
      <RoundedBox args={[0.9, 0.32, 0.08]} radius={0.04} position={[0, 1.92, 1.02]} castShadow>
        <meshStandardMaterial color="#7b8d66" roughness={0.9} />
      </RoundedBox>
      <mesh position={[0, 1.92, 1.071]}>
        <planeGeometry args={[0.78, 0.2]} />
        <meshStandardMaterial color="#f4e5bc" />
      </mesh>
    </group>
  );
}

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
      <color attach="background" args={['#d9edf0']} />
      <fog attach="fog" args={['#d9edf0', 18, 34]} />
      <hemisphereLight args={['#fff4d9', '#73966a', 1.15]} />
      <ambientLight intensity={0.45} color="#fff4dc" />
      <directionalLight
        castShadow
        position={[-5, 11, 7]}
        intensity={2.1}
        color="#ffe8b0"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-11}
        shadow-camera-right={11}
        shadow-camera-top={11}
        shadow-camera-bottom={-11}
        shadow-bias={-0.00015}
        shadow-normalBias={0.035}
        shadow-radius={4}
      />

      <group position={[0, -0.8, 0]}>
        <ForestGround />
        <ForestCanopies />
        <ForestGrass />
        <FlowerPatch color="#e89eb1" positions={flowerPositions.slice(0, 10)} />
        <FlowerPatch color="#f1ce7c" positions={flowerPositions.slice(10, 20)} />
        <FlowerPatch color="#d8b4dc" positions={flowerPositions.slice(20)} />

        {[
          [-2.8, 0.1, -1.8, 0.42], [-1.8, 0.08, -2.2, 0.3], [3.8, 0.1, -0.5, 0.36],
          [-4.1, 0.12, 0.1, 0.32], [1.2, 0.08, -4.4, 0.4], [3.8, 0.1, 3.4, 0.3],
          [-3.1, 0.1, 3.6, 0.38],
        ].map(([x, y, z, scale], index) => (
          <mesh key={`stone-${index}`} position={[x, y, z]} rotation={[0.15, index * 0.7, 0.12]} scale={[scale * 1.35, scale * 0.65, scale]} castShadow receiveShadow>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={index % 2 ? '#b8ad91' : '#c9bea1'} roughness={1} />
          </mesh>
        ))}

        {[
          [-1.7, 0.015, -3.4], [3.2, 0.015, -1.4], [-3.6, 0.015, 1.2], [2.8, 0.015, 3.8],
        ].map(([x, y, z], index) => (
          <group key={`mushroom-${index}`} position={[x, y, z]}>
            <mesh position={[0, 0.11, 0]} castShadow>
              <cylinderGeometry args={[0.07, 0.1, 0.22, 7]} />
              <meshStandardMaterial color="#f4e6c9" roughness={0.92} />
            </mesh>
            <mesh position={[0, 0.24, 0]} castShadow>
              <sphereGeometry args={[0.18, 8, 6]} />
              <meshStandardMaterial color={index % 2 ? '#d98977' : '#d7a56f'} roughness={0.9} />
            </mesh>
          </group>
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
          <SpecificationHouse
            key={building.id}
            building={building}
            onClick={(event) => {
              event.stopPropagation();
              onUserGesture?.();
              onBuildingClick(building);
            }}
          />
        ))}

        <EngineerDesk
          onSelect={(clickedBuilding) => {
            onUserGesture?.();
            onBuildingClick(clickedBuilding);
          }}
        />

        <mesh
          position={[0, 0.025, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
          onDoubleClick={handleGroundDoubleClick}
          onContextMenu={(event) => event.preventDefault()}
        >
          <planeGeometry args={[30, 30]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
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
        dpr={[1, 1.5]}
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
