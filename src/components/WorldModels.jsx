import { Instances, Instance, RoundedBox } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

const treeVariants = [
  [-7.2, -5.4, 1.08, 0], [-5.0, -7.2, 0.9, 1], [-2.3, -7.7, 0.98, 2],
  [0.5, -7.4, 1.12, 0], [3.3, -7.0, 0.92, 1], [6.1, -6.0, 0.95, 2],
  [-7.8, -2.3, 0.92, 1], [7.6, -2.1, 0.9, 0], [-7.7, 1.5, 1.02, 2],
  [7.6, 1.8, 0.98, 1], [-7.0, 5.0, 0.92, 0], [-4.7, 6.7, 0.86, 2],
  [-2.0, 7.4, 1.0, 1], [-5.7, -4.6, 0.78, 2], [5.5, -4.5, 0.82, 0],
  [-5.7, 3.8, 0.78, 1], [-3.6, -5.6, 0.74, 0],
  [0.1, -4.85, 1.58, 2],
];

const canopyColors = ['#397b4f', '#518e58', '#6ca461', '#8ab66c'];
const islandSegments = 96;
const islandRings = 12;

const edgeRadius = (angle) => 8.55
  + Math.sin(angle * 3 + 0.4) * 0.34
  + Math.sin(angle * 7 - 0.8) * 0.2
  + Math.cos(angle * 11) * 0.1;

const groundHeight = (x, z) => 0.035
  + Math.sin(x * 0.57 + z * 0.23) * 0.035
  + Math.cos(z * 0.46 - x * 0.19) * 0.025;

function buildIslandTop() {
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];
  const indices = [];
  const stride = islandSegments + 1;
  const innerColor = new THREE.Color('#9bc77a');
  const outerColor = new THREE.Color('#83b56e');

  for (let ring = 0; ring <= islandRings; ring += 1) {
    const amount = ring / islandRings;
    for (let segment = 0; segment <= islandSegments; segment += 1) {
      const angle = (segment / islandSegments) * Math.PI * 2;
      const radius = edgeRadius(angle) * amount;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const height = groundHeight(x, z) + Math.sin(amount * Math.PI) * 0.045;
      positions.push(x, height, z);

      const variation = 0.94 + Math.sin(x * 1.7 + z * 0.9) * 0.045;
      const color = innerColor.clone().lerp(outerColor, Math.max(0, (amount - 0.42) / 0.58));
      colors.push(color.r * variation, color.g * variation, color.b * variation);
    }
  }

  for (let ring = 0; ring < islandRings; ring += 1) {
    for (let segment = 0; segment < islandSegments; segment += 1) {
      const current = ring * stride + segment;
      const next = current + stride;
      indices.push(current, current + 1, next, current + 1, next + 1, next);
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function buildIslandCliffs() {
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];
  const indices = [];
  const cliffSegments = 48;
  const rings = [
    [0, -0.025], [0.32, -0.35], [0.7, -0.85], [1.15, -1.4], [1.15, -1.75],
  ];
  const rockColors = ['#99836b', '#88745f', '#796b5e', '#655f58', '#514e49'];
  const stride = cliffSegments + 1;

  rings.forEach(([offset, drop], ringIndex) => {
    const color = new THREE.Color(rockColors[ringIndex]);
    for (let segment = 0; segment <= cliffSegments; segment += 1) {
      const angle = (segment / cliffSegments) * Math.PI * 2;
      const irregularity = 0.045 * Math.sin(angle * 13 + ringIndex * 1.7);
      const radius = edgeRadius(angle) + offset + irregularity;
      const height = groundHeight(Math.cos(angle) * radius, Math.sin(angle) * radius) + drop;
      positions.push(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
      const shade = 0.8 + Math.sin(segment * 2.3 + ringIndex * 3.4) * 0.19;
      colors.push(color.r * shade, color.g * shade, color.b * shade);
    }
  });

  for (let ring = 0; ring < rings.length - 1; ring += 1) {
    for (let segment = 0; segment < cliffSegments; segment += 1) {
      const current = ring * stride + segment;
      const next = current + stride;
      indices.push(current, current + 1, next, current + 1, next + 1, next);
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function IslandTerrain() {
  const topGeometry = useMemo(buildIslandTop, []);
  const cliffGeometry = useMemo(buildIslandCliffs, []);
  const coastalRocks = useMemo(() => Array.from({ length: 28 }, (_, index) => {
    const angle = (index / 28) * Math.PI * 2;
    const radius = edgeRadius(angle) + 0.42;
    const scale = 0.24 + ((index * 17) % 9) * 0.035;
    return {
      key: index,
      position: [Math.cos(angle) * radius, -0.48 + Math.sin(index * 2.7) * 0.16, Math.sin(angle) * radius],
      rotation: [0.1 * (index % 4), index * 0.73, 0.12 * (index % 3)],
      scale: [scale * 1.5, scale, scale * 1.2],
    };
  }), []);

  return (
    <group>
      <mesh geometry={cliffGeometry} castShadow receiveShadow>
        <meshStandardMaterial vertexColors flatShading roughness={0.96} />
      </mesh>
      <Instances limit={coastalRocks.length} castShadow receiveShadow>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#817365" roughness={0.98} flatShading />
        {coastalRocks.map((rock) => (
          <Instance key={rock.key} position={rock.position} rotation={rock.rotation} scale={rock.scale} />
        ))}
      </Instances>
      <mesh geometry={topGeometry} receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.94} flatShading />
      </mesh>
    </group>
  );
}

export function OceanSurface() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.56, 0]} receiveShadow>
        <circleGeometry args={[150, 128]} />
        <meshPhysicalMaterial color="#378fa9" roughness={0.28} metalness={0.04} clearcoat={0.38} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.535, 0]}>
        <ringGeometry args={[10.1, 12.5, 128]} />
        <meshBasicMaterial color="#94dce0" transparent opacity={0.14} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function buildMountain(radius, height, seed, baseColor) {
  const geometry = new THREE.BufferGeometry();
  const positions = [0, height, 0];
  const colors = [];
  const indices = [];
  const segments = 16;
  const rings = [0.16, 0.34, 0.55, 0.78, 1];
  const base = new THREE.Color(baseColor);
  colors.push(base.r, base.g, base.b);

  rings.forEach((ringRadius, ringIndex) => {
    for (let segment = 0; segment < segments; segment += 1) {
      const angle = (segment / segments) * Math.PI * 2;
      const ridge = 1 + 0.11 * Math.sin(angle * 3 + seed) + 0.045 * Math.cos(angle * 5 - seed);
      const groundRadius = radius * ringRadius * ridge;
      const peakVariation = 0.88 + 0.12 * Math.cos(angle * 3 + seed);
      const y = height * (1 - ringRadius) * peakVariation;
      positions.push(Math.cos(angle) * groundRadius, y, Math.sin(angle) * groundRadius);
      const shade = 0.88 + 0.12 * Math.sin(angle * 2 + seed + ringIndex * 0.4);
      colors.push(base.r * shade, base.g * shade, base.b * shade);
    }
  });

  for (let segment = 0; segment < segments; segment += 1) {
    indices.push(0, 1 + segment, 1 + ((segment + 1) % segments));
  }
  for (let ring = 0; ring < rings.length - 1; ring += 1) {
    const currentRing = 1 + ring * segments;
    const nextRing = currentRing + segments;
    for (let segment = 0; segment < segments; segment += 1) {
      const nextSegment = (segment + 1) % segments;
      const current = currentRing + segment;
      const next = currentRing + nextSegment;
      const lower = nextRing + segment;
      const lowerNext = nextRing + nextSegment;
      indices.push(current, lower, next, next, lower, lowerNext);
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function DistantLandscape() {
  const mountains = [
    [-25, -1.2, -30, 9.2, 7.4, 0.2, '#829eaa'],
    [-12, -1.5, -34, 7.2, 6.2, 1.4, '#91b3ba'],
    [3, -1.7, -36, 10.5, 8.7, 2.5, '#7799a7'],
    [20, -1.35, -32, 11, 8.4, 3.8, '#89aab4'],
    [38, -1.45, -27, 9.6, 7.2, 4.7, '#789ba6'],
  ];
  const mountainGeometry = useMemo(() => mountains.map((mountain, index) => ({
    body: buildMountain(mountain[3], mountain[4], mountain[5], mountain[6]),
    snow: buildMountain(mountain[3] * 0.3, mountain[4] * 0.29, mountain[5] + 2, '#e5e9da'),
  })), []);
  const clouds = [
    [-17, 6.2, -17, 1.5], [0, 7, -21, 1.7], [19, 6.4, -18, 1.45],
    [30, 8.1, -12, 1.25], [-30, 7.2, -10, 1.2],
  ];

  return (
    <group>
      {mountains.map(([x, y, z, , height], index) => (
        <group key={`mountain-${index}`} position={[x, y, z]}>
          <mesh geometry={mountainGeometry[index].body} castShadow>
            <meshStandardMaterial vertexColors roughness={0.98} flatShading />
          </mesh>
          <mesh geometry={mountainGeometry[index].snow} position={[0, height * 0.71, 0.15]}>
            <meshStandardMaterial vertexColors roughness={1} flatShading />
          </mesh>
        </group>
      ))}
      {clouds.map(([x, y, z, scale], index) => (
        <group key={`cloud-${index}`} position={[x, y, z]} scale={scale}>
          {[
            [-0.8, 0, 0, 1], [0, 0.18, 0, 1.15], [0.82, 0.02, 0, 0.88],
          ].map(([offsetX, offsetY, offsetZ, size], puff) => (
            <mesh key={puff} position={[offsetX, offsetY, offsetZ]} scale={[size * 1.15, size * 0.62, size * 0.72]}>
              <sphereGeometry args={[1, 12, 8]} />
              <meshBasicMaterial color="#fffdf3" fog={false} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

export function Waterfall() {
  return (
    <group position={[4.25, -0.76, 8.32]}>
      <mesh>
        <planeGeometry args={[1.28, 1.52, 1, 12]} />
        <meshPhysicalMaterial
          color="#7bd5df"
          emissive="#388f9a"
          emissiveIntensity={0.12}
          roughness={0.18}
          metalness={0.04}
          clearcoat={0.5}
          transparent
          opacity={0.84}
          side={THREE.DoubleSide}
        />
      </mesh>
      {[-0.34, 0.02, 0.35].map((x) => (
        <mesh key={x} position={[x, 0, 0.012]}>
          <planeGeometry args={[0.035, 1.28]} />
          <meshBasicMaterial color="#c9f4ef" transparent opacity={0.48} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function GardenFence({ position, length, rotation = 0 }) {
  const postCount = Math.floor(length / 0.55) + 1;

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {Array.from({ length: postCount }, (_, index) => (
        <mesh key={`post-${index}`} position={[-length / 2 + (length / (postCount - 1)) * index, 0.42, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.075, 0.84, 7]} />
          <meshStandardMaterial color="#98704e" roughness={0.94} />
        </mesh>
      ))}
      {[0.27, 0.62].map((y) => (
        <RoundedBox key={y} args={[length, 0.085, 0.075]} radius={0.03} position={[0, y, 0]} castShadow>
          <meshStandardMaterial color="#bd9564" roughness={0.92} />
        </RoundedBox>
      ))}
    </group>
  );
}

export function VillageProps() {
  const lamps = [
    [-3.8, 0, 1.05], [-1.8, 0, 3.2], [1.6, 0, 1.0], [5.9, 0, 1.7],
  ];
  const benches = [
    { position: [-2.6, 0, -0.4], rotation: 0.35 },
    { position: [1.8, 0, -1.2], rotation: -0.5 },
  ];

  return (
    <>
      {lamps.map(([x, y, z], index) => (
        <group key={`lamp-${index}`} position={[x, y, z]}>
          <RoundedBox args={[0.28, 0.12, 0.28]} radius={0.035} position={[0, 0.08, 0]} castShadow>
            <meshStandardMaterial color="#8a6347" roughness={0.92} />
          </RoundedBox>
          <mesh position={[0, 0.95, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.075, 1.65, 8]} />
            <meshStandardMaterial color="#835e43" roughness={0.9} />
          </mesh>
          <RoundedBox args={[0.34, 0.4, 0.34]} radius={0.07} position={[0, 1.86, 0]} castShadow>
            <meshStandardMaterial color="#e7c98d" emissive="#f0b853" emissiveIntensity={0.38} roughness={0.55} />
          </RoundedBox>
          <mesh position={[0, 2.12, 0]} castShadow>
            <coneGeometry args={[0.26, 0.22, 6]} />
            <meshStandardMaterial color="#815d42" roughness={0.92} />
          </mesh>
          <mesh position={[0, 1.62, 0]} castShadow>
            <coneGeometry args={[0.25, 0.18, 6, 1, true]} />
            <meshStandardMaterial color="#815d42" roughness={0.92} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}

      {benches.map(({ position, rotation }, index) => (
        <group key={`bench-${index}`} position={position} rotation={[0, rotation, 0]}>
          <RoundedBox args={[1.25, 0.13, 0.42]} radius={0.06} position={[0, 0.55, 0]} castShadow receiveShadow>
            <meshStandardMaterial color="#bd8c5a" roughness={0.9} />
          </RoundedBox>
          <RoundedBox args={[1.25, 0.48, 0.1]} radius={0.05} position={[0, 0.86, -0.16]} castShadow>
            <meshStandardMaterial color="#a8794e" roughness={0.92} />
          </RoundedBox>
          {[-0.45, 0.45].map((x) => (
            <mesh key={x} position={[x, 0.25, 0]} castShadow>
              <cylinderGeometry args={[0.055, 0.065, 0.54, 7]} />
              <meshStandardMaterial color="#79583f" roughness={0.95} />
            </mesh>
          ))}
        </group>
      ))}

      <GardenFence position={[-5.4, 0, 0.2]} length={2.7} rotation={Math.PI / 2} />
      <GardenFence position={[5.8, 0, 2.8]} length={2.5} rotation={Math.PI / 2} />
      <GardenFence position={[-1.3, 0, 5.9]} length={2.2} rotation={0} />
    </>
  );
}

function makeRibbon(points, width, yOffset) {
  const curve = new THREE.CatmullRomCurve3(points.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
  const segments = 72;
  const positions = [];
  const indices = [];

  for (let index = 0; index <= segments; index += 1) {
    const amount = index / segments;
    const point = curve.getPointAt(amount);
    const tangent = curve.getTangentAt(amount).normalize();
    const sideX = tangent.z;
    const sideZ = -tangent.x;
    const wave = Math.sin(amount * Math.PI * 16) * 0.018;
    positions.push(
      point.x + sideX * width / 2, point.y + yOffset + wave, point.z + sideZ * width / 2,
      point.x - sideX * width / 2, point.y + yOffset - wave, point.z - sideZ * width / 2,
    );
    if (index < segments) {
      const vertex = index * 2;
      indices.push(vertex, vertex + 1, vertex + 2, vertex + 1, vertex + 3, vertex + 2);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function ForestBrook() {
  const geometry = useMemo(() => makeRibbon([
    [4.2, 0, 8.1], [3.8, 0, 6.8], [3.45, 0, 5.4], [3.5, 0, 4.3],
    [2.8, 0, 3.1], [2.6, 0, 1.3],
  ], 1.42, 0.13), []);

  return (
    <mesh geometry={geometry}>
      <meshPhysicalMaterial color="#5bc0cc" roughness={0.2} metalness={0.08} clearcoat={0.45} side={THREE.DoubleSide} />
    </mesh>
  );
}

export function ForestPath() {
  const geometry = useMemo(() => makeRibbon([
    [0.1, 0, 8.6], [-0.35, 0, 7.2], [-1.25, 0, 6.2], [-0.4, 0, 5.45],
    [1, 0, 5.1], [3.4, 0, 4.6], [2.45, 0, 3.55], [-0.2, 0, 2.45], [-0.2, 0, 1.55],
  ], 1.28, 0.19), []);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial color="#d8bd8d" roughness={0.98} flatShading />
    </mesh>
  );
}

export function FootBridge() {
  return (
    <group position={[3.5, 0.27, 4.6]}>
      <RoundedBox args={[2.7, 0.18, 1.04]} radius={0.06} position={[0, -0.12, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#805a40" roughness={0.9} />
      </RoundedBox>
      {Array.from({ length: 9 }, (_, index) => (
        <RoundedBox
          key={`plank-${index}`}
          args={[0.27, 0.1, 0.96]}
          radius={0.025}
          position={[-1.08 + index * 0.27, -0.035, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={index % 2 ? '#c69562' : '#d3a371'} roughness={0.88} />
        </RoundedBox>
      ))}
      {[-0.47, 0.47].map((z) => (
        <group key={z} position={[0, 0.42, z]}>
          {Array.from({ length: 6 }, (_, index) => (
            <mesh key={`post-${index}`} position={[-1.12 + index * 0.45, 0, 0]} castShadow>
              <cylinderGeometry args={[0.065, 0.085, 0.76, 7]} />
              <meshStandardMaterial color="#966743" roughness={0.92} />
            </mesh>
          ))}
          <RoundedBox args={[2.58, 0.13, 0.13]} radius={0.05} position={[0, 0.3, 0]} castShadow>
            <meshStandardMaterial color="#b98250" roughness={0.88} />
          </RoundedBox>
        </group>
      ))}
    </group>
  );
}

function createCanopyGeometry(variant) {
  const geometry = new THREE.IcosahedronGeometry(1, 1);
  const positions = geometry.attributes.position;
  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index);
    const y = positions.getY(index);
    const z = positions.getZ(index);
    const vertexKey = `${x.toFixed(4)}:${y.toFixed(4)}:${z.toFixed(4)}:${variant}`;
    let hash = 0;
    for (let keyIndex = 0; keyIndex < vertexKey.length; keyIndex += 1) {
      hash = ((hash << 5) - hash + vertexKey.charCodeAt(keyIndex)) | 0;
    }
    const variation = ((hash >>> 0) % 1000) / 1000;
    const ripple = 1 + 0.075 * Math.sin(x * 4.2 + y * 2.3 + z * 3.1 + variant * 1.7)
      + 0.025 * (variation - 0.5);
    positions.setXYZ(index, x * ripple * 1.04, y * ripple * (0.92 + variant * 0.025), z * ripple);
  }
  geometry.computeVertexNormals();
  return geometry;
}

export function ForestTreeLine() {
  const canopyGeometries = useMemo(() => canopyColors.map((_, variant) => createCanopyGeometry(variant)), []);
  const branches = treeVariants.flatMap(([x, z, scale], treeIndex) => [
    { position: [x - scale * 0.23, scale * 1.1, z], rotation: [0, 0, -0.62], scale: [scale * 0.86, scale * 0.11, scale * 0.11], key: `${treeIndex}-left` },
    { position: [x + scale * 0.24, scale * 1.26, z + scale * 0.04], rotation: [0.15, 0, 0.62], scale: [scale * 0.82, scale * 0.1, scale * 0.1], key: `${treeIndex}-right` },
  ]);

  return (
    <>
      <Instances limit={treeVariants.length} castShadow receiveShadow>
        <cylinderGeometry args={[0.17, 0.28, 1, 8]} />
        <meshStandardMaterial color="#826044" roughness={0.96} flatShading />
        {treeVariants.map(([x, z, scale], index) => (
          <Instance key={`trunk-${index}`} position={[x, scale * 0.84, z]} scale={[scale, scale * 1.75, scale]} />
        ))}
      </Instances>
      <Instances limit={branches.length} castShadow receiveShadow>
        <cylinderGeometry args={[0.06, 0.14, 1, 7]} />
        <meshStandardMaterial color="#896748" roughness={0.96} flatShading />
        {branches.map((branch) => (
          <Instance key={branch.key} position={branch.position} rotation={branch.rotation} scale={branch.scale} />
        ))}
      </Instances>

      {canopyColors.map((color, variant) => {
        const matchingTrees = treeVariants.filter((tree) => tree[3] === variant);
        return (
          <Instances key={color} limit={matchingTrees.length * 6} castShadow receiveShadow>
            <primitive object={canopyGeometries[variant]} attach="geometry" />
            <meshStandardMaterial color={color} roughness={0.91} flatShading />
            {matchingTrees.flatMap(([x, z, scale], treeIndex) => {
              const layers = [
                [0, 2.13, 0, 0.94], [-0.5, 1.93, 0.04, 0.69], [0.5, 1.98, 0.03, 0.72],
                [-0.08, 1.94, 0.48, 0.64], [0.04, 2.05, -0.48, 0.68], [0.02, 2.68, 0, 0.58],
              ];
              return layers.map(([offsetX, y, offsetZ, size], layerIndex) => (
                <Instance
                  key={`${variant}-${treeIndex}-${layerIndex}`}
                  position={[x + offsetX * scale, y * scale, z + offsetZ * scale]}
                  rotation={[0.08 * layerIndex, (treeIndex * 0.57 + layerIndex) % (Math.PI * 2), 0.04 * (layerIndex % 2)]}
                  scale={[size * scale, size * scale, size * scale]}
                />
              ));
            })}
          </Instances>
        );
      })}
    </>
  );
}

function HouseWindow({ position }) {
  return (
    <group position={position}>
      <RoundedBox args={[0.48, 0.52, 0.09]} radius={0.07} castShadow>
        <meshStandardMaterial color="#8c6247" roughness={0.86} />
      </RoundedBox>
      <RoundedBox args={[0.34, 0.37, 0.035]} radius={0.04} position={[0, 0, 0.055]}>
        <meshStandardMaterial color="#9dcbd0" roughness={0.38} metalness={0.08} />
      </RoundedBox>
      <mesh position={[0, 0, 0.085]}>
        <boxGeometry args={[0.035, 0.4, 0.02]} />
        <meshStandardMaterial color="#fff0d0" roughness={0.82} />
      </mesh>
      <mesh position={[0, 0, 0.087]}>
        <boxGeometry args={[0.34, 0.035, 0.02]} />
        <meshStandardMaterial color="#fff0d0" roughness={0.82} />
      </mesh>
    </group>
  );
}

export function VillageHouse({ building, onClick }) {
  const wallColor = building.wallColor || '#ead2a1';
  const roofColor = building.roofColor || '#bd7769';
  const trimColor = building.trimColor || '#936b4c';

  return (
    <group position={building.position} onClick={onClick}>
      <RoundedBox args={[2.36, 0.22, 2.1]} radius={0.08} position={[0, 0.12, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#9b8061" roughness={0.98} flatShading />
      </RoundedBox>
      <RoundedBox args={[2.12, 1.48, 1.72]} radius={0.12} position={[0, 0.93, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={wallColor} roughness={0.93} flatShading />
      </RoundedBox>
      <RoundedBox args={[2.48, 0.13, 2.02]} radius={0.055} position={[0, 1.59, 0.02]} castShadow receiveShadow>
        <meshStandardMaterial color={trimColor} roughness={0.92} />
      </RoundedBox>

      {[-1, 1].map((side) => (
        <group key={`roof-${side}`}>
          <RoundedBox
            args={[1.55, 0.18, 2.22]}
            radius={0.07}
            position={[side * 0.61, 2.02, -0.02]}
            rotation={[0, 0, -side * 0.48]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color={roofColor} roughness={0.88} flatShading />
          </RoundedBox>
          {[0, 1, 2].map((row) => (
            <RoundedBox
              key={`tile-${row}`}
              args={[1.23, 0.035, 0.065]}
              radius={0.015}
              position={[side * (0.53 + row * 0.17), 2.32 - (0.53 + row * 0.17) * 0.53, -0.68]}
              rotation={[0, 0, -side * 0.48]}
            >
              <meshStandardMaterial color={row === 1 ? roofColor : new THREE.Color(roofColor).multiplyScalar(0.9)} roughness={0.84} />
            </RoundedBox>
          ))}
          {[0, 1, 2].map((row) => (
            <RoundedBox
              key={`tile-front-${row}`}
              args={[1.23, 0.035, 0.065]}
              radius={0.015}
              position={[side * (0.53 + row * 0.17), 2.32 - (0.53 + row * 0.17) * 0.53, 0.64]}
              rotation={[0, 0, -side * 0.48]}
            >
              <meshStandardMaterial color={row === 1 ? roofColor : new THREE.Color(roofColor).multiplyScalar(0.9)} roughness={0.84} />
            </RoundedBox>
          ))}
        </group>
      ))}
      <RoundedBox args={[0.32, 0.48, 0.34]} radius={0.035} position={[0.62, 2.36, -0.43]} castShadow>
        <meshStandardMaterial color="#a66f57" roughness={0.92} />
      </RoundedBox>

      <HouseWindow position={[-0.67, 1.08, 0.88]} />
      <HouseWindow position={[0.67, 1.08, 0.88]} />
      <RoundedBox args={[0.48, 0.95, 0.1]} radius={0.08} position={[0, 0.63, 0.89]} castShadow>
        <meshStandardMaterial color="#8b6046" roughness={0.9} />
      </RoundedBox>
      <mesh position={[0.14, 0.68, 0.95]}>
        <sphereGeometry args={[0.035, 8, 6]} />
        <meshStandardMaterial color="#edc66f" metalness={0.3} roughness={0.4} />
      </mesh>
      <RoundedBox args={[0.68, 0.12, 0.22]} radius={0.035} position={[0, 0.14, 1.02]} castShadow receiveShadow>
        <meshStandardMaterial color="#c99b69" roughness={0.9} />
      </RoundedBox>

      {[-0.9, 0.9].map((x) => (
        <mesh key={`porch-${x}`} position={[x, 1.05, 1.1]} castShadow>
          <cylinderGeometry args={[0.065, 0.075, 1.04, 8]} />
          <meshStandardMaterial color="#a77a54" roughness={0.93} />
        </mesh>
      ))}
      <RoundedBox args={[2.1, 0.12, 0.52]} radius={0.05} position={[0, 1.57, 1.12]} castShadow>
        <meshStandardMaterial color={roofColor} roughness={0.88} />
      </RoundedBox>
      <RoundedBox args={[1.05, 0.28, 0.1]} radius={0.045} position={[0, 1.77, 1.21]} castShadow>
        <meshStandardMaterial color={trimColor} roughness={0.9} />
      </RoundedBox>
      <mesh position={[0, 1.77, 1.27]}>
        <planeGeometry args={[0.86, 0.14]} />
        <meshStandardMaterial color="#f5e7c7" roughness={0.9} />
      </mesh>
    </group>
  );
}