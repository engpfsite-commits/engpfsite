import { RoundedBox } from '@react-three/drei';

const speciesStyles = {
  dog: { fur: '#c98a50', lightFur: '#f3d9b4', darkFur: '#81502f', ear: '#9d653c', nose: '#51382d' },
  rabbit: { fur: '#f5e9dc', lightFur: '#fffaf2', darkFur: '#d9c6b8', ear: '#f4b9c5', nose: '#c97e82' },
  cat: { fur: '#788eb1', lightFur: '#e2eaf1', darkFur: '#465976', ear: '#d58f9d', nose: '#76505a' },
  owl: { fur: '#a97847', lightFur: '#f0d6aa', darkFur: '#6c4a36', ear: '#d9ad68', nose: '#d48c41' },
  giraffe: { fur: '#e7b64f', lightFur: '#fff0c6', darkFur: '#a86b36', ear: '#d58d48', nose: '#8c5940' },
};

const costumeStyles = {
  engineer: { jacket: '#397d70', shirt: '#f7ead2', accent: '#e5bd64' },
  idol: { jacket: '#e982a2', shirt: '#fff1f3', accent: '#f7d16c' },
  creator: { jacket: '#576f9e', shirt: '#e4edf8', accent: '#d28d7b' },
  researcher: { jacket: '#70639a', shirt: '#f0eafa', accent: '#86b9b6' },
  artist: { jacket: '#bd765b', shirt: '#f9ead8', accent: '#e9c16a' },
  everyday: { jacket: '#679177', shirt: '#f4ead3', accent: '#d9a768' },
};

function EarPair({ species, palette }) {
  if (species === 'rabbit') {
    return [-1, 1].map((side) => (
      <group key={side} position={[side * 0.17, 1.58, 0.015]} rotation={[0, 0, side * 0.12]}>
        <mesh castShadow scale={[0.115, 0.36, 0.105]}>
          <sphereGeometry args={[1, 14, 10]} />
          <meshStandardMaterial color={palette.fur} roughness={0.86} />
        </mesh>
        <mesh position={[0, 0.015, 0.087]} scale={[0.055, 0.25, 0.025]}>
          <sphereGeometry args={[1, 10, 8]} />
          <meshStandardMaterial color={palette.ear} roughness={0.9} />
        </mesh>
      </group>
    ));
  }

  if (species === 'cat') {
    return [-1, 1].map((side) => (
      <group key={side} position={[side * 0.22, 1.49, 0]} rotation={[0, 0, side * -0.12]}>
        <mesh castShadow>
          <coneGeometry args={[0.19, 0.43, 5]} />
          <meshStandardMaterial color={palette.fur} roughness={0.9} flatShading />
        </mesh>
        <mesh position={[0, 0.015, 0.105]} scale={[0.58, 0.62, 0.18]}>
          <coneGeometry args={[0.15, 0.34, 5]} />
          <meshStandardMaterial color={palette.ear} roughness={0.9} flatShading />
        </mesh>
      </group>
    ));
  }

  if (species === 'owl') {
    return [-1, 1].map((side) => (
      <mesh key={side} position={[side * 0.2, 1.47, 0]} rotation={[0, 0, side * -0.16]} castShadow>
        <coneGeometry args={[0.115, 0.27, 5]} />
        <meshStandardMaterial color={palette.darkFur} roughness={0.95} flatShading />
      </mesh>
    ));
  }

  if (species === 'giraffe') {
    return [-1, 1].map((side) => (
      <group key={side} position={[side * 0.19, 1.56, 0]}>
        <mesh position={[0, 0.08, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.075, 0.22, 7]} />
          <meshStandardMaterial color={palette.darkFur} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.2, 0]} castShadow>
          <sphereGeometry args={[0.09, 10, 8]} />
          <meshStandardMaterial color={palette.ear} roughness={0.9} />
        </mesh>
        <mesh position={[side * 0.13, -0.015, 0]} rotation={[0, 0, side * -0.8]} castShadow>
          <coneGeometry args={[0.12, 0.22, 5]} />
          <meshStandardMaterial color={palette.fur} roughness={0.9} flatShading />
        </mesh>
      </group>
    ));
  }

  return [-1, 1].map((side) => (
    <mesh key={side} position={[side * 0.28, 1.27, 0]} rotation={[0.12, 0, side * 0.45]} scale={[0.16, 0.27, 0.14]} castShadow>
      <sphereGeometry args={[1, 12, 10]} />
      <meshStandardMaterial color={palette.ear} roughness={0.92} />
    </mesh>
  ));
}

function Costume({ costume, colors }) {
  return (
    <group>
      <mesh position={[0, 0.57, 0.015]} scale={[0.46, 0.43, 0.41]} castShadow>
        <sphereGeometry args={[1, 14, 10]} />
        <meshStandardMaterial color={colors.jacket} roughness={0.87} />
      </mesh>
      <RoundedBox args={[0.22, 0.28, 0.055]} radius={0.04} position={[0, 0.61, 0.39]}>
        <meshStandardMaterial color={colors.shirt} roughness={0.84} />
      </RoundedBox>
      {costume === 'idol' && (
        <group position={[0.27, 1.53, 0.04]} rotation={[0, 0, -0.22]}>
          <mesh position={[-0.09, 0, 0]} rotation={[0, 0, 0.45]} castShadow>
            <sphereGeometry args={[0.13, 10, 8]} />
            <meshStandardMaterial color={colors.jacket} roughness={0.82} />
          </mesh>
          <mesh position={[0.09, 0, 0]} rotation={[0, 0, -0.45]} castShadow>
            <sphereGeometry args={[0.13, 10, 8]} />
            <meshStandardMaterial color={colors.jacket} roughness={0.82} />
          </mesh>
          <mesh position={[0, 0, 0.035]}>
            <sphereGeometry args={[0.065, 9, 7]} />
            <meshStandardMaterial color={colors.accent} roughness={0.75} />
          </mesh>
        </group>
      )}
      {costume === 'engineer' && (
        <group position={[0.2, 0.61, 0.34]}>
          <RoundedBox args={[0.22, 0.16, 0.035]} radius={0.025}>
            <meshStandardMaterial color="#c7dfcc" roughness={0.9} />
          </RoundedBox>
          <mesh position={[0, 0, 0.022]}>
            <circleGeometry args={[0.035, 8]} />
            <meshStandardMaterial color={colors.accent} />
          </mesh>
        </group>
      )}
      {costume === 'creator' && (
        <RoundedBox args={[0.28, 0.2, 0.045]} radius={0.04} position={[0, 0.43, 0.37]}>
          <meshStandardMaterial color={colors.accent} roughness={0.92} />
        </RoundedBox>
      )}
      {costume === 'researcher' && (
        <RoundedBox args={[0.2, 0.22, 0.04]} radius={0.04} position={[0.19, 0.45, 0.32]}>
          <meshStandardMaterial color="#e5d58c" roughness={0.95} />
        </RoundedBox>
      )}
      {costume === 'artist' && (
        <mesh position={[0, 1.48, 0]} rotation={[0, 0, -0.12]} castShadow>
          <sphereGeometry args={[0.22, 12, 8]} />
          <meshStandardMaterial color={colors.jacket} roughness={0.9} />
        </mesh>
      )}
    </group>
  );
}

export default function MascotModel({ species = 'dog', costume = 'everyday', scale = 1 }) {
  const palette = speciesStyles[species] || speciesStyles.dog;
  const outfit = costumeStyles[costume] || costumeStyles.everyday;
  const isGiraffe = species === 'giraffe';
  const headY = isGiraffe ? 1.55 : 1.18;
  const headScale = isGiraffe ? [0.33, 0.36, 0.32] : [0.4, 0.39, 0.35];

  return (
    <group scale={scale}>
      <mesh position={[0, 0.67, 0]} scale={[0.48, 0.47, 0.43]} castShadow receiveShadow>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial color={costumeStyles[costume] ? outfit.jacket : palette.fur} roughness={0.9} />
      </mesh>

      {isGiraffe && (
        <mesh position={[0, 1.05, 0.02]} scale={[0.23, 0.48, 0.23]} castShadow>
          <cylinderGeometry args={[0.32, 0.48, 1, 10, 4]} />
          <meshStandardMaterial color={palette.fur} roughness={0.9} />
        </mesh>
      )}

      <mesh position={[0, headY, 0.04]} scale={headScale} castShadow>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial color={palette.fur} roughness={0.88} />
      </mesh>
      <mesh position={[0, isGiraffe ? 0.82 : 0.68, 0.33]} scale={[0.3, 0.24, 0.18]}>
        <sphereGeometry args={[1, 12, 10]} />
        <meshStandardMaterial color={palette.lightFur} roughness={0.92} />
      </mesh>

      <EarPair species={species} palette={palette} />

      {species === 'owl' && [-1, 1].map((side) => (
        <mesh key={`wing-${side}`} position={[side * 0.45, 0.73, 0]} rotation={[0, 0, side * 0.18]} scale={[0.17, 0.3, 0.18]} castShadow>
          <sphereGeometry args={[1, 12, 10]} />
          <meshStandardMaterial color={palette.darkFur} roughness={0.93} />
        </mesh>
      ))}

      {species === 'dog' && [-1, 1].map((side) => (
        <mesh key={`muzzle-${side}`} position={[side * 0.095, headY - 0.14, 0.37]} scale={[0.15, 0.1, 0.11]}>
          <sphereGeometry args={[1, 12, 10]} />
          <meshStandardMaterial color={palette.lightFur} roughness={0.94} />
        </mesh>
      ))}

      {[-1, 1].map((side) => (
        <group key={`eye-${side}`} position={[side * 0.135, headY + 0.045, 0.32]}>
          {species === 'owl' && (
            <mesh>
              <sphereGeometry args={[0.105, 12, 10]} />
              <meshStandardMaterial color={palette.lightFur} roughness={0.92} />
            </mesh>
          )}
          <mesh position={[0, 0, 0.055]} castShadow>
            <sphereGeometry args={[0.052, 12, 10]} />
            <meshStandardMaterial color="#352d2b" roughness={0.38} />
          </mesh>
          <mesh position={[0.013, 0.018, 0.096]}>
            <sphereGeometry args={[0.014, 8, 6]} />
            <meshBasicMaterial color="#fffaf0" />
          </mesh>
          {species === 'cat' && (
            <mesh position={[0, -0.12, 0.014]} rotation={[0, 0, side * -0.2]}>
              <torusGeometry args={[0.105, 0.018, 6, 12, Math.PI * 0.72]} />
              <meshStandardMaterial color={palette.darkFur} roughness={0.85} />
            </mesh>
          )}
        </group>
      ))}

      {[-1, 1].map((side) => (
        <mesh key={`cheek-${side}`} position={[side * 0.23, headY - 0.12, 0.33]} scale={[0.075, 0.042, 0.025]}>
          <sphereGeometry args={[1, 10, 8]} />
          <meshStandardMaterial color={species === 'cat' ? '#d9919d' : species === 'owl' ? '#e8b97d' : '#eaa0a0'} roughness={0.9} />
        </mesh>
      ))}

      {species === 'owl' && (
        <group position={[0, headY + 0.045, 0.405]}>
          {[-1, 1].map((side) => (
            <mesh key={side} position={[side * 0.135, 0, 0]}>
              <torusGeometry args={[0.09, 0.018, 6, 14]} />
              <meshStandardMaterial color="#51443a" roughness={0.64} metalness={0.08} />
            </mesh>
          ))}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.1, 0.025, 0.025]} />
            <meshStandardMaterial color="#51443a" roughness={0.64} />
          </mesh>
        </group>
      )}

      {species === 'owl' ? (
        <mesh position={[0, headY - 0.09, 0.42]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.09, 0.18, 5]} />
          <meshStandardMaterial color={palette.nose} roughness={0.82} flatShading />
        </mesh>
      ) : (
        <mesh position={[0, headY - 0.1, 0.42]} scale={[0.038, 0.027, 0.025]}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color={palette.nose} roughness={0.72} />
        </mesh>
      )}

      {isGiraffe && [
        [-0.16, 1.15, 0.19], [0.17, 0.96, 0.2], [-0.14, 0.67, 0.18], [0.18, 0.42, 0.19],
      ].map(([x, y, z], index) => (
        <mesh key={`spot-${index}`} position={[x, y, z]} scale={[0.07, 0.09, 0.025]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={palette.darkFur} roughness={0.96} flatShading />
        </mesh>
      ))}

      <Costume costume={costume} colors={outfit} />

      {[-1, 1].map((side) => (
        <mesh key={`foot-${side}`} position={[side * 0.24, 0.19, 0.12]} scale={[0.17, 0.14, 0.21]} castShadow>
          <sphereGeometry args={[1, 10, 8]} />
          <meshStandardMaterial color={palette.darkFur} roughness={0.92} />
        </mesh>
      ))}
      {species === 'dog' && (
        <mesh position={[0, 0.61, -0.43]} rotation={[0.4, 0, 0.25]} castShadow>
          <sphereGeometry args={[0.13, 10, 8]} />
          <meshStandardMaterial color={palette.darkFur} roughness={0.92} />
        </mesh>
      )}
      {species === 'cat' && (
        <mesh position={[0, 0.6, -0.45]} rotation={[0.4, 0, 0.2]} castShadow>
          <capsuleGeometry args={[0.07, 0.38, 4, 8]} />
          <meshStandardMaterial color={palette.fur} roughness={0.9} />
        </mesh>
      )}

      <CostumeArms colors={outfit} />
    </group>
  );
}

function CostumeArms({ colors }) {
  return [-1, 1].map((side) => (
    <mesh key={side} position={[side * 0.43, 0.58, 0.08]} rotation={[0, 0, side * -0.34]} scale={[0.14, 0.3, 0.15]} castShadow>
      <sphereGeometry args={[1, 10, 8]} />
      <meshStandardMaterial color={colors.jacket} roughness={0.9} />
    </mesh>
  ));
}