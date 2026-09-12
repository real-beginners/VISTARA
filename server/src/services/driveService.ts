import { google } from "googleapis";

export async function createDriveFolder(
  accessToken: string,
  folderName: string
): Promise<{ id: string; url: string }> {
  // Use the access token passed from the frontend popup
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const drive = google.drive({ version: "v3", auth });

  try {
    // Check if the folder already exists (basic deduplication by name)
    const existing = await drive.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`,
      fields: "files(id, webViewLink)",
      spaces: "drive",
    });

    if (existing.data.files && existing.data.files.length > 0) {
      const folder = existing.data.files[0];
      return {
        id: folder.id!,
        url: folder.webViewLink!,
      };
    }

    // Create new folder
    const fileMetadata = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
    };

    const folder = await drive.files.create({
      requestBody: fileMetadata,
      fields: "id, webViewLink",
    });

    return {
      id: folder.data.id!,
      url: folder.data.webViewLink!,
    };
  } catch (error: any) {
    console.error("[Drive API Error]", error.message);
    throw new Error(`Failed to create Google Drive folder: ${error.message}`);
  }
}
