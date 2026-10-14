import { Canvas } from '@react-three/fiber';
import { OrbitControls, RoundedBox } from '@react-three/drei';
import Resident from './Resident';
import EngineerDesk from './EngineerDesk';
import { residents } from '../data/residents';

// 森の全体の見た目をまとめたメインシーン。
// 斜め上から見下ろす固定カメラと、かわいいローポリ風の構成を作る。
export default function ForestScene({ onResidentClick }) {
  return (
    <div className="scene-wrap">
      <Canvas
        shadows
        camera={{ position: [8, 8, 9], fov: 38 }}
      >
        <color attach="background" args={['#edf7ef']} />
        <ambientLight intensity={2.2} color="#fff5d5" />
        <directionalLight
          castShadow
          position={[6, 10, 6]}
          intensity={1.8}
          color="#fff3bf"
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 3.4}
          maxPolarAngle={Math.PI / 2.2}
          minAzimuthAngle={-Math.PI / 3}
          maxAzimuthAngle={Math.PI / 3}
        />

        <group position={[0, -0.8, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[30, 30]} />
            <meshStandardMaterial color="#a8d58d" />
          </mesh>

          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <ringGeometry args={[4.8, 5.7, 64]} />
            <meshStandardMaterial color="#cfeab4" />
          </mesh>

          <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[2.5, 32]} />
            <meshStandardMaterial color="#cfe9ad" />
          </mesh>

          <RoundedBox args={[2.6, 0.25, 1.1]} radius={0.08} position={[0, 0.12, 0]} receiveShadow>
            <meshStandardMaterial color="#d9c8a1" />
          </RoundedBox>

          <mesh position={[-2.5, 0.2, -2.8]} castShadow>
            <cylinderGeometry args={[0.22, 0.3, 0.4, 12]} />
            <meshStandardMaterial color="#99714d" />
          </mesh>
          <mesh position={[-2.5, 0.8, -2.8]} castShadow>
            <coneGeometry args={[0.8, 1.5, 14]} />
            <meshStandardMaterial color="#3e7f4f" />
          </mesh>

          <mesh position={[2.8, 0.25, -3.1]} castShadow>
            <cylinderGeometry args={[0.24, 0.3, 0.5, 12]} />
            <meshStandardMaterial color="#99714d" />
          </mesh>
          <mesh position={[2.8, 0.9, -3.1]} castShadow>
            <coneGeometry args={[0.9, 1.8, 14]} />
            <meshStandardMaterial color="#2f7645" />
          </mesh>

          <mesh position={[3.8, 0.22, 1.8]} castShadow>
            <cylinderGeometry args={[0.18, 0.22, 0.4, 12]} />
            <meshStandardMaterial color="#8a644b" />
          </mesh>
          <mesh position={[3.8, 0.8, 1.8]} castShadow>
            <coneGeometry args={[0.65, 1.5, 14]} />
            <meshStandardMaterial color="#5aa164" />
          </mesh>

          {[[-1.6, 0.08, 2.4], [1.9, 0.08, 2.5], [-3.2, 0.08, 0.5], [2.3, 0.08, -0.6], [4.4, 0.08, 0.8]].map(([x, y, z], index) => (
            <mesh key={index} position={[x, y, z]} castShadow>
              <sphereGeometry args={[0.16, 10, 10]} />
              <meshStandardMaterial color={index % 2 === 0 ? '#ffbfd7' : '#ffd88a'} />
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
        </group>
      </Canvas>
    </div>
  );
}
