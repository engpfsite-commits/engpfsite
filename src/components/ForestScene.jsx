import { Canvas, useFrame } from '@react-three/fiber';
import { Instances, Instance, OrbitControls } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import Resident from './Resident';
import EngineerDesk from './EngineerDesk';
import { residents } from '../data/residents';
import {
  ForestBrook,
  DistantLandscape,
  ForestPath,
  ForestTreeLine,
  FootBridge,
  IslandTerrain,
  OceanSurface,
  OpeningTitle,
  VillageProps,
  VillageHouse,
  Waterfall,
} from './WorldModels';

const FOREST_LIMITS = {
  minX: -14,
  maxX: 14,
  minZ: -14,
  maxZ: 14,
};

const initialCameraPosition = new THREE.Vector3(12, 10.5, 14);
const initialTarget = new THREE.Vector3(0, 0.45, 0);
const introFrames = [
  { time: 0, position: new THREE.Vector3(0, 18, 26), target: new THREE.Vector3(0, 7.3, 6.8) },
  { time: 2, position: new THREE.Vector3(0, 12, 17), target: new THREE.Vector3(0, 7.7, 8) },
  { time: 4, position: new THREE.Vector3(0, 8.5, 10.8), target: new THREE.Vector3(0, 8, 8.5) },
  { time: 5, position: new THREE.Vector3(0, 7.5, 4), target: new THREE.Vector3(0, 3, 0) },
  { time: 6, position: new THREE.Vector3(5, 7, 8), target: new THREE.Vector3(0, 2, 0) },
  { time: 7, position: initialCameraPosition, target: initialTarget },
];

function interpolateIntro(elapsed, position, target) {
  let frameIndex = introFrames.findIndex((frame) => frame.time >= elapsed);
  frameIndex = Math.max(1, frameIndex);
  const start = introFrames[frameIndex - 1];
  const end = introFrames[frameIndex];
  const linear = THREE.MathUtils.clamp((elapsed - start.time) / (end.time - start.time), 0, 1);
  let progress = linear;

  if (end.time <= 2) {
    progress = 0.5 - Math.cos(linear * Math.PI) * 0.5;
  } else if (start.time >= 2 && end.time <= 4) {
    progress = linear * linear * linear;
  } else if (start.time >= 5) {
    progress = linear * linear * (3 - 2 * linear);
  }

  position.lerpVectors(start.position, end.position, progress);
  target.lerpVectors(start.target, end.target, progress);
}

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
    wallColor: '#ead4a8',
    roofColor: '#b96d62',
    trimColor: '#80634d',
  },
  {
    id: 'specification-cafe',
    name: '仕様書カフェ',
    description: '作業の合間にひと息つける森のカフェ。机の上には今日の依頼が並んでいます。',
    position: [-5.15, 0, -2.15],
    wallColor: '#ead5aa',
    roofColor: '#548f91',
    trimColor: '#846044',
  },
  {
    id: 'development-workshop',
    name: '開発工房',
    description: '森の工房では、開発依頼を小さな作業に分けて、ひとつずつ形にしています。',
    position: [4.45, 0, 4.0],
    wallColor: '#e9c99b',
    roofColor: '#c66e5b',
    trimColor: '#795b47',
  },
];

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

function ForestWorld({ onResidentClick, onBuildingClick, onUserGesture, introFinished, onIntroComplete }) {
  const controlsRef = useRef(null);
  const introStartRef = useRef(null);
  const introPositionRef = useRef(new THREE.Vector3());
  const introTargetRef = useRef(new THREE.Vector3());
  const introAppliedRef = useRef(false);

  const handleGroundDoubleClick = (event) => {
    event.stopPropagation();
    if (!introFinished) {
      return;
    }
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
    const camera = state.camera;

    if (!introFinished) {
      if (introStartRef.current === null) {
        introStartRef.current = state.clock.elapsedTime;
      }

      const elapsed = state.clock.elapsedTime - introStartRef.current;
      if (elapsed >= 7) {
        camera.position.copy(initialCameraPosition);
        target.copy(initialTarget);
        camera.lookAt(initialTarget);
        camera.updateMatrixWorld();
        controlsRef.current.update();
        onIntroComplete();
        return;
      }

      interpolateIntro(elapsed, introPositionRef.current, introTargetRef.current);
      camera.position.copy(introPositionRef.current);
      target.copy(introTargetRef.current);
      camera.lookAt(introTargetRef.current);
      camera.updateMatrixWorld();
      return;
    }

    if (!introAppliedRef.current) {
      camera.position.copy(initialCameraPosition);
      target.copy(initialTarget);
      controlsRef.current.update();
      introAppliedRef.current = true;
    }

    const clampedTarget = clampPoint(target.clone());
    target.x = THREE.MathUtils.lerp(target.x, clampedTarget.x, 0.15);
    target.y = THREE.MathUtils.lerp(target.y, clampedTarget.y, 0.15);
    target.z = THREE.MathUtils.lerp(target.z, clampedTarget.z, 0.15);

    const clampedCamera = clampPoint(camera.position.clone());
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, clampedCamera.x, 0.15);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, clampedCamera.y, 0.15);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, clampedCamera.z, 0.15);
  });

  return (
    <>
      <color attach="background" args={['#d9edf0']} />
      <fog attach="fog" args={['#d9edf0', 30, 82]} />
      <hemisphereLight args={['#fff4d9', '#73966a', 1.15]} />
      <ambientLight intensity={0.58} color="#fff4dc" />
      <directionalLight
        castShadow
        position={[-5, 11, 7]}
        intensity={1.75}
        color="#ffe8b0"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-11}
        shadow-camera-right={11}
        shadow-camera-top={11}
        shadow-camera-bottom={-11}
        shadow-bias={-0.00015}
        shadow-normalBias={0.035}
        shadow-radius={7}
      />

      <group position={[0, -0.8, 0]}>
        <DistantLandscape />
        <OpeningTitle introFinished={introFinished} />
        <OceanSurface />
        <IslandTerrain />
        <ForestTreeLine />
        <ForestBrook />
        <Waterfall />
        <ForestPath />
        <FootBridge />
        <VillageProps />
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
              if (!introFinished) {
                return;
              }
              onUserGesture?.();
              onResidentClick(clickedResident);
            }}
          />
        ))}

        {buildings.map((building) => (
          <VillageHouse
            key={building.id}
            building={building}
            onClick={(event) => {
              event.stopPropagation();
              if (!introFinished) {
                return;
              }
              onUserGesture?.();
              onBuildingClick(building);
            }}
          />
        ))}

        <EngineerDesk
          onSelect={(clickedBuilding) => {
            if (!introFinished) {
              return;
            }
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
        enabled={introFinished}
        enableDamping
        dampingFactor={0.08}
        enablePan
        enableRotate
        enableZoom
        minDistance={5}
        maxDistance={28}
        minPolarAngle={0.7}
        maxPolarAngle={1.35}
        target={[initialTarget.x, initialTarget.y, initialTarget.z]}
        mouseButtons={{ LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN }}
        touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }}
        onStart={() => {
          if (introFinished) {
            onUserGesture?.();
          }
        }}
        onChange={() => {
          if (introFinished) {
            onUserGesture?.();
          }
        }}
      />
    </>
  );
}

export default function ForestScene({ onResidentClick, onBuildingClick, onUserGesture }) {
  const [introFinished, setIntroFinished] = useState(false);

  return (
    <div className="scene-wrap">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [initialCameraPosition.x, initialCameraPosition.y, initialCameraPosition.z], fov: 46 }}
        onPointerMissed={() => onUserGesture?.()}
      >
        <ForestWorld
          onResidentClick={onResidentClick}
          onBuildingClick={onBuildingClick}
          onUserGesture={onUserGesture}
          introFinished={introFinished}
          onIntroComplete={() => setIntroFinished(true)}
        />
      </Canvas>
      {!introFinished && (
        <button className="intro-skip" type="button" onClick={() => setIntroFinished(true)}>
          スキップ
        </button>
      )}
    </div>
  );
}
