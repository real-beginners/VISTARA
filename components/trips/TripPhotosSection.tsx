"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { authorizeGoogleDrive } from "@/lib/auth";
import { initTripDriveFolder } from "@/lib/api";

interface TripPhotosSectionProps {
  tripId: string;
  initialFolderUrl?: string;
}

export function TripPhotosSection({ tripId, initialFolderUrl }: TripPhotosSectionProps) {
  const [folderUrl, setFolderUrl] = useState<string | null>(initialFolderUrl || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
              Your shared trip folder is ready. You can now upload and view photos directly in Google Drive.
              (In-app photo viewing coming in the next milestone!)
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <a
                href={folderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-pine px-5 py-2.5 text-sm font-bold text-white transition hover:bg-pine-dark"
              >
                <Icon name="external-link" size={16} />
                Open Trip Photos
              </a>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
