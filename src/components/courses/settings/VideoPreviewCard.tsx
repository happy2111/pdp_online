'use client'

import {Loader2, PlayCircle, Upload, Video} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {
  CourseDetails,
} from "@/schemas/courses-schema";
import {Label} from "@/components/ui/label";
import {VideoPlayer} from "@/components/video-player";
import { toast } from "sonner";
import {VideoProgressType} from "@/schemas/video-progress";
import {subscribeToVideoProgress} from "@/services/subscribe-to-video-progress";
import {VideoProcessingOverlay} from "@/components/VideoProcessingOverlay";

export default function VideoPreviewCard({
                            course, isAuth, isUploading, disabled, onFileSelect
                          }: {
  course: CourseDetails
  isAuth: boolean
  isUploading: boolean
  disabled: boolean
  onFileSelect: (file: File) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [socketData, setSocketData] = useState<{status: string | unknown, progress: number | null} | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isUploading) setIsProcessing(true);
  }, [isUploading]);

  useEffect(() => {
    const backendStatus = course.preview_video_status;
    const isStillProcessing =
      backendStatus === 'PROCESSING' ||
      backendStatus === 'TRANSCODING' ||
      backendStatus === 'UPLOADED';

    if (isStillProcessing || isUploading) {
      setIsProcessing(true);
    }
  }, [course.preview_video_status, isUploading]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (isProcessing) {
      const closeConnection = subscribeToVideoProgress(course.slug, 'COURSE', (data) => {
        setSocketData({ status: data.status, progress: data.progress });

        if (data.status === 'DONE') {
          setIsProcessing(false);
          setTimeout(() => setSocketData(null), 3000);
        }
      });
      unsubscribe = () => closeConnection();
    }
    return unsubscribe;
  }, [isProcessing, course.slug]);


  return (
    <div className="space-y-2">
      <Label>Превью-видео</Label>
      <div className="relative group rounded-xl overflow-hidden border border-border/60 aspect-video bg-muted/10">
        {(isUploading || isProcessing || socketData) && (
          <VideoProcessingOverlay
            status={socketData?.status as any || 'UPLOADED'}
            progress={socketData?.progress ?? 0}
          />
        )}

        {course.preview_video_url ? (
          isAuth ? (
            <VideoPlayer slug={course.slug} endpoint={course.preview_video_url} />
          ) : (
            <div
              className="cursor-pointer h-full w-full"
              onClick={() => toast.error("Пожалуйста, войдите в систему, чтобы просмотреть видео-превью курса.")}
            >
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                <PlayCircle className="h-14 w-14 text-white drop-shadow-lg" />
              </div>
            </div>
          )
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Video className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-foreground/80">Превью-видео не загружено</p>
            <p className="text-xs text-muted-foreground">MP4, WebM до 500MB</p>
          </div>
        )}

        {!disabled && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading || !!socketData}
            className="absolute bottom-2 right-2 z-10 flex items-center gap-1.5 rounded-lg bg-black/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm hover:bg-black/90 transition-colors disabled:opacity-60"
          >
            {isUploading || socketData
              ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Обработка...</>
              : <><Upload className="h-3.5 w-3.5" /> {course.preview_video_url ? "Заменить" : "Загрузить"}</>
            }
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="video/*" className="sr-only" disabled={disabled || isUploading}
             onChange={e => { const f = e.target.files?.[0]; if (f) onFileSelect(f); e.target.value = "" }} />
    </div>
  )
}