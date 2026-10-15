import MascotModel from './MascotModel';

export default function Resident({ resident, onSelect }) {
  return (
    <group position={resident.position} onClick={(event) => {
      event.stopPropagation();
      onSelect(resident);
    }}>
      <MascotModel species={resident.species} costume={resident.costume} scale={0.92} />
    </group>
  );
}
