'use client'
import {useRef} from "react";
import {Label} from "@/components/ui/label";
import {ImageIcon, Loader2, PlayCircle, Upload, Video} from "lucide-react";
import {cn} from "@/lib/utils";

export default function ThumbnailUploadCard({
                               previewUrl, isUploading, disabled, onFileSelect,
                             }: {
  previewUrl?: string | null
  isUploading?: boolean
  disabled?: boolean
  onFileSelect: (file: File) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-2">
      <Label>Обложка курса</Label>
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          "group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed aspect-video overflow-hidden transition-all duration-200",
          disabled
            ? "cursor-not-allowed border-border/40 bg-muted/20"
            : "cursor-pointer border-border hover:border-primary/50 hover:bg-primary/5"
        )}
      >
        {previewUrl ? (
          <>
            <img src={previewUrl} alt="thumbnail" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              {!disabled && (
                <div className="flex items-center gap-2 text-white text-sm font-medium">
                  <Upload className="h-4 w-4" /> Заменить
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            {isUploading
              ? <Loader2 className="h-8 w-8 animate-spin text-primary" />
              : (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <ImageIcon className="h-6 w-6" />
                </div>
              )
            }
            {!isUploading && (
              <>
                <p className="text-sm font-medium text-foreground/80">
                  {disabled ? "Нет файла" : "Нажмите для загрузки"}
                </p>
                <p className="text-xs text-muted-foreground">PNG, JPG, WebP до 10MB</p>
              </>
            )}
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="sr-only" disabled={disabled}
             onChange={e => { const f = e.target.files?.[0]; if (f) onFileSelect(f); e.target.value = "" }} />
    </div>
  )
}