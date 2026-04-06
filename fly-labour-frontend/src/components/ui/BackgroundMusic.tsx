import { useState, useEffect, useRef, useCallback } from 'react'
import { Volume2, VolumeX, Music, SkipForward } from 'lucide-react'

const PLAYLIST = [
  { src: '/music/background.mp3',              name: 'Fly Labour' },
  { src: '/music/Chuyến Bay Ước Mơ.mp3',       name: 'Chuyến Bay Ước Mơ' },
  { src: '/music/Du Lịch.mp3',                 name: 'Du Lịch' },
  { src: '/music/Fly Visa ( pass 2 ).mp3',     name: 'Fly Visa' },
  { src: '/music/Viet Nam - Hello World.mp3',  name: 'Việt Nam - Hello World' },
]

function shuffledIndices(current: number, total: number): number[] {
  const others = Array.from({ length: total }, (_, i) => i).filter(i => i !== current)
  for (let i = others.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [others[i], others[j]] = [others[j], others[i]]
  }
  return [current, ...others]
}

interface Props {
  autoPlay?: boolean
}

export default function BackgroundMusic({ autoPlay = true }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.3)
  const [showVolume, setShowVolume] = useState(false)
  const [started, setStarted] = useState(false)
  const [trackIndex, setTrackIndex] = useState(() => Math.floor(Math.random() * PLAYLIST.length))
  const queueRef = useRef<number[]>(shuffledIndices(trackIndex, PLAYLIST.length))
  const queuePosRef = useRef(0)
  const volumeRef = useRef<HTMLDivElement>(null)

  const currentTrack = PLAYLIST[trackIndex]

  const playNext = useCallback(() => {
    queuePosRef.current = (queuePosRef.current + 1) % PLAYLIST.length
    if (queuePosRef.current === 0) {
      const next = Math.floor(Math.random() * PLAYLIST.length)
      queueRef.current = shuffledIndices(next, PLAYLIST.length)
    }
    setTrackIndex(queueRef.current[queuePosRef.current])
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.src = currentTrack.src
    audio.load()
    if (playing) {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }
  }, [trackIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  useEffect(() => {
    if (!autoPlay) return
    const handle = () => {
      if (!started) {
        setStarted(true)
        audioRef.current?.play().then(() => setPlaying(true)).catch(() => {})
        document.removeEventListener('click', handle)
        document.removeEventListener('keydown', handle)
        document.removeEventListener('scroll', handle)
      }
    }
    document.addEventListener('click', handle)
    document.addEventListener('keydown', handle)
    document.addEventListener('scroll', handle)
    return () => {
      document.removeEventListener('click', handle)
      document.removeEventListener('keydown', handle)
      document.removeEventListener('scroll', handle)
    }
  }, [autoPlay, started])

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (volumeRef.current && !volumeRef.current.contains(e.target as Node)) {
        setShowVolume(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {})
    }
    setStarted(true)
  }

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation()
    playNext()
    setStarted(true)
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={playNext}
      />

      <div className="fixed bottom-8 left-5 z-40 flex flex-col items-start gap-2">

        {/* Volume slider */}
        {showVolume && (
          <div ref={volumeRef}
            className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-[#1a1a19] dark:to-[#262624] border border-amber-300 dark:border-amber-700/50 rounded-2xl px-4 py-3 shadow-xl shadow-amber-200/50 dark:shadow-black/50 animate-fade-up">
            <p className="text-xs text-amber-700 dark:text-amber-400 mb-2 text-center font-semibold">Âm lượng</p>
            <div className="flex items-center gap-2">
              <VolumeX size={12} className="text-amber-500" />
              <input
                type="range" min="0" max="1" step="0.05"
                value={volume}
                onChange={e => setVolume(parseFloat(e.target.value))}
                className="w-24 accent-amber-500 cursor-pointer"
              />
              <Volume2 size={12} className="text-amber-600" />
            </div>
            <p className="text-center text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium">{Math.round(volume * 100)}%</p>
          </div>
        )}

        {/* Tên bài khi đang phát */}
        {playing && (
          <div className="bg-gradient-to-r from-amber-400 to-yellow-300 rounded-xl px-3 py-1.5 shadow-md shadow-amber-300/40 max-w-[180px]">
            <p className="text-[10px] text-amber-900 font-semibold truncate">{currentTrack.name}</p>
          </div>
        )}

        {/* Main controls */}
        <div className="flex items-center gap-2">
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="flex items-center gap-2 rounded-2xl px-3 py-2 transition-all duration-200 shadow-lg shadow-amber-300/40 dark:shadow-amber-900/30 border border-amber-400 dark:border-amber-600/60"
            style={{ background: 'linear-gradient(135deg, #e4a808 0%, #fdd52f 60%, #f2ee8c 100%)' }}
            title={playing ? 'Tắt nhạc' : 'Bật nhạc'}
          >
            {playing ? (
              <div className="flex items-end gap-0.5 h-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i}
                    className="w-0.5 bg-amber-900 rounded-full"
                    style={{
                      height: `${Math.random() * 60 + 40}%`,
                      animation: `musicBar 0.${4 + i}s ease-in-out infinite alternate`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            ) : (
              <Music size={14} className="text-amber-900" />
            )}
            <span className="text-xs text-amber-900 font-semibold">
              {playing ? 'Đang phát' : 'Nhạc nền'}
            </span>
          </button>

          {/* Skip */}
          <button
            onClick={handleSkip}
            className="w-8 h-8 rounded-xl border border-amber-400 dark:border-amber-600/60 flex items-center justify-center text-amber-700 dark:text-amber-400 hover:text-amber-900 transition-colors shadow-md"
            style={{ background: 'linear-gradient(135deg, #fdd52f 0%, #e4a808 100%)' }}
            title="Bài kế tiếp"
          >
            <SkipForward size={13} className="text-amber-900" />
          </button>

          {/* Volume */}
          <button
            onClick={() => setShowVolume(s => !s)}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-md ${
              showVolume
                ? 'border-amber-500 shadow-amber-300/50'
                : 'border-amber-400 dark:border-amber-600/60'
            }`}
            style={{ background: showVolume
              ? 'linear-gradient(135deg, #e4a808, #fdd52f)'
              : 'linear-gradient(135deg, #fdd52f 0%, #e4a808 100%)'
            }}
            title="Âm lượng"
          >
            {volume === 0
              ? <VolumeX size={13} className="text-amber-900" />
              : <Volume2 size={13} className="text-amber-900" />
            }
          </button>
        </div>

        {/* Hint lần đầu */}
        {!started && autoPlay && (
          <p className="text-[10px] text-amber-600 dark:text-amber-400 ml-1 animate-pulse font-medium">
            Click bất kỳ để phát nhạc
          </p>
        )}
      </div>

      <style>{`
        @keyframes musicBar {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </>
  )
}
