import { Router, type Request, type Response } from "express";
import { requireAuth } from "../middleware/auth";
import { getTripById, updateTripDriveFolder } from "../services/tripService";
import { createDriveFolder } from "../services/driveService";

const router = Router();

router.post("/init-folder", requireAuth, async (req: Request, res: Response) => {
  try {
    const { tripId, accessToken } = req.body;
    const userId = req.user!.uid;

    if (!tripId || !accessToken) {
      res.status(400).json({ error: "tripId and accessToken are required" });
      return;
    }

    // Verify trip membership
    const { trip, isMember, tripExists } = await getTripById(tripId, userId);
    if (!tripExists) {
      res.status(404).json({ error: "Trip not found" });
      return;
    }
    if (!isMember || !trip) {
      res.status(403).json({ error: "You are not a member of this trip" });
      return;
    }

    // If the trip already has a folder, just return it
    if (trip.driveFolderId && trip.driveFolderUrl) {
      res.json({
        folderId: trip.driveFolderId,
        folderUrl: trip.driveFolderUrl,
      });
      return;
    }

    // Create the folder using the user's OAuth access token
    const folderName = `Vistara - ${trip.title} Photos`;
    const folder = await createDriveFolder(accessToken, folderName);

    // Save the folder info to the trip document
    await updateTripDriveFolder(tripId, folder.id, folder.url);

    res.json({
      folderId: folder.id,
      folderUrl: folder.url,
    });
  } catch (error: any) {
    console.error("[Drive Route Error]", error.message);
    res.status(500).json({ error: "Failed to initialize Drive folder", details: error.message });
  }
});

export default router;
