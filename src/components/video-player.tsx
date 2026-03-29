'use client'

import { useEffect, useRef } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

export const VideoPlayer = ({ slug, endpoint }: { slug: string; endpoint: string | null }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<any>(null)

  useEffect(() => {
    if (!endpoint || !containerRef.current) return

    // Если плеер уже существует — не пересоздаём
    if (playerRef.current && !playerRef.current.isDisposed()) return

    // Создаём новый <video> элемент программно, а не через JSX
    // Это защищает от проблем со StrictMode
    const videoEl = document.createElement('video')
    videoEl.className = 'video-js vjs-big-play-centered'
    containerRef.current.innerHTML = ''
    containerRef.current.appendChild(videoEl)

    const authStorage = localStorage.getItem('auth-storage')
    let token: string | null = null
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage)
        token = parsed?.state?.user?.token
      } catch {}
    }

    const VHS = (videojs as any).Vhs || (videojs as any).Hls
    if (VHS) {
      VHS.xhr.beforeRequest = function (options: any) {
        if (token) {
          options.headers = { ...options.headers, Authorization: `Bearer ${token}` }
        }
        return options
      }
    }

    const player = videojs(videoEl, {
      controls: true,
      fluid: true,
      fill: true,
      html5: { vhs: { overrideNative: true } },
      sources: [
        {
          src: `${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`,
          type: 'application/x-mpegURL',
        },
      ],
    })

    player.on('error', () => {
      console.error('VideoJS error:', player.error())
    })

    playerRef.current = player

    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose()
        playerRef.current = null
      }
    }
  }, [slug, endpoint])

  if (!endpoint) {
    return (
      <div className="aspect-video bg-muted rounded-2xl flex items-center justify-center">
        <span className="text-muted-foreground text-sm">Загрузка видео...</span>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="rounded-2xl overflow-hidden w-full aspect-video" />
  )
}