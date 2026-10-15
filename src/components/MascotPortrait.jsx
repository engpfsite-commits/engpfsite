import { Canvas } from '@react-three/fiber';
import MascotModel from './MascotModel';

export default function MascotPortrait({ species, costume, className = '' }) {
  return (
    <div className={`mascot-portrait ${className}`} aria-hidden="true">
      <Canvas
        dpr={1}
        camera={{ position: [0, 1.05, 4.2], fov: 34 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
        onCreated={({ scene }) => {
          scene.background = null;
        }}
      >
        <ambientLight intensity={1.15} color="#fff5de" />
        <directionalLight position={[-3, 5, 4]} intensity={2.1} color="#ffe8c0" />
        <directionalLight position={[3, 2, -2]} intensity={0.65} color="#d9e7ff" />
        <group position={[0, -0.86, 0]} rotation={[0, -0.13, 0]}>
          <MascotModel species={species} costume={costume} scale={0.95} />
        </group>
      </Canvas>
    </div>
  );
}