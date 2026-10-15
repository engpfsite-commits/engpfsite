import { useCallback, useEffect, useRef, useState } from 'react';
import ForestScene from './components/ForestScene';
import MascotPortrait from './components/MascotPortrait';
import { MUSIC_TRACKS, NATURE_TRACKS } from './audioTracks';

const VOLUME_KEY = 'engpfsite-bgm-volume';
const ENABLED_KEY = 'engpfsite-bgm-enabled';
const AUDIO_MODE_KEY = 'engpfsite-audio-mode';
const DEFAULT_VOLUME = 0.3;
const REQUESTS = [
  {
    id: 'site-creator',
    type: 'creator',
    requester: 'サイト制作者からの依頼',
    title: 'どうぶつたちの依頼を管理するサイト',
    description: 'この森に集まった依頼を、仕様書・スケジュール・成果物までまとめて管理したい！',
    status: '進行中',
    avatar: '制',
  },
  {
    id: 'friends',
    type: 'friends',
    requester: '仲良しトリオからの依頼',
    title: '3人それぞれの夢を叶える個別サイト',
    description: 'エンジニア・アイドル・クリエイター、それぞれの活動を発信したい！',
    status: '未着手',
    avatar: '3人',
  },
];

const REQUEST_DETAIL_TABS = [
  { id: 'overview', label: '概要' },
  { id: 'specification', label: '仕様書' },
  { id: 'schedule', label: 'スケジュール' },
  { id: 'minutes', label: '議事録' },
  { id: 'deliverables', label: '成果物' },
];

const SITE_CREATOR_DETAIL_TABS = [
  { id: 'overview', label: '概要' },
  { id: 'specification', label: '依頼の例' },
  { id: 'maintenance', label: '保守方針' },
  { id: 'schedule', label: 'スケジュール' },
  { id: 'minutes', label: '議事録' },
  { id: 'deliverables', label: '成果物' },
];

const REQUEST_DETAILS = {
  'site-creator': {
    client: 'サイト制作者',
    priority: '高',
    brief: 'この森に集まったどうぶつたちからの依頼をまとめて、サイトとして管理したいんだ！仕様書・スケジュール・議事録・成果物まで一括で確認できるサイトを作ってほしいな。',
    overview: [
      ['目的', '依頼の受付から公開後の記録までを一か所で管理する'],
      ['利用者', 'サイト制作者と3人のどうぶつ住民'],
      ['優先事項', '依頼の見つけやすさと、進捗・関連記録への移動しやすさ'],
    ],
    requirements: [
      ['依頼一覧', '依頼者・カテゴリ・進捗で検索、絞り込みができる'],
      ['依頼詳細', '概要、仕様、議事録、成果物を案件ごとにまとめる'],
      ['スケジュール', '工程と担当、進捗をガントチャート風に確認する'],
      ['成果物', '完成したサイトや画像、公開先を案件に紐づけて残す'],
      ['どうぶつ管理', '住民のプロフィールと依頼履歴を確認・編集する'],
    ],
    requestExamples: [
      {
        id: 'quick',
        title: 'とりあえず完成させたい',
        subtitle: 'バイブコーディングでサクッと！',
        description: 'まずは動くものを早く公開。細かなデザイン調整は後から進める。',
        steps: ['依頼動物と内容を決める', 'バイブコーディングで実装', '完成したらすぐ公開'],
        useCases: ['アイデアをすぐ形にしたい', '機能を先に試したい'],
        maintenance: '運用例：保守なし',
        tone: 'quick',
        species: 'dog',
        costume: 'everyday',
      },
      {
        id: 'crafted',
        title: '作り込んだサイトが欲しい',
        subtitle: '実装重視でスキルアップ！',
        description: '要件定義、仕様書、スケジュールを整え、実務に近い流れで制作する。',
        steps: ['依頼と要件を整理', '仕様書・設計を作成', '実装・テスト・公開', '公開後も改善'],
        useCases: ['仕様書作成を練習したい', '継続的に運用したい'],
        maintenance: '運用例：保守あり',
        tone: 'crafted',
        species: 'owl',
        costume: 'researcher',
      },
      {
        id: 'technology',
        title: '特定の技術を試したい',
        subtitle: '学習・実験用サイト',
        description: 'Python、データベース、APIなど、学びたい技術を使って小さく検証する。',
        steps: ['試す技術と依頼を決める', '実装して動作を確認', '学びを記録して公開'],
        useCases: ['新しい技術を試したい', '小規模な実験をしたい'],
        maintenance: '運用例：保守なし',
        tone: 'technology',
        species: 'cat',
        costume: 'researcher',
      },
      {
        id: 'creative',
        title: '遊びたい・創作したい',
        subtitle: 'メルヘンな依頼で楽しもう！',
        description: 'どうぶつたちのユニークな依頼をもとに、自由な発想でサイトを作る。',
        steps: ['依頼動物とテーマを決める', '自由にデザイン・実装', '完成した作品を公開'],
        useCases: ['創作の世界観を楽しみたい', '自由にアイデアを試したい'],
        maintenance: '運用例：保守なし',
        tone: 'creative',
        species: 'giraffe',
        costume: 'artist',
      },
    ],
    maintenance: {
      modes: [
        {
          id: 'no-maintenance',
          title: '保守なし（作りっぱなし）',
          summary: '完成した状態で公開し、定期的な更新は行わない。',
          useCases: ['小さなサイトや技術実験', 'まず完成・公開を優先したい'],
          tone: 'oneoff',
        },
        {
          id: 'ongoing',
          title: '保守あり（継続運用）',
          summary: '公開後も追加依頼や変更に対応し、記録を残しながら改善する。',
          useCases: ['継続して使うサイト', '変更履歴や学びを残したい'],
          tone: 'ongoing',
        },
      ],
      flow: ['追加の依頼が届く', '内容を確認して仕様を更新', '修正・機能追加を実装', 'やり取りと変更履歴を保存'],
    },
    schedule: [
      { phase: '依頼・要件の整理', status: '完了', progress: 100, tone: 'complete' },
      { phase: '画面設計・仕様書', status: '進行中', progress: 68, tone: 'active' },
      { phase: '実装・動作確認', status: 'これから', progress: 0, tone: 'planned' },
      { phase: '公開・引き継ぎ', status: 'これから', progress: 0, tone: 'planned' },
    ],
    minutes: [
      ['要件確認', '依頼者ごとに、これまでの依頼と進捗を追えるようにする。'],
      ['画面設計', 'トップ画面に進行中の依頼と今週の予定を表示する。'],
      ['記録方法', '仕様変更や相談内容を、日付と案件に紐づけて残す。'],
    ],
    deliverables: [
      ['依頼管理ダッシュボード', '進行中の依頼と今週の予定を一覧できる画面'],
      ['依頼詳細ページ', '仕様・スケジュール・議事録をまとめた案件ページ'],
      ['成果物ギャラリー', '公開サイトや制作画像を保存・表示する画面'],
      ['どうぶつ管理画面', '住民プロフィールと依頼履歴を管理する画面'],
    ],
  },
  friends: {
    client: '仲良しトリオ',
    priority: '高',
    brief: 'ぼくたち3人の夢を叶えるサイトを一緒に作ってほしい！エンジニア、アイドル、クリエイターとして、それぞれの活動や作品を自分らしく発信できる場所がほしいな。',
    overview: [
      ['目的', '3人それぞれの夢や活動を個別のサイトで発信する'],
      ['利用者', 'エンジニア、アイドル、クリエイターと訪問者'],
      ['優先事項', '活動ごとの個性と、更新しやすさを両立する'],
    ],
    sites: [
      {
        owner: 'いぬ',
        role: 'エンジニア',
        title: 'ポートフォリオサイト',
        summary: 'プロフィール、スキル、制作実績、技術ブログをまとめて紹介。',
        tone: 'engineer',
        species: 'dog',
        costume: 'engineer',
      },
      {
        owner: 'うさぎ',
        role: 'アイドル',
        title: 'アイドル活動サイト',
        summary: 'プロフィール、お知らせ、ライブ予定、写真や動画を発信。',
        tone: 'idol',
        species: 'rabbit',
        costume: 'idol',
      },
      {
        owner: 'ねこ',
        role: 'クリエイター',
        title: '作品ギャラリーサイト',
        summary: 'イラスト、漫画、動画、小説などの作品を展示。',
        tone: 'creator',
        species: 'cat',
        costume: 'creator',
      },
    ],
    requirements: [
      ['エンジニアのポートフォリオ', 'プロフィール、スキル、制作実績、技術ブログ、問い合わせ先を掲載する'],
      ['うさぎのアイドル活動', 'アイドルプロフィール、お知らせ、ライブ・イベント予定を発信する'],
      ['写真・動画ギャラリー', 'アイドル活動の写真や動画を見やすく紹介する'],
      ['クリエイターの作品展示', 'イラスト、漫画、動画、小説を種類ごとに掲載する'],
      ['作品の詳細ページ', '制作背景や使用技術、作品ごとの説明を読めるようにする'],
      ['共通デザイン', '3人の個性を出しつつ、操作や更新方法を統一する'],
      ['スマートフォン対応', 'スマートフォンからも作品や予定を確認できる'],
    ],
    schedule: [
      { phase: '3人の希望・掲載内容を整理', status: '未着手', progress: 0, tone: 'planned' },
      { phase: '仕様書とページ構成を作成', status: '未着手', progress: 0, tone: 'planned' },
      { phase: 'デザイン案を確認・調整', status: '未着手', progress: 0, tone: 'planned' },
      { phase: '3つのサイトを制作', status: '未着手', progress: 0, tone: 'planned' },
      { phase: '動作確認・公開', status: '未着手', progress: 0, tone: 'planned' },
    ],
    minutes: [
      ['依頼受付', '3人それぞれの夢や活動を、別々の個人サイトで実現したい。'],
      ['うさぎのサイトについて', 'アイドルとしてのプロフィールや活動予定、お知らせを中心に発信する。'],
      ['共通方針', 'サイトごとの色や見せ方は個別にしつつ、スマートフォンでも使いやすくする。'],
    ],
    deliverables: [
      ['エンジニア系サイト', 'スキル・制作実績・技術ブログを掲載するポートフォリオ'],
      ['アイドル活動サイト', 'プロフィール・お知らせ・ライブ予定・写真や動画の紹介ページ'],
      ['クリエイター系サイト', 'イラスト・漫画・動画・小説を展示するギャラリー'],
      ['共通の公開・更新ガイド', '各サイトの更新方法と公開後の運用手順'],
    ],
  },
};

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

const tracksForMode = (mode) => (mode === 'nature' ? NATURE_TRACKS : MUSIC_TRACKS);

export default function App() {
  const [selectedResident, setSelectedResident] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [bgmEnabled, setBgmEnabled] = useState(false);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [currentTrack, setCurrentTrack] = useState('');
  const [audioMode, setAudioMode] = useState(() => {
    try {
      return window.localStorage.getItem(AUDIO_MODE_KEY) === 'nature' ? 'nature' : 'bgm';
    } catch (error) {
      return 'bgm';
    }
  });
  const [requestInboxOpen, setRequestInboxOpen] = useState(false);
  const [requestFilter, setRequestFilter] = useState('all');
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [requestDetailTab, setRequestDetailTab] = useState('overview');
  const audioRef = useRef(null);
  const audioModeRef = useRef(audioMode);
  const queueRef = useRef({ bgm: [], nature: [] });
  const currentTrackRef = useRef('');
  const currentModeRef = useRef(audioMode);

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

  const pickNextTrack = useCallback((mode = audioModeRef.current, previousTrack = '') => {
    const tracks = tracksForMode(mode);
    if (!tracks.length) {
      return null;
    }

    if (tracks.length === 1) {
      return tracks[0];
    }

    const remaining = queueRef.current[mode].length
      ? [...queueRef.current[mode]]
      : shuffle(tracks.filter((track) => track !== previousTrack));
    const nextTrack = remaining[0] || shuffle(tracks.filter((track) => track !== previousTrack))[0] || tracks[0];
    queueRef.current[mode] = remaining.filter((track) => track !== nextTrack);
    return nextTrack;
  }, []);

  const playTrack = useCallback(async (trackName, autoplay = false, mode = audioModeRef.current) => {
    const audio = ensureAudio();
    const safeName = trackName || pickNextTrack(mode);
    const tracks = tracksForMode(mode);

    if (!safeName) {
      setCurrentTrack('');
      currentTrackRef.current = '';
      audio.pause();
      return;
    }

    const audioFolder = mode === 'nature' ? 'audio/soundEffects' : 'audio';
    const normalizedName = safeName.normalize('NFC');
    const url = `/${audioFolder}/${encodeURIComponent(normalizedName)}`;
    audio.src = url;
    audio.loop = tracks.length <= 1;
    audio.volume = 0.02;
    currentTrackRef.current = safeName;
    currentModeRef.current = mode;
    setCurrentTrack(normalizedName);

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
      console.warn('Audio playback was blocked by the browser.', error);
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
    const nextTrack = pickNextTrack(audioMode, currentTrackRef.current);
    if (!nextTrack) {
      return;
    }

    await playTrack(nextTrack, bgmEnabled, audioMode);
  }, [audioMode, bgmEnabled, pickNextTrack, playTrack]);

  const unlockAudio = useCallback(async () => {
    if (!tracksForMode(audioMode).length) {
      return;
    }

    const audio = ensureAudio();

    if (!currentTrackRef.current) {
      const selected = pickNextTrack(audioMode);
      if (!selected) {
        return;
      }
      await playTrack(selected, true, audioMode);
      setBgmEnabled(true);
      return;
    }

    try {
      await audio.play();
      setBgmEnabled(true);
    } catch (error) {
      console.warn('Audio autoplay was blocked by the browser.', error);
      setBgmEnabled(false);
    }
  }, [audioMode, ensureAudio, pickNextTrack, playTrack]);

  const toggleBgm = useCallback(async () => {
    if (!tracksForMode(audioMode).length) {
      return;
    }

    const audio = ensureAudio();

    if (bgmEnabled) {
      audio.pause();
      setBgmEnabled(false);
      return;
    }

    if (!currentTrackRef.current) {
      const selected = pickNextTrack(audioMode);
      if (!selected) {
        return;
      }
      await playTrack(selected, true, audioMode);
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
  }, [audioMode, bgmEnabled, ensureAudio, pickNextTrack, playTrack]);

  const changeAudioMode = useCallback(async (nextMode) => {
    if (nextMode === audioMode) {
      return;
    }

    audioModeRef.current = nextMode;
    setAudioMode(nextMode);
    queueRef.current[nextMode] = [];
    currentTrackRef.current = '';
    setCurrentTrack('');

    if (!bgmEnabled) {
      audioRef.current?.pause();
      currentModeRef.current = nextMode;
      return;
    }

    const selected = pickNextTrack(nextMode);
    if (selected) {
      await playTrack(selected, true, nextMode);
    } else {
      audioRef.current?.pause();
      setBgmEnabled(false);
    }
  }, [audioMode, bgmEnabled, pickNextTrack, playTrack]);

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
      window.localStorage.setItem(AUDIO_MODE_KEY, audioMode);
    } catch (error) {
      console.warn('Failed to persist audio mode.', error);
    }
  }, [audioMode]);

  useEffect(() => {
    try {
      window.localStorage.setItem(ENABLED_KEY, String(bgmEnabled));
    } catch (error) {
      console.warn('Failed to persist BGM enabled state.', error);
    }
  }, [bgmEnabled]);

  useEffect(() => {
    const tracks = tracksForMode(audioMode);
    if (!tracks.length) {
      return undefined;
    }

    const audio = ensureAudio();
    if (!audio) {
      return undefined;
    }

    audio.onended = async () => {
      if (!bgmEnabled) {
        return;
      }

      if (tracks.length <= 1) {
        audio.currentTime = 0;
        try {
          await audio.play();
        } catch (error) {
          console.warn('Failed to loop the last audio track.', error);
        }
        return;
      }

      const nextTrack = pickNextTrack(audioMode, currentTrackRef.current);
      if (nextTrack) {
        await playTrack(nextTrack, true, audioMode);
      }
    };

    return () => {
      audio.onended = null;
    };
  }, [audioMode, bgmEnabled, ensureAudio, pickNextTrack, playTrack]);

  useEffect(() => {
    if (!tracksForMode(audioMode).length) {
      return;
    }

    if (bgmEnabled && !currentTrackRef.current) {
      const selected = pickNextTrack(audioMode);
      if (selected) {
        playTrack(selected, true, audioMode).catch(() => setBgmEnabled(false));
      }
    }

    if (!bgmEnabled && audioRef.current) {
      audioRef.current.pause();
    }
  }, [audioMode, bgmEnabled, pickNextTrack, playTrack]);

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
        if (selectedRequestId) {
          setSelectedRequestId(null);
        } else {
          setRequestInboxOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [requestInboxOpen, selectedRequestId]);

  const hasTracks = tracksForMode(audioMode).length > 0;
  const audioModeLabel = audioMode === 'nature' ? '自然音' : 'BGM';
  const visibleRequests = REQUESTS.filter((request) => requestFilter === 'all' || request.type === requestFilter);
  const selectedRequest = REQUESTS.find((request) => request.id === selectedRequestId);
  const selectedRequestDetails = selectedRequest ? REQUEST_DETAILS[selectedRequest.id] : null;
  const detailTabs = selectedRequestId === 'site-creator' ? SITE_CREATOR_DETAIL_TABS : REQUEST_DETAIL_TABS;

  const closeRequestInbox = () => {
    setRequestInboxOpen(false);
    setSelectedRequestId(null);
  };

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
        <div
          className="audio-mode-switch"
          role="group"
          aria-label="再生する音を選択"
          onPointerDown={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className={audioMode === 'bgm' ? 'audio-mode-option is-active' : 'audio-mode-option'}
            aria-pressed={audioMode === 'bgm'}
            onClick={() => changeAudioMode('bgm')}
          >
            BGM
          </button>
          <button
            type="button"
            className={audioMode === 'nature' ? 'audio-mode-option is-active' : 'audio-mode-option'}
            aria-pressed={audioMode === 'nature'}
            onClick={() => changeAudioMode('nature')}
          >
            自然音
          </button>
        </div>

        <button
          type="button"
          className="bgm-toggle"
          aria-label={bgmEnabled ? `${audioModeLabel}を停止` : `${audioModeLabel}を再生`}
          onClick={toggleBgm}
          disabled={!hasTracks}
        >
          {audioMode === 'nature' ? '≋' : bgmEnabled ? '♫' : '♪'}
        </button>

        <div className="bgm-panel">
          <div className="bgm-meta">{currentTrack || (hasTracks ? `${audioModeLabel}を再生` : '音源なし')}</div>

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
              closeRequestInbox();
            }
          }}
        >
          <section className="request-dialog" role="dialog" aria-modal="true" aria-labelledby="request-title">
            <header className="request-dialog-header">
              <div>
                <span className="request-eyebrow">{selectedRequest ? 'REQUEST DETAIL' : 'MORI POST'}</span>
                <h2 id="request-title">{selectedRequest ? '依頼の詳細' : '届いた依頼'}</h2>
                <p>{selectedRequest ? selectedRequest.requester : '森のみんなから届いた依頼を確認しよう'}</p>
              </div>
              <button
                type="button"
                className="close-button request-close"
                aria-label="依頼一覧を閉じる"
                onClick={closeRequestInbox}
              >
                ×
              </button>
            </header>

            {selectedRequest ? (
              <div className="request-detail-view">
                <button type="button" className="request-back" onClick={() => setSelectedRequestId(null)}>
                  ‹ 依頼一覧へ戻る
                </button>
                <div className="request-project-heading">
                  <div className={`request-avatar avatar-${selectedRequest.type}`} aria-hidden="true">
                    {selectedRequest.avatar}
                  </div>
                  <div className="request-project-copy">
                    <div className="request-card-meta">
                      <span>{selectedRequest.requester}</span>
                      <span className={selectedRequest.status === '進行中' ? 'request-status is-progress' : 'request-status'}>
                        {selectedRequest.status}
                      </span>
                    </div>
                    <h3>{selectedRequest.title}</h3>
                    <p>{selectedRequestDetails.brief}</p>
                  </div>
                </div>

                <div className="request-tabs request-detail-tabs" role="tablist" aria-label="依頼の詳細情報">
                  {detailTabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={requestDetailTab === tab.id}
                      className={requestDetailTab === tab.id ? 'request-tab is-active' : 'request-tab'}
                      onClick={() => setRequestDetailTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="request-detail-content">
                  {requestDetailTab === 'overview' && (
                    <div className="request-overview-grid">
                      <section className="request-detail-panel">
                        <h4>依頼の概要</h4>
                        <p>{selectedRequestDetails.brief}</p>
                        <dl className="request-facts">
                          <div><dt>依頼者</dt><dd>{selectedRequestDetails.client}</dd></div>
                          <div><dt>優先度</dt><dd>{selectedRequestDetails.priority}</dd></div>
                          <div><dt>ステータス</dt><dd>{selectedRequest.status}</dd></div>
                        </dl>
                      </section>
                      <section className="request-detail-panel">
                        <h4>今回の実装範囲</h4>
                        <ul className="request-checklist">
                          {selectedRequestDetails.requirements.map(([title]) => (
                            <li key={title}><span aria-hidden="true">✓</span>{title}</li>
                          ))}
                        </ul>
                      </section>
                    </div>
                  )}
                  {requestDetailTab === 'overview' && selectedRequestDetails.sites && (
                    <section className="request-detail-panel request-member-panel">
                      <div className="request-section-heading">
                        <div><span className="request-eyebrow">THREE INDIVIDUAL SITES</span><h4>3人それぞれのサイト</h4></div>
                        <span className="request-schedule-note">個性に合わせて制作</span>
                      </div>
                      <div className="request-member-sites">
                        {selectedRequestDetails.sites.map((site, index) => (
                          <article className={`request-member-site member-${site.tone}`} key={site.tone}>
                            <div className="request-member-site-topline">
                              <span className="request-member-number">0{index + 1}</span>
                              <span className="request-member-role">{site.role}</span>
                            </div>
                            <MascotPortrait species={site.species} costume={site.costume} className="request-member-portrait" />
                            <span className="request-member-owner">{site.owner}の依頼</span>
                            <strong>{site.title}</strong>
                            <p>{site.summary}</p>
                          </article>
                        ))}
                      </div>
                    </section>
                  )}

                  {requestDetailTab === 'specification' && (selectedRequestDetails.requestExamples ? (
                    <section className="request-detail-panel request-type-panel">
                      <div className="request-section-heading">
                        <div><span className="request-eyebrow">REQUEST EXAMPLES</span><h4>このサイトに届く依頼の例</h4></div>
                        <span className="request-schedule-note">目的に合わせて制作を進行</span>
                      </div>
                      <p className="request-examples-intro">依頼の内容に合わせて要件を整理し、制作から公開後の運用までを管理するサイトです。</p>
                      <div className="request-type-grid">
                        {selectedRequestDetails.requestExamples.map((type, index) => (
                          <article className={`request-type-card type-${type.tone}`} key={type.id}>
                            <div className="request-type-heading">
                              <span className="request-type-number">{index + 1}</span>
                              <div><h5>{type.title}</h5><span>{type.subtitle}</span></div>
                            </div>
                            <MascotPortrait species={type.species} costume={type.costume} className="request-type-portrait" />
                            <p className="request-type-description">{type.description}</p>
                            <div className="request-type-subheading">進め方</div>
                            <ol className="request-type-steps">
                              {type.steps.map((step) => <li key={step}>{step}</li>)}
                            </ol>
                            <div className="request-type-subheading">こんな時に使う</div>
                            <ul className="request-type-use-cases">
                              {type.useCases.map((useCase) => <li key={useCase}>{useCase}</li>)}
                            </ul>
                            <span className="request-type-maintenance">{type.maintenance}</span>
                          </article>
                        ))}
                      </div>
                    </section>
                  ) : (
                    <section className="request-detail-panel request-spec-panel">
                      <div className="request-section-heading">
                        <div><span className="request-eyebrow">PROJECT SPEC</span><h4>機能・受け入れ条件</h4></div>
                        <span className="request-status is-progress">仕様確認中</span>
                      </div>
                      {selectedRequestDetails.requirements.map(([title, description], index) => (
                        <div className="request-spec-row" key={title}>
                          <span className="request-spec-number">{String(index + 1).padStart(2, '0')}</span>
                          <div><strong>{title}</strong><p>{description}</p></div>
                        </div>
                      ))}
                    </section>
                  ))}

                  {requestDetailTab === 'maintenance' && selectedRequestDetails.maintenance && (
                    <section className="request-detail-panel request-maintenance-panel">
                      <div className="request-section-heading">
                        <div><span className="request-eyebrow">MAINTENANCE PLAN</span><h4>保守の仕組み</h4></div>
                        <span className="request-schedule-note">依頼ごとに選択</span>
                      </div>
                      <div className="request-maintenance-modes">
                        {selectedRequestDetails.maintenance.modes.map((mode) => (
                          <article className={`request-maintenance-mode maintenance-${mode.tone}`} key={mode.id}>
                            <h5>{mode.title}</h5>
                            <p>{mode.summary}</p>
                            <ul>{mode.useCases.map((useCase) => <li key={useCase}>{useCase}</li>)}</ul>
                          </article>
                        ))}
                      </div>
                      <div className="request-section-heading request-maintenance-flow-heading">
                        <div><span className="request-eyebrow">WHEN A NEW REQUEST ARRIVES</span><h4>保守ありの場合の流れ</h4></div>
                      </div>
                      <ol className="request-maintenance-flow">
                        {selectedRequestDetails.maintenance.flow.map((step, index) => (
                          <li key={step}><span>{index + 1}</span>{step}</li>
                        ))}
                      </ol>
                    </section>
                  )}

                  {requestDetailTab === 'schedule' && (
                    <section className="request-detail-panel request-schedule-panel">
                      <div className="request-section-heading">
                        <div><span className="request-eyebrow">PROJECT PLAN</span><h4>制作スケジュール</h4></div>
                        <span className="request-schedule-note">工程ごとの進捗</span>
                      </div>
                      {selectedRequestDetails.schedule.map((item) => (
                        <div className="request-schedule-row" key={item.phase}>
                          <span className="request-schedule-phase">{item.phase}</span>
                          <div className="request-schedule-track">
                            <span className={`request-schedule-bar ${item.tone}`} style={{ width: `${Math.max(item.progress, 4)}%` }} />
                          </div>
                          <span className="request-schedule-status">{item.status}</span>
                        </div>
                      ))}
                    </section>
                  )}

                  {requestDetailTab === 'minutes' && (
                    <section className="request-detail-panel request-minutes-panel">
                      <div className="request-section-heading">
                        <div><span className="request-eyebrow">MEETING NOTES</span><h4>相談・議事録</h4></div>
                        <span className="request-schedule-note">記録 {selectedRequestDetails.minutes.length} 件</span>
                      </div>
                      {selectedRequestDetails.minutes.map(([heading, body], index) => (
                        <article className="request-minute" key={heading}>
                          <span className="request-minute-index">0{index + 1}</span>
                          <div><strong>{heading}</strong><p>{body}</p></div>
                        </article>
                      ))}
                    </section>
                  )}

                  {requestDetailTab === 'deliverables' && (
                    <section className="request-detail-panel">
                      <div className="request-section-heading">
                        <div><span className="request-eyebrow">DELIVERABLES</span><h4>成果物・公開先</h4></div>
                        <span className="request-schedule-note">予定 {selectedRequestDetails.deliverables.length} 件</span>
                      </div>
                      <div className="request-deliverables-grid">
                        {selectedRequestDetails.deliverables.map(([title, description], index) => (
                          <article className="request-deliverable" key={title}>
                            <span className={`request-deliverable-icon deliverable-tone-${index % 4}`} aria-hidden="true">
                              {['▤', '▧', '▥', '▣'][index % 4]}
                            </span>
                            <strong>{title}</strong>
                            <p>{description}</p>
                            <span className="request-status">準備中</span>
                          </article>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            ) : (
              <>
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
                      {filter.id === 'all' && <span className="request-tab-count">{REQUESTS.length}</span>}
                    </button>
                  ))}
                </div>

                <div className="request-list">
                  {visibleRequests.map((request) => (
                    <button
                      className="request-card"
                      key={request.id}
                      type="button"
                      onClick={() => {
                        setSelectedRequestId(request.id);
                        setRequestDetailTab('overview');
                      }}
                    >
                      <span className={`request-avatar avatar-${request.type}`} aria-hidden="true">
                        {request.avatar}
                      </span>
                      <span className="request-card-content">
                        <span className="request-card-meta">
                          <span>{request.requester}</span>
                          <span className={request.status === '進行中' ? 'request-status is-progress' : 'request-status'}>
                            {request.status}
                          </span>
                        </span>
                        <span className="request-card-title">{request.title}</span>
                        <span className="request-card-description">{request.description}</span>
                      </span>
                      <span className="request-card-arrow" aria-hidden="true">›</span>
                    </button>
                  ))}
                  {visibleRequests.length === 0 && <p className="request-empty">この送り主からの依頼はありません。</p>}
                </div>
                <footer className="request-dialog-footer">依頼は全部で {REQUESTS.length} 件です</footer>
              </>
            )}
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
