import { RoundedBox } from '@react-three/drei';

const building = {
  id: 'engineer-desk',
  name: '仕様書作成室',
  description:
    '森の中央の作業台。ここでは、曖昧な要件を丁寧に書き起こし、みんなの気持ちが揃う場所です。',
};

export default function EngineerDesk({ onSelect }) {
  return (
    <group
      position={[-0.8, 0, 0.2]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect?.(building);
      }}
    >
      <RoundedBox args={[2.3, 0.55, 1.45]} radius={0.12} position={[0, 0.4, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#b98560" roughness={0.92} />
      </RoundedBox>
      <RoundedBox args={[2.5, 0.14, 1.62]} radius={0.08} position={[0, 0.73, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#e3c89c" roughness={0.82} />
      </RoundedBox>

      {[-0.94, 0.94].flatMap((x) => [-0.53, 0.53].map((z) => (
        <mesh key={`${x}-${z}`} position={[x, 0.18, z]} castShadow>
          <RoundedBox args={[0.16, 0.48, 0.16]} radius={0.035}>
            <meshStandardMaterial color="#9c704f" roughness={0.95} />
          </RoundedBox>
        </mesh>
      )))}

      <group position={[-0.48, 0.82, -0.28]}>
        <RoundedBox args={[0.88, 0.62, 0.11]} radius={0.08} position={[0, 0.46, 0]} castShadow>
          <meshStandardMaterial color="#52685c" roughness={0.55} />
        </RoundedBox>
        <RoundedBox args={[0.74, 0.46, 0.035]} radius={0.045} position={[0, 0.46, 0.071]}>
          <meshStandardMaterial color="#a8d8c0" emissive="#507d69" emissiveIntensity={0.16} roughness={0.48} />
        </RoundedBox>
        {[-0.11, 0.03, 0.15].map((y, index) => (
          <RoundedBox key={y} args={[0.28 + (index % 2) * 0.1, 0.025, 0.012]} radius={0.01} position={[-0.13, 0.46 + y, 0.095]}>
            <meshStandardMaterial color={index === 1 ? '#df9e83' : '#6c9e7c'} />
          </RoundedBox>
        ))}
        <mesh position={[0, 0.1, -0.04]} castShadow>
          <cylinderGeometry args={[0.045, 0.06, 0.18, 8]} />
          <meshStandardMaterial color="#6e756b" roughness={0.5} />
        </mesh>
        <RoundedBox args={[0.4, 0.045, 0.25]} radius={0.025} position={[0, 0.025, 0]} castShadow>
          <meshStandardMaterial color="#65756a" roughness={0.55} />
        </RoundedBox>
      </group>

      <RoundedBox args={[0.82, 0.055, 0.3]} radius={0.04} position={[0.45, 0.84, 0.38]} rotation={[-0.08, 0, 0]} castShadow>
        <meshStandardMaterial color="#728477" roughness={0.7} />
      </RoundedBox>
      {[0, 1, 2, 3, 4].flatMap((column) => [0, 1, 2].map((row) => (
        <RoundedBox key={`key-${column}-${row}`} args={[0.09, 0.025, 0.055]} radius={0.012} position={[0.13 + column * 0.14, 0.88, 0.29 + row * 0.075]}>
          <meshStandardMaterial color="#f2e8d2" roughness={0.8} />
        </RoundedBox>
      )))}

      {[
        [-0.92, 0.84, 0.38, 0.42], [-0.84, 0.9, 0.35, 0.38], [0.91, 0.84, -0.32, 0.34],
      ].map(([x, y, z, rotation], index) => (
        <group key={`spec-stack-${index}`} position={[x, y, z]} rotation={[0, rotation, index === 2 ? -0.08 : 0]}>
          {[0, 1, 2, 3].map((page) => (
            <RoundedBox key={page} args={[0.42, 0.035, 0.55]} radius={0.015} position={[0, page * 0.038, 0]} castShadow>
              <meshStandardMaterial color={page === 0 ? '#fff7e5' : '#f1e6ce'} roughness={0.96} />
            </RoundedBox>
          ))}
          <mesh position={[0, 0.16, 0.12]}>
            <boxGeometry args={[0.25, 0.012, 0.018]} />
            <meshStandardMaterial color={index === 1 ? '#d78273' : '#86a88a'} />
          </mesh>
        </group>
      ))}

      <group position={[0.9, 0.83, 0.3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.12, 0.15, 0.24, 12]} />
          <meshStandardMaterial color="#d98e80" roughness={0.72} />
        </mesh>
        <mesh position={[0, 0.13, 0]}>
          <torusGeometry args={[0.075, 0.025, 8, 14]} />
          <meshStandardMaterial color="#d98e80" roughness={0.72} />
        </mesh>
      </group>

      <group position={[0, 0, -0.82]}>
        <mesh position={[0, 1.46, 0]} castShadow>
          <RoundedBox args={[1.45, 0.92, 0.12]} radius={0.1}>
            <meshStandardMaterial color="#987454" roughness={0.9} />
          </RoundedBox>
        </mesh>
        <mesh position={[0, 1.46, 0.07]}>
          <RoundedBox args={[1.28, 0.75, 0.035]} radius={0.06}>
            <meshStandardMaterial color="#e8d39e" roughness={0.95} />
          </RoundedBox>
        </mesh>
        {[
          [-0.38, 1.6, '#e9a0a7'], [0.02, 1.62, '#a5c9a1'], [0.39, 1.55, '#9ebbd7'],
          [-0.18, 1.31, '#f1c36f'], [0.28, 1.3, '#d5afd4'],
        ].map(([x, y, color], index) => (
          <group key={`request-${index}`} position={[x, y, 0.11]} rotation={[0, 0, index % 2 ? -0.06 : 0.05]}>
            <RoundedBox args={[0.28, 0.32, 0.025]} radius={0.025}>
              <meshStandardMaterial color={color} roughness={0.9} />
            </RoundedBox>
            <mesh position={[0, 0.04, 0.02]}>
              <boxGeometry args={[0.17, 0.018, 0.008]} />
              <meshStandardMaterial color="#fff7e7" />
            </mesh>
            <mesh position={[0, -0.035, 0.02]}>
              <boxGeometry args={[0.12, 0.014, 0.008]} />
              <meshStandardMaterial color="#fff7e7" />
            </mesh>
          </group>
        ))}
        <mesh position={[0.54, 1.92, 0.13]}>
          <sphereGeometry args={[0.11, 10, 8]} />
          <meshStandardMaterial color="#d56f68" emissive="#8c302b" emissiveIntensity={0.08} />
        </mesh>
      </group>
    </group>
  );
}
