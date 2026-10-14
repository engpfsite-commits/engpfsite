import { Float, RoundedBox } from '@react-three/drei';

// 作業スペースの見た目を表すコンポーネント。
// 仕様書の山を積み上げたエンジニアの隅を、かわいく演出する。
export default function EngineerDesk() {
  return (
    <group position={[5.3, 0, -2.2]}>
      <RoundedBox args={[2.3, 0.6, 1.6]} radius={0.12} position={[0, 0.4, 0]}>
        <meshStandardMaterial color="#d8b38d" />
      </RoundedBox>

      <RoundedBox args={[2.1, 0.3, 1.4]} radius={0.1} position={[0, 0.8, 0.02]}>
        <meshStandardMaterial color="#c08f63" />
      </RoundedBox>

      <mesh position={[-0.5, 1.2, 0.1]} castShadow>
        <boxGeometry args={[0.8, 0.65, 0.5]} />
        <meshStandardMaterial color="#f6f0da" />
      </mesh>

      <mesh position={[0.3, 1.15, 0.2]} castShadow>
        <boxGeometry args={[0.7, 0.55, 0.4]} />
        <meshStandardMaterial color="#f5e4c5" />
      </mesh>

      <Float speed={1.2} rotationIntensity={0.18} floatIntensity={0.6}>
        <mesh position={[0.8, 1.5, -0.2]} castShadow>
          <boxGeometry args={[0.7, 0.75, 0.42]} />
          <meshStandardMaterial color="#d9d3f4" />
        </mesh>
      </Float>

      <mesh position={[-0.9, 1.4, 0.3]} castShadow>
        <boxGeometry args={[0.45, 0.6, 0.2]} />
        <meshStandardMaterial color="#f2b9a5" />
      </mesh>

      <mesh position={[-1.1, 1.7, 0.1]} castShadow>
        <boxGeometry args={[0.8, 0.4, 0.2]} />
        <meshStandardMaterial color="#c8c7ef" />
      </mesh>
    </group>
  );
}
