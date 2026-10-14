import { useState } from 'react';
import ForestScene from './components/ForestScene';

export default function App() {
  const [selectedResident, setSelectedResident] = useState(null);
  const [virtualMove, setVirtualMove] = useState({ x: 0, y: 0 });

  const setStick = (clientX, clientY, element) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const maxDistance = rect.width / 2 - 16;
    const distance = Math.min(Math.hypot(dx, dy), maxDistance);
    const angle = Math.atan2(dy, dx);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    setVirtualMove({
      x: Number((x / maxDistance).toFixed(2)),
      y: Number((y / maxDistance).toFixed(2)),
    });
  };

  const handleStickStart = (event) => {
    event.preventDefault();
    setStick(event.clientX, event.clientY, event.currentTarget);
  };

  const handleStickMove = (event) => {
    if (event.buttons === 0 && event.pointerType !== 'touch') {
      return;
    }
    event.preventDefault();
    setStick(event.clientX, event.clientY, event.currentTarget);
  };

  const handleStickEnd = () => {
    setVirtualMove({ x: 0, y: 0 });
  };

  const stickX = virtualMove.x * 26;
  const stickY = virtualMove.y * 26;

  return (
    <div className="game-root">
      <ForestScene
        onResidentClick={setSelectedResident}
        joystick={virtualMove}
      />

      <div className="controls-hint">
        WASD / 矢印キーで移動 • E で話す
      </div>

      <div
        className="touch-pad"
        onPointerDown={handleStickStart}
        onPointerMove={handleStickMove}
        onPointerUp={handleStickEnd}
        onPointerLeave={handleStickEnd}
        onPointerCancel={handleStickEnd}
        aria-label="仮想スティック"
      >
        <div
          className="touch-pad-knob"
          style={{ transform: `translate(${stickX}px, ${stickY}px)` }}
        />
      </div>

      {selectedResident && (
        <aside className="talk-window" aria-live="polite">
          <div className="talk-header">
            <h2 className="talk-name">{selectedResident.name}</h2>
            <button
              type="button"
              className="close-button"
              aria-label="会話を閉じる"
              onClick={() => setSelectedResident(null)}
            >
              ×
            </button>
          </div>
          <p className="talk-body">{selectedResident.message}</p>
        </aside>
      )}
    </div>
  );
}
