import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';

// 住民の基本形状を組み合わせるコンポーネント。
// ここでは動物の住民をシンプルなローポリモデルとして描画する。
export default function Resident({ resident, onSelect }) {
  const bodyColor = resident.color;

  const earMaterial = useMemo(() => ({ color: bodyColor }), [bodyColor]);

  return (
    <group position={resident.position} onClick={(event) => {
      event.stopPropagation();
      onSelect(resident);
    }}>
      <mesh castShadow position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.42, 20, 20]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      <mesh castShadow position={[0, 1.15, 0.12]}>
        <sphereGeometry args={[0.25, 18, 18]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      <mesh castShadow position={[-0.15, 1.5, 0.18]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#2e2c30" />
      </mesh>

      <mesh castShadow position={[0.15, 1.5, 0.18]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#2e2c30" />
      </mesh>

      <mesh castShadow position={[0, 1.25, 0.35]}>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshStandardMaterial color="#f5a6a6" />
      </mesh>

      <mesh castShadow position={[-0.25, 1.7, 0.05]}>
        <coneGeometry args={[0.12, 0.28, 8]} />
        <meshStandardMaterial {...earMaterial} />
      </mesh>

      <mesh castShadow position={[0.25, 1.7, 0.05]}>
        <coneGeometry args={[0.12, 0.28, 8]} />
        <meshStandardMaterial {...earMaterial} />
      </mesh>

      <mesh castShadow position={[-0.18, 0.7, 0.4]}>
        <boxGeometry args={[0.1, 0.2, 0.12]} />
        <meshStandardMaterial color="#1f2d24" />
      </mesh>

      <mesh castShadow position={[0.18, 0.7, 0.4]}>
        <boxGeometry args={[0.1, 0.2, 0.12]} />
        <meshStandardMaterial color="#1f2d24" />
      </mesh>

      <RoundedBox args={[0.42, 0.14, 0.22]} radius={0.04} position={[0, 0.32, 0.48]}>
        <meshStandardMaterial color="#f0efe8" />
      </RoundedBox>
    </group>
  );
}
