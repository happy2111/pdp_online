'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import 'videojs-contrib-quality-levels'
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  Gauge, RotateCcw, RotateCw, Loader2, Settings
} from 'lucide-react'
import {ProgressService} from "@/services/lesson-progress-service";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2]

function formatTime(seconds: number) {
  if (isNaN(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

interface QualityLevel {
  index: number
  label: string
  height: number
  enabled: boolean
}

type MenuType = 'speed' | 'quality' | null

export const VideoPlayer = ({ slug, endpoint, lessonId, poster}: { slug: string | null; endpoint: string | null, lessonId: number | null, poster: string | undefined }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<any>(null)
  const progressRef = useRef<HTMLDivElement | null>(null)
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [fullscreen, setFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [waiting, setWaiting] = useState(false)
  const [openMenu, setOpenMenu] = useState<MenuType>(null)
  const [qualities, setQualities] = useState<QualityLevel[]>([])
  const [activeQuality, setActiveQuality] = useState<number | 'auto'>('auto')

  const resetHideTimer = useCallback(() => {
    setShowControls(true)
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current)
    hideControlsTimer.current = setTimeout(() => {
      setShowControls(false)
      setOpenMenu(null)
    }, 3000)
  }, [])

  useEffect(() => {
    if (!endpoint || !containerRef.current) return
    if (playerRef.current && !playerRef.current.isDisposed()) return

    const videoEl = document.createElement('video')
    videoEl.className = 'video-js'

    videoEl.setAttribute('playsinline', 'true');
    videoEl.setAttribute('webkit-playsinline', 'true');
    videoEl.setAttribute('preload', 'auto');

    containerRef.current.innerHTML = ''
    containerRef.current.appendChild(videoEl)

    const authStorage = localStorage.getItem('auth-storage')
    let token: string | null = null
    if (authStorage) {
      try { token = JSON.parse(authStorage)?.state?.user?.token } catch {}
    }

    const VHS = (videojs as any).Vhs || (videojs as any).Hls
    if (VHS) {
      VHS.xhr.beforeRequest = (options: any) => {
        options.withCredentials = true
        return options
      }

      VHS.xhr.onResponse = (request: any, error: any, response: any) => {
        console.log('VHS response:', response)
        if (response?.status === 401) {
          console.log('401 Unauthorized')
          const currentUrl = window.location.pathname + window.location.search;

          console.log('Current URL:', currentUrl);
          console.log(encodeURIComponent(currentUrl))
          window.location.href = `/login?redirect=${encodeURIComponent(currentUrl)}`;
        }
      }
    }

    const stopHeartbeat = () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current)
        heartbeatIntervalRef.current = null
      }
    }

    const sendHeartbeat = () => {
      const currentTime = player.currentTime()
      if (currentTime && lessonId) {
        ProgressService.sendHeartbeat({
          lesson_id: lessonId,
          seconds: currentTime
        })
      }
    }

    const player = videojs(videoEl, {
      controls: false,
      fluid: true,
      poster: poster,
      html5: {
        vhs: {
          overrideNative: !videojs.browser.IS_ANY_SAFARI && !videojs.browser.IS_ANDROID,
        },
        nativeAudioTracks: false,
        nativeVideoTracks: false,
      },
      sources: [{
        src: `${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`,
        type: 'application/x-mpegURL'
      }],
    })


    player.ready(async () => {
      if (lessonId) {
        try {
          const response = await ProgressService.getLessonProgress(lessonId)
          if (response.data && response.data > 0) {
            player.currentTime(response.data)
          }
        } catch (error) {
          console.error('Failed to fetch video progress:', error)
        }
      }
    })

    player.on('error', () => {
      const err = player.error()
      console.log('VIDEO ERROR:', err)

      // @ts-ignore
      if (err?.status === 401) {
        console.log('401 detected через player.error')

        const currentUrl = window.location.pathname + window.location.search;
        console.log('Current URL:', currentUrl);
        console.log(encodeURIComponent(currentUrl))

        window.location.href = `/login?redirect=${encodeURIComponent(currentUrl)}`;

      }
    })

    player.on('play', () => {
      setPlaying(true)

      if (lessonId) {
        if (!heartbeatIntervalRef.current) {
          heartbeatIntervalRef.current = setInterval(() => {
            const currentTime = player.currentTime()
            if (currentTime && currentTime > 0) {
              ProgressService.sendHeartbeat({
                lesson_id: lessonId,
                seconds: currentTime
              }).catch(err => console.error('Heartbeat error:', err))
            }
          }, 15000)
        }
      }

    })



    player.on('pause', () => {
      setPlaying(false)
      if (lessonId) {
        stopHeartbeat()
        sendHeartbeat()
      }
    })

    player.on('ended', () => {
      if (lessonId) {
        stopHeartbeat()
        sendHeartbeat()
      }
    })
    player.on('waiting',        () => setWaiting(true))
    player.on('canplay',        () => setWaiting(false))
    player.on('playing',        () => setWaiting(false))
    player.on('loadedmetadata', () => {
      const d = player.duration()
      if (d && isFinite(d)) {
        setDuration(d)
      }
    })
    player.on('timeupdate', () => {
      setCurrentTime(player.currentTime() ?? 0)
      setBuffered(player.bufferedEnd?.() ?? 0)
    })

    // Загружаем уровни качества после инициализации
    player.ready(() => {
      const ql = (player as any).qualityLevels?.()
      if (!ql) return

      const buildLevels = () => {
        const levels: QualityLevel[] = []
        for (let i = 0; i < ql.length; i++) {
          const lvl = ql[i]
          if (lvl.height) {
            levels.push({
              index: i,
              label: `${lvl.height}p`,
              height: lvl.height,
              enabled: lvl.enabled,
            })
          }
        }
        // Убираем дубли по высоте, сортируем по убыванию
        const unique = Array.from(
          new Map(levels.map(l => [l.height, l])).values()
        ).sort((a, b) => b.height - a.height)
        setQualities(unique)
      }

      ql.on('addqualitylevel', buildLevels)
      ql.on('change', buildLevels)
    })

    playerRef.current = player

    const onFsChange = () => setFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFsChange)

    return () => {
      document.removeEventListener('fullscreenchange', onFsChange)
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose()
        playerRef.current = null
      }
    }
  }, [slug, endpoint, lessonId])

  useEffect(() => { playerRef.current?.playbackRate(speed) }, [speed])
  useEffect(() => {
    playerRef.current?.volume(volume)
    playerRef.current?.muted(muted)
  }, [volume, muted])

  const applyQuality = (selected: number | 'auto') => {
    const ql = (playerRef.current as any)?.qualityLevels?.()
    if (!ql) return
    for (let i = 0; i < ql.length; i++) {
      if (selected === 'auto') {
        ql[i].enabled = true
      } else {
        ql[i].enabled = (ql[i].height === selected)
      }
    }
    setActiveQuality(selected)
    setOpenMenu(null)
  }

  const togglePlay = () => {
    const p = playerRef.current
    if (!p) return
    p.paused() ? p.play() : p.pause()
    resetHideTimer()
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = progressRef.current!.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    playerRef.current?.currentTime(ratio * duration)
  }

  const toggleMute = () => setMuted(m => !m)

  const toggleFullscreen = () => {
    if (!wrapperRef.current) return
    if (!document.fullscreenElement) {
      wrapperRef.current.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const skipBy = (sec: number) => {
    const p = playerRef.current
    if (!p) return
    p.currentTime(Math.max(0, Math.min(duration, p.currentTime() + sec)))
    resetHideTimer()
  }

  const toggleMenu = (menu: MenuType) => {
    setOpenMenu(prev => prev === menu ? null : menu)
  }

  const progress = duration ? (currentTime / duration) * 100 : 0
  const bufferedPct = duration ? (buffered / duration) * 100 : 0

  const qualityLabel = activeQuality === 'auto'
    ? 'Авто'
    : `${activeQuality}p`

  if (!endpoint) {
    return (
      <div className="aspect-video bg-muted rounded-2xl flex items-center justify-center">
        <span className="text-muted-foreground text-sm">Загрузка видео...</span>
      </div>
    )
  }

  return (
    <div
      ref={wrapperRef}
      className="@container/video relative w-full aspect-video bg-black rounded-2xl overflow-hidden select-none"
      onMouseMove={resetHideTimer}
      onMouseLeave={() => { setShowControls(false); setOpenMenu(null) }}
      onClick={togglePlay}
    >
      {/* video.js контейнер */}
      <div
        ref={containerRef}
        className="w-full flex items-center h-full pointer-events-none [&_.video-js]:w-full [&_.video-js]:h-full"
      />

      {/* Спиннер */}
      {waiting && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Loader2 className="w-12 h-12 text-white/80 animate-spin" />
        </div>
      )}

      {/* Центральная кнопка play */}
      {!playing && !waiting && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <Play className="w-7 h-7 text-white fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Контролы */}
      <div
        className={`absolute bottom-0 left-0 right-0 px-4 pb-3 pt-12 transition-opacity duration-300
          bg-gradient-to-t from-black/80 via-black/20 to-transparent
          ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Прогресс-бар */}
        <div
          ref={progressRef}
          className="relative h-1 rounded-full bg-white/20 cursor-pointer mb-3 group/progress
            hover:h-[5px] transition-all duration-150"
          onClick={seek}
        >
          <div
            className="absolute top-0 left-0 h-full rounded-full bg-white/30"
            style={{ width: `${bufferedPct}%` }}
          />
          <div
            className="absolute top-0 left-0 h-full rounded-full bg-primary"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow
              opacity-0 group-hover/progress:opacity-100 transition-opacity"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>

        {/* Панель кнопок */}
        <div className="flex items-center gap-3">

          {/* Кнопка назад */}
          <button
            onClick={() => skipBy(-10)}
            className="text-white/80 hover:text-white transition-all active:scale-90 active:text-white p-1"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Кнопка Play/Pause */}
          <button
            onClick={togglePlay}
            className="text-white hover:text-white/80 transition-all active:scale-90 p-1"
          >
            {playing
              ? <Pause className="w-6 h-6 fill-white" />
              : <Play className="w-6 h-6 fill-white ml-0.5" />
            }
          </button>

          {/* Кнопка вперед */}
          <button
            onClick={() => skipBy(10)}
            className="text-white/80 hover:text-white transition-all active:scale-90 active:text-white p-1"
          >
            <RotateCw className="w-5 h-5" />
          </button>

          {/* Громкость */}
          <div className="flex items-center gap-2 group/vol">
            <button
              onClick={() => setMuted(m => !m)}
              className="text-white/80 hover:text-white transition-all active:scale-90 p-1"
            >
              {muted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input
              type="range" min={0} max={1} step={0.05}
              value={muted ? 0 : volume}
              onChange={e => { setVolume(+e.target.value); setMuted(false) }}
              className="w-0 group-hover/vol:w-16 overflow-hidden transition-all duration-200 accent-primary cursor-pointer hidden @md/video:block"
            />
          </div>

          <div className="flex-1" />

          {/* Настройки (Скорость/Качество) */}
          <div className="relative">
            <button
              onClick={() => toggleMenu('quality')}
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-all active:scale-90 active:bg-white/10
        ${openMenu === 'quality' ? 'text-primary bg-white/10' : 'text-white/80 hover:text-white'}`}
            >
              <Settings className="w-5 h-5" />
            </button>

            {openMenu === 'quality' && (
              <div className="absolute bottom-full right-0 mb-4 w-52 bg-black/95 backdrop-blur-md
        rounded-2xl border border-white/10 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">

                {/* Секция скорости */}
                <div className="px-4 pt-3 pb-2">
                  <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2 flex items-center gap-1.5 font-bold">
                    <Gauge className="w-3 h-3" /> Скорость
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {SPEEDS.map(s => (
                      <button
                        key={s}
                        onClick={() => { setSpeed(s); setOpenMenu(null); }}
                        className={`py-1.5 rounded-lg text-xs transition-all active:scale-90
                  ${speed === s
                          ? 'bg-primary text-white font-bold shadow-lg shadow-primary/20'
                          : 'bg-white/5 text-white/70 active:bg-white/20'
                        }`}
                      >
                        {s === 1 ? '1x' : `${s}x`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-[1px] bg-white/10 mx-2" />

                {/* Секция качества */}
                <div className="px-2 py-2">
                  <p className="px-2 text-white/40 text-[10px] uppercase tracking-widest mb-1.5 font-bold">
                    Качество
                  </p>
                  {qualities.length === 0 ? (
                    <p className="px-2 text-white/30 text-xs py-2">Поиск потоков...</p>
                  ) : (
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => applyQuality('auto')}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all active:scale-[0.98] active:bg-white/10
                  ${activeQuality === 'auto'
                          ? 'bg-primary/20 text-primary font-bold'
                          : 'text-white/70 hover:bg-white/5'
                        }`}
                      >
                        Авто
                      </button>
                      {qualities.map(q => (
                        <button
                          key={q.height}
                          onClick={() => applyQuality(q.height)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all active:scale-[0.98] active:bg-white/10
                    ${activeQuality === q.height
                            ? 'bg-primary/20 text-primary font-bold'
                            : 'text-white/70 hover:bg-white/5'
                          }`}
                        >
                  <span className="flex items-center justify-between">
                    {q.label}
                    {(q.height >= 720) && <span className="text-[9px] px-1 bg-white/10 rounded-sm text-white/40">HD</span>}
                  </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Полный экран */}
          <button
            onClick={toggleFullscreen}
            className="text-white/80 hover:text-white transition-all active:scale-90 p-1"
          >
            {fullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  )
}

