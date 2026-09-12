"use client";

import { useState, useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { authorizeGoogleDrive } from "@/lib/auth";
import { initTripDriveFolder, uploadTripPhoto, type UploadPhotoResponse } from "@/lib/api";

interface TripPhotosSectionProps {
  tripId: string;
  initialFolderUrl?: string;
}

export function TripPhotosSection({ tripId, initialFolderUrl }: TripPhotosSectionProps) {
  const [folderUrl, setFolderUrl] = useState<string | null>(initialFolderUrl || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadPhotoResponse[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleConnectDrive = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const accessToken = await authorizeGoogleDrive();
      const result = await initTripDriveFolder(tripId, accessToken);
      setFolderUrl(result.folderUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to connect Google Drive.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB.");
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadSuccess(null);
    try {
      // Re-authorize to get a fresh token (or rely on cached if still valid, but popup requires interaction)
      // Actually, since popup might get blocked if not directly from click, we do it in one flow.
      const accessToken = await authorizeGoogleDrive();
      const result = await uploadTripPhoto(tripId, file, accessToken);
      setUploadedPhotos((prev) => [...prev, result]);
      setUploadSuccess(`Successfully uploaded ${file.name}!`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to upload photo.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <Card padding="lg" className="border-line bg-paper text-center">
        {!folderUrl ? (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
              <Icon name="image" size={26} />
            </div>

            <h2 className="mt-4 font-display text-2xl tracking-[-0.02em] text-ink">
              Trip Photos & Memories
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
              Connect Google Drive to create a shared folder for your trip. 
              Everyone in the trip will be able to add and view photos in one place.
            </p>

            {error && (
              <div className="mx-auto mt-4 max-w-md rounded-xl bg-coral-soft/50 p-3 text-sm text-coral">
                {error}
              </div>
            )}

            <div className="mt-6">
              <Button
                variant="primary"
                onClick={handleConnectDrive}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Icon name="folder" size={16} />
                    Connect Google Drive
                  </>
                )}
              </Button>
            </div>
            <p className="mt-4 text-[10px] text-muted/70">
              Vistara only requests access to folders it creates.
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-moss text-pine">
              <Icon name="check-circle" size={26} />
            </div>

            <h2 className="mt-4 font-display text-2xl tracking-[-0.02em] text-ink">
              Google Drive Connected
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
              Your shared trip folder is ready. You can now upload photos directly from here, or view them in Google Drive.
            </p>

            {error && (
              <div className="mx-auto mt-4 max-w-md rounded-xl bg-coral-soft/50 p-3 text-sm text-coral">
                {error}
              </div>
            )}

            {uploadSuccess && (
              <div className="mx-auto mt-4 max-w-md rounded-xl bg-moss-soft/50 p-3 text-sm text-pine">
                {uploadSuccess}
              </div>
            )}

            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <Button
                variant="primary"
                onClick={triggerFileInput}
                disabled={isUploading}
                className="bg-pine hover:bg-pine-dark text-white shadow-sm w-full sm:w-auto"
              >
                {isUploading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Icon name="upload" size={16} />
                    Upload Photo
                  </>
                )}
              </Button>

              <a
                href={folderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-bold text-ink transition hover:bg-stone-50 sm:w-auto"
              >
                <Icon name="external-link" size={16} />
                Open Trip Folder
              </a>
            </div>

            {uploadedPhotos.length > 0 && (
              <div className="mt-8 border-t border-line pt-6 text-left">
                <h3 className="font-display text-lg text-ink mb-4">Recently Uploaded</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {uploadedPhotos.map((photo) => (
                    <a
                      key={photo.fileId}
                      href={photo.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block aspect-square w-full overflow-hidden rounded-xl bg-stone-100 relative transition-transform hover:scale-[1.02]"
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-muted group-hover:text-ink">
                        <Icon name="image" size={24} className="mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                        <span className="text-xs font-medium line-clamp-2">{photo.fileName}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
