import { useCallback, useEffect, useRef, useState } from 'react';
import ForestScene from './components/ForestScene';
import { MUSIC_TRACKS } from './audioTracks';

const VOLUME_KEY = 'engpfsite-bgm-volume';
const ENABLED_KEY = 'engpfsite-bgm-enabled';
const DEFAULT_VOLUME = 0.3;
const REQUESTS = [
  {
    id: 'site-creator',
    type: 'creator',
    requester: 'サイト制作者からの依頼',
    title: '森のカフェを紹介するサイト',
    description: 'メニューや営業時間、森の雰囲気が伝わるWebサイトを作ってほしい！',
    status: '進行中',
    avatar: '制',
  },
  {
    id: 'friends',
    type: 'friends',
    requester: '仲良しトリオからの依頼',
    title: '3人の個性を伝える作品紹介サイト',
    description: 'それぞれの活動や作品を紹介できる、楽しいサイトを一緒に作ってほしい！',
    status: '未着手',
    avatar: '3人',
  },
];

const REQUEST_FILTERS = [
  { id: 'all', label: 'すべて' },
  { id: 'creator', label: 'サイト制作者' },
  { id: 'friends', label: '仲良しトリオ' },
];

const shuffle = (items) => {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[randomIndex]] = [next[randomIndex], next[index]];
  }
  return next;
};

export default function App() {
  const [selectedResident, setSelectedResident] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [bgmEnabled, setBgmEnabled] = useState(false);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [currentTrack, setCurrentTrack] = useState('');
  const [requestInboxOpen, setRequestInboxOpen] = useState(false);
  const [requestFilter, setRequestFilter] = useState('all');
  const audioRef = useRef(null);
  const queueRef = useRef([]);
  const currentTrackRef = useRef('');

  const ensureAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.loop = false;
      audio.preload = 'auto';
      audio.volume = 0.02;
      audioRef.current = audio;

      audio.onerror = () => {
        setCurrentTrack('');
        currentTrackRef.current = '';
        setBgmEnabled(false);
      };
    }

    return audioRef.current;
  }, []);

  const applyVolume = useCallback((nextVolume) => {
    if (audioRef.current) {
      audioRef.current.volume = nextVolume;
    }
  }, []);

  const pickNextTrack = useCallback((previousTrack = currentTrackRef.current) => {
    if (!MUSIC_TRACKS.length) {
      setCurrentTrack('');
      currentTrackRef.current = '';
      return null;
    }

    if (MUSIC_TRACKS.length === 1) {
      return MUSIC_TRACKS[0];
    }

    const remaining = queueRef.current.length ? [...queueRef.current] : shuffle(MUSIC_TRACKS.filter((track) => track !== previousTrack));

    let nextTrack = null;
    if (remaining.length > 0) {
      nextTrack = remaining.find((track) => track !== previousTrack) || remaining[0];
      queueRef.current = remaining.filter((track) => track !== nextTrack);
    }

    if (!nextTrack) {
      const fallback = shuffle(MUSIC_TRACKS.filter((track) => track !== previousTrack));
      nextTrack = fallback[0] || MUSIC_TRACKS[0];
      queueRef.current = [];
    }

    return nextTrack;
  }, []);

  const playTrack = useCallback(async (trackName, autoplay = false) => {
    const audio = ensureAudio();
    const safeName = trackName || pickNextTrack();

    if (!safeName) {
      setCurrentTrack('');
      currentTrackRef.current = '';
      return;
    }

    const url = `/audio/${safeName}`;
    audio.src = url;
    audio.loop = MUSIC_TRACKS.length <= 1;
    audio.volume = 0.02;
    currentTrackRef.current = safeName;
    setCurrentTrack(safeName);

    if (!autoplay) {
      return;
    }

    try {
      await audio.play();
      const start = performance.now();
      const fadeDuration = 800;
      const animateFade = (now) => {
        const ratio = Math.min((now - start) / fadeDuration, 1);
        audio.volume = 0.02 + (volume * ratio);
        if (ratio < 1) {
          requestAnimationFrame(animateFade);
        }
      };
      requestAnimationFrame(animateFade);
    } catch (error) {
      console.warn('BGM autoplay was blocked by the browser.', error);
      setBgmEnabled(false);
    }
  }, [ensureAudio, pickNextTrack, volume]);

  const restartCurrentTrack = useCallback(async () => {
    const audio = ensureAudio();
    if (!currentTrackRef.current) {
      return;
    }

    audio.currentTime = 0;
    audio.volume = 0.02;

    if (bgmEnabled) {
      try {
        await audio.play();
        audio.volume = volume;
      } catch (error) {
        console.warn('Unable to restart the current BGM track.', error);
      }
    }
  }, [bgmEnabled, ensureAudio, volume]);

  const skipTrack = useCallback(async () => {
    const nextTrack = pickNextTrack(currentTrackRef.current);
    if (!nextTrack) {
      return;
    }

    await playTrack(nextTrack, bgmEnabled);
  }, [bgmEnabled, pickNextTrack, playTrack]);

  const unlockAudio = useCallback(async () => {
    if (!MUSIC_TRACKS.length) {
      return;
    }

    const audio = ensureAudio();

    if (!currentTrackRef.current) {
      const selected = pickNextTrack();
      if (!selected) {
        return;
      }
      await playTrack(selected, true);
      setBgmEnabled(true);
      return;
    }

    try {
      await audio.play();
      setBgmEnabled(true);
    } catch (error) {
      console.warn('BGM autoplay was blocked by the browser.', error);
      setBgmEnabled(false);
    }
  }, [ensureAudio, pickNextTrack, playTrack]);

  const toggleBgm = useCallback(async () => {
    if (!MUSIC_TRACKS.length) {
      return;
    }

    const audio = ensureAudio();

    if (bgmEnabled) {
      audio.pause();
      setBgmEnabled(false);
      return;
    }

    if (!currentTrackRef.current) {
      const selected = pickNextTrack();
      if (!selected) {
        return;
      }
      await playTrack(selected, true);
      setBgmEnabled(true);
      return;
    }

    try {
      await audio.play();
      setBgmEnabled(true);
    } catch (error) {
      console.warn('Unable to start the forest BGM.', error);
      setBgmEnabled(false);
    }
  }, [bgmEnabled, ensureAudio, pickNextTrack, playTrack]);

  useEffect(() => {
    try {
      const storedVolume = Number(window.localStorage.getItem(VOLUME_KEY));
      if (!Number.isNaN(storedVolume) && storedVolume >= 0 && storedVolume <= 1) {
        setVolume(storedVolume);
      }

      const storedEnabled = window.localStorage.getItem(ENABLED_KEY);
      if (storedEnabled === 'true') {
        setBgmEnabled(true);
      }
    } catch (error) {
      console.warn('Failed to restore BGM settings.', error);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(VOLUME_KEY, String(volume));
    } catch (error) {
      console.warn('Failed to persist BGM volume.', error);
    }

    applyVolume(volume);
  }, [applyVolume, volume]);

  useEffect(() => {
    try {
      window.localStorage.setItem(ENABLED_KEY, String(bgmEnabled));
    } catch (error) {
      console.warn('Failed to persist BGM enabled state.', error);
    }
  }, [bgmEnabled]);

  useEffect(() => {
    if (!MUSIC_TRACKS.length) {
      return undefined;
    }

    const audio = ensureAudio();
    if (!audio) {
      return undefined;
    }

    audio.onended = async () => {
      if (MUSIC_TRACKS.length <= 1) {
        audio.currentTime = 0;
        if (bgmEnabled) {
          try {
            await audio.play();
          } catch (error) {
            console.warn('Failed to loop the last BGM track.', error);
          }
        }
        return;
      }

      const nextTrack = pickNextTrack(currentTrackRef.current);
      if (nextTrack) {
        await playTrack(nextTrack, bgmEnabled);
      }
    };

    return () => {
      audio.onended = null;
    };
  }, [bgmEnabled, ensureAudio, pickNextTrack, playTrack]);

  useEffect(() => {
    if (!MUSIC_TRACKS.length) {
      return;
    }

    if (bgmEnabled && !currentTrackRef.current) {
      const selected = pickNextTrack();
      if (selected) {
        playTrack(selected, true).catch(() => setBgmEnabled(false));
      }
    }

    if (!bgmEnabled && audioRef.current) {
      audioRef.current.pause();
    }
  }, [bgmEnabled, pickNextTrack, playTrack]);

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

  useEffect(() => {
    if (!requestInboxOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setRequestInboxOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [requestInboxOpen]);

  const hasTracks = MUSIC_TRACKS.length > 0;
  const visibleRequests = REQUESTS.filter((request) => requestFilter === 'all' || request.type === requestFilter);

  return (
    <div className="game-root" onPointerDown={() => { if (!bgmEnabled && hasTracks) { unlockAudio().catch(() => {}); } }}>
      <ForestScene
        onResidentClick={(resident) => {
          setSelectedBuilding(null);
          setSelectedResident(resident);
          if (hasTracks) {
            unlockAudio().catch(() => {});
          }
        }}
        onBuildingClick={(building) => {
          setSelectedResident(null);
          setSelectedBuilding(building);
          if (hasTracks) {
            unlockAudio().catch(() => {});
          }
        }}
        onUserGesture={() => {
          if (hasTracks) {
            unlockAudio().catch(() => {});
          }
        }}
        onRequestInboxOpen={() => setRequestInboxOpen(true)}
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
          disabled={!hasTracks}
        >
          {bgmEnabled ? '♫' : '♪'}
        </button>

        <div className="bgm-panel">
          <div className="bgm-meta">{currentTrack || (hasTracks ? '待機中' : '音源なし')}</div>

          <div className="bgm-actions">
            <button type="button" className="bgm-action" onClick={restartCurrentTrack} disabled={!hasTracks || !currentTrack}>
              再生
            </button>
            <button type="button" className="bgm-action" onClick={skipTrack} disabled={!hasTracks}>
              次へ
            </button>
          </div>

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
              disabled={!hasTracks}
            />
          </label>
        </div>
      </div>

      {requestInboxOpen && (
        <div
          className="request-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setRequestInboxOpen(false);
            }
          }}
        >
          <section className="request-dialog" role="dialog" aria-modal="true" aria-labelledby="request-title">
            <header className="request-dialog-header">
              <div>
                <span className="request-eyebrow">MORI POST</span>
                <h2 id="request-title">届いた依頼</h2>
                <p>森のみんなから届いた依頼を確認しよう</p>
              </div>
              <button
                type="button"
                className="close-button request-close"
                aria-label="依頼一覧を閉じる"
                onClick={() => setRequestInboxOpen(false)}
              >
                ×
              </button>
            </header>

            <div className="request-tabs" role="tablist" aria-label="依頼の送り主で絞り込む">
              {REQUEST_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  role="tab"
                  aria-selected={requestFilter === filter.id}
                  className={requestFilter === filter.id ? 'request-tab is-active' : 'request-tab'}
                  onClick={() => setRequestFilter(filter.id)}
                >
                  {filter.label}
                  {filter.id === 'all' && <span className="request-tab-count">2</span>}
                </button>
              ))}
            </div>

            <div className="request-list">
              {visibleRequests.map((request) => (
                <article className="request-card" key={request.id}>
                  <div className={`request-avatar avatar-${request.type}`} aria-hidden="true">
                    {request.avatar}
                  </div>
                  <div className="request-card-content">
                    <div className="request-card-meta">
                      <span>{request.requester}</span>
                      <span className={request.status === '進行中' ? 'request-status is-progress' : 'request-status'}>
                        {request.status}
                      </span>
                    </div>
                    <h3>{request.title}</h3>
                    <p>{request.description}</p>
                  </div>
                  <span className="request-card-arrow" aria-hidden="true">›</span>
                </article>
              ))}
              {visibleRequests.length === 0 && <p className="request-empty">この送り主からの依頼はありません。</p>}
            </div>
            <footer className="request-dialog-footer">依頼は全部で {REQUESTS.length} 件です</footer>
          </section>
        </div>
      )}

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
