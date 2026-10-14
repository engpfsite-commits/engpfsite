import { RoundedBox } from '@react-three/drei';

export default function Resident({ resident, onSelect }) {
  const bodyColor = resident.color;
  const isPika = resident.id === 'pika';
  const isNunu = resident.id === 'nunu';
  const earScale = isPika ? [0.11, 0.28, 0.11] : isNunu ? [0.13, 0.29, 0.1] : [0.16, 0.15, 0.13];
  const earTilt = isNunu ? 0.28 : isPika ? -0.1 : 0;

  return (
    <group position={resident.position} onClick={(event) => {
      event.stopPropagation();
      onSelect(resident);
    }}>
      <mesh castShadow position={[0, 0.68, 0]} scale={[1, 0.9, 0.92]}>
        <sphereGeometry args={[0.43, 16, 12]} />
        <meshStandardMaterial color={bodyColor} roughness={0.88} />
      </mesh>
      <mesh castShadow position={[0, 1.12, 0.1]} scale={[1, 0.96, 0.9]}>
        <sphereGeometry args={[0.29, 16, 12]} />
        <meshStandardMaterial color={bodyColor} roughness={0.88} />
      </mesh>
      <mesh castShadow position={[0, 0.68, 0.34]} scale={[0.57, 0.48, 0.2]}>
        <sphereGeometry args={[0.34, 12, 10]} />
        <meshStandardMaterial color="#fff0dc" roughness={0.95} />
      </mesh>

      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.2, 1.39, 0.04]} rotation={[0, 0, side * earTilt]}>
          <mesh castShadow scale={earScale}>
            <sphereGeometry args={[1, 12, 10]} />
            <meshStandardMaterial color={bodyColor} roughness={0.9} />
          </mesh>
          {(isPika || isNunu) && (
            <mesh position={[0, 0, 0.085]} scale={[0.055, 0.15, 0.025]}>
              <sphereGeometry args={[1, 10, 8]} />
              <meshStandardMaterial color={isPika ? '#efad82' : '#e99cae'} roughness={0.9} />
            </mesh>
          )}
        </group>
      ))}

      {[-1, 1].map((side) => (
        <group key={`eye-${side}`}>
          <mesh position={[side * 0.115, 1.17, 0.345]} castShadow>
            <sphereGeometry args={[0.046, 10, 8]} />
            <meshStandardMaterial color="#383438" roughness={0.45} />
          </mesh>
          <mesh position={[side * 0.128, 1.19, 0.383]}>
            <sphereGeometry args={[0.012, 8, 6]} />
            <meshBasicMaterial color="#fffaf0" />
          </mesh>
          <mesh position={[side * 0.21, 1.07, 0.31]} scale={[0.075, 0.045, 0.025]}>
            <sphereGeometry args={[1, 10, 8]} />
            <meshStandardMaterial color={isPika ? '#efaa83' : '#e9a3a0'} roughness={0.9} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 1.08, 0.39]} scale={[0.035, 0.026, 0.02]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#8f6660" roughness={0.8} />
      </mesh>

      {[[-0.21, 0.36], [0.21, 0.36]].map(([x, z], index) => (
        <mesh key={`foot-${index}`} position={[x, 0.35, z]} castShadow scale={[1, 0.72, 1.25]}>
          <sphereGeometry args={[0.13, 10, 8]} />
          <meshStandardMaterial color={bodyColor} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 0.6, -0.39]} castShadow rotation={[0.2, 0, 0.4]}>
        <sphereGeometry args={[isNunu ? 0.2 : 0.14, 10, 8]} />
        <meshStandardMaterial color={bodyColor} roughness={0.9} />
      </mesh>

      {isPika && (
        <mesh position={[0, 1.46, 0.02]} rotation={[0, 0, Math.PI / 4]} castShadow>
          <dodecahedronGeometry args={[0.11, 0]} />
          <meshStandardMaterial color="#fff0b2" roughness={0.88} />
        </mesh>
      )}
      {isNunu && (
        <mesh position={[0, 1.47, 0.02]} castShadow>
          <sphereGeometry args={[0.105, 10, 8]} />
          <meshStandardMaterial color="#f3c3d2" roughness={0.9} />
        </mesh>
      )}
      {resident.id === 'mori' && (
        <RoundedBox args={[0.34, 0.12, 0.12]} radius={0.05} position={[0, 0.89, 0.35]}>
          <meshStandardMaterial color="#d88c78" roughness={0.9} />
        </RoundedBox>
      )}
    </group>
  );
}
