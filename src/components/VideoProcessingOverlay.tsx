import {Loader2, CheckCircle2, Clock, X} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {useTranslations} from "next-intl";

interface VideoProcessingOverlayProps {
  status: string;
  progress: number | null;
}

export function VideoProcessingOverlay({ status, progress }: VideoProcessingOverlayProps) {
  const statusMap: Record<string, string> = {
    'UPLOADED': 'video.status.uploaded',
    'PROCESSING': 'video.status.processing',
    'TRANSCODING': 'video.status.transcoding',
    'UPLOADED_HLS': 'video.status.uploaded_hls',
    'DONE': 'video.status.done',
    'FAILED': 'video.status.failed',
  };0

  const t  = useTranslations();

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] p-4 transition-all">
      <div className="w-full max-w-[200px] space-y-4 text-center">
        {status === 'DONE' ? (
          <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto animate-in zoom-in" />
        ) : status === 'FAILED' ? (
            <X className="h-10 w-10 text-red-500 mx-auto animate-in zoom-in" />
          ) : (
          <Loader2 className="h-10 w-10 text-primary mx-auto animate-spin" />
        )}

        <div className="space-y-1.5">
          <p className="text-sm font-medium text-white">
            {t(statusMap[status]) || 'Обработка...'}
          </p>

          {progress !== null && progress > 0 && (
            <div className="space-y-1">
              <Progress value={progress} className="h-1.5 w-full" />
              <p className="text-[10px] text-white/70 text-right">{Math.round(progress)}%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}