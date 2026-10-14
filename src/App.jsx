import { useEffect, useRef, useState } from 'react';
import ForestScene from './components/ForestScene';

const STORAGE_KEY = 'engpfsite-bgm-volume';
const DEFAULT_VOLUME = 0.32;

export default function App() {
  const [selectedResident, setSelectedResident] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [bgmEnabled, setBgmEnabled] = useState(false);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const audioRef = useRef(null);

  useEffect(() => {
    try {
      const stored = Number(window.localStorage.getItem(STORAGE_KEY));
      if (!Number.isNaN(stored) && stored >= 0 && stored <= 1) {
        setVolume(stored);
      }
    } catch (error) {
      console.warn('BGM volume was not restored from localStorage.', error);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(volume));
    } catch (error) {
      console.warn('Failed to save BGM volume.', error);
    }

    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const ensureAudio = () => {
    if (audioRef.current) {
      return audioRef.current;
    }

    const audio = new Audio('/audio/bgm.mp3');
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = volume;
    audioRef.current = audio;
    audio.onerror = () => {
      setBgmEnabled(false);
    };
    return audio;
  };

  const unlockAudio = async () => {
    const audio = ensureAudio();
    if (!audio) {
      return;
    }

    try {
      await audio.play();
      setBgmEnabled(true);
    } catch (error) {
      console.warn('BGM autoplay was blocked by the browser.', error);
      setBgmEnabled(false);
    }
  };

  const toggleBgm = async () => {
    const audio = ensureAudio();
    if (!audio) {
      return;
    }

    if (bgmEnabled) {
      audio.pause();
      setBgmEnabled(false);
      return;
    }

    await unlockAudio();
  };

  useEffect(() => {
    const audio = ensureAudio();

    if (!audio) {
      return;
    }

    audio.volume = volume;
    if (bgmEnabled) {
      audio.play().catch(() => setBgmEnabled(false));
    } else {
      audio.pause();
    }
  }, [bgmEnabled, volume]);

  useEffect(() => {
    if (!selectedResident && !selectedBuilding) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSelectedResident(null);
      setSelectedBuilding(null);
    }, 30000);

    return () => window.clearTimeout(timer);
  }, [selectedResident, selectedBuilding]);

  return (
    <div className="game-root" onPointerDown={() => { if (!bgmEnabled) { unlockAudio().catch(() => {}); } }}>
      <ForestScene
        onResidentClick={(resident) => {
          setSelectedBuilding(null);
          setSelectedResident(resident);
          unlockAudio().catch(() => {});
        }}
        onBuildingClick={(building) => {
          setSelectedResident(null);
          setSelectedBuilding(building);
          unlockAudio().catch(() => {});
        }}
        onUserGesture={() => unlockAudio().catch(() => {})}
      />

      <div className="controls-hint">
        左ドラッグで回転 / 右ドラッグで移動 / ホイールでズーム / ダブルクリックで移動
      </div>

      <div className="bgm-controls">
        <button
          type="button"
          className="bgm-toggle"
          aria-label={bgmEnabled ? 'BGMを停止' : 'BGMを再生'}
          onClick={toggleBgm}
        >
          {bgmEnabled ? '♫' : '♪'}
        </button>

        <label className="bgm-slider-wrap" htmlFor="bgm-volume">
          <span>音量</span>
          <input
            id="bgm-volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
          />
        </label>
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

      {selectedBuilding && (
        <aside className="detail-window" aria-live="polite">
          <div className="talk-header">
            <h2 className="talk-name">{selectedBuilding.name}</h2>
            <button
              type="button"
              className="close-button"
              aria-label="詳細を閉じる"
              onClick={() => setSelectedBuilding(null)}
            >
              ×
            </button>
          </div>
          <p className="talk-body">{selectedBuilding.description}</p>
        </aside>
      )}
    </div>
  );
}
