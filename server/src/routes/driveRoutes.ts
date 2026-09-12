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

import multer from "multer";
import { uploadFileToDrive } from "../services/driveService";

// Multer config: memory storage, 10MB limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

router.post("/upload", requireAuth, upload.single("file"), async (req: Request, res: Response) => {
  try {
    const tripId = req.body.tripId;
    const accessToken = req.body.accessToken;
    const userId = req.user!.uid;

    if (!tripId || !accessToken) {
      res.status(400).json({ error: "tripId and accessToken are required" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: "No image file provided" });
      return;
    }

    // Verify trip membership
    const { trip, isMember, tripExists } = await getTripById(tripId, userId);
    if (!tripExists || !trip) {
      res.status(404).json({ error: "Trip not found" });
      return;
    }
    if (!isMember) {
      res.status(403).json({ error: "You are not a member of this trip" });
      return;
    }

    if (!trip.driveFolderId) {
      res.status(400).json({ error: "Trip does not have a Google Drive folder initialized" });
      return;
    }

    // Upload to Drive
    const uploadedFile = await uploadFileToDrive(
      accessToken,
      trip.driveFolderId,
      req.file.originalname,
      req.file.mimetype,
      req.file.buffer
    );

    res.json({
      fileName: req.file.originalname,
      fileUrl: uploadedFile.url,
      fileId: uploadedFile.id,
    });
  } catch (error: any) {
    console.error("[Drive Route Upload Error]", error.message);
    res.status(500).json({ error: "Failed to upload file", details: error.message });
  }
});

export default router;
