import { useState } from 'react';
import ForestScene from './components/ForestScene';

// メイン画面。
// 住民をクリックしたときに発生する会話状態を管理し、UIとして表示する。
export default function App() {
  const [selectedResident, setSelectedResident] = useState(null);

  return (
    <div className="app-shell">
      <div className="hud">
        <span className="hud-badge" aria-hidden="true" />
        <span className="hud-title">集まれ仕様書の森</span>
      </div>

      <ForestScene onResidentClick={setSelectedResident} />

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
