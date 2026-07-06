import { useCallback, useRef, useState } from "react"
import { UploadIcon } from "lucide-react"

import { Button } from "@workspace/ui/atoms/button"
import { cn } from "@workspace/ui/lib/utils"

type FileUploadProps = {
  onUpload: (file: File) => Promise<void>
  accept?: string
  label?: string
  className?: string
  disabled?: boolean
}

export function FileUpload({
  onUpload,
  accept,
  label = "Arraste um ficheiro ou clique para enviar",
  className,
  disabled,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const handleFile = useCallback(
    async (file: File) => {
      setIsUploading(true)
      try {
        await onUpload(file)
      } finally {
        setIsUploading(false)
      }
    },
    [onUpload]
  )

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed p-6 text-center transition-colors",
        dragOver && "border-primary bg-primary/5",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragOver(false)
        const file = e.dataTransfer.files[0]
        if (file) void handleFile(file)
      }}
    >
      <UploadIcon className="text-muted-foreground size-8" />
      <p className="text-muted-foreground text-sm">{label}</p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isUploading || disabled}
        onClick={() => inputRef.current?.click()}
      >
        {isUploading ? "A enviar…" : "Selecionar ficheiro"}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void handleFile(file)
          e.target.value = ""
        }}
      />
    </div>
  )
}
