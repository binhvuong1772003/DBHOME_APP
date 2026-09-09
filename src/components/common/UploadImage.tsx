"use client";

import { ImageIcon, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadTrigger,
} from "@/components/ui/file-upload";

interface UploadImageProps {
  files: File[];
  onValueChange: (files: File[]) => void;
  maxFiles?: number;
  previewUrl?: string | null; // ← thêm
}

const UploadImage = ({
  files,
  onValueChange,
  maxFiles = 1,
  previewUrl,
}: UploadImageProps) => {
  const { t } = useTranslation("common");
  const onFileReject = React.useCallback((file: File, message: string) => {
    toast.error(message, {
      description: t("upload.rejected", { name: file.name }),
    });
  }, [t]);

  const filePreview = React.useMemo(
    () => (files[0] ? URL.createObjectURL(files[0]) : null),
    [files],
  );

  React.useEffect(
    () => () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    },
    [filePreview],
  );

  const preview = filePreview ?? previewUrl ?? null;

  return (
    <FileUpload
      accept="image/*"
      maxFiles={maxFiles}
      maxSize={5 * 1024 * 1024}
      className="w-full max-w-md"
      value={files}
      onValueChange={onValueChange}
      onFileReject={onFileReject}
    >
      {preview ? (
        <div className="relative w-full aspect-square rounded-lg overflow-hidden">
          <img
            src={preview}
            alt={t("upload.previewAlt")}
            className="w-full h-full object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 size-8"
            onClick={() => onValueChange([])}
            aria-label={t("upload.remove")}
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : (
        // Hiện dropzone khi chưa có ảnh
        <FileUploadDropzone
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="border-primary/20 bg-primary/5 hover:bg-primary/10 data-dragging:bg-primary/10"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="rounded-lg bg-primary/10 p-3">
              <ImageIcon className="size-8 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">{t("upload.dragDrop")}</p>
              <p className="text-muted-foreground text-xs">
                {t("upload.formats")}
              </p>
            </div>
          </div>
          <FileUploadTrigger asChild>
            <Button size="sm" className="mt-3" type="button">
              {t("upload.select")}
            </Button>
          </FileUploadTrigger>
        </FileUploadDropzone>
      )}
    </FileUpload>
  );
};

export default UploadImage;
