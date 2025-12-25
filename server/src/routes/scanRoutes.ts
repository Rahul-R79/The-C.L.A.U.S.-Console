import { Router } from "express";
import { verifyAuthToken } from "../middleware/auth";
import { processScan, upload, generateToy, checkToyStatus, approveWish, getWishes, getSantaWishes, updateWishStatus } from "../controllers/scanController";

const router = Router();

router.post("/", verifyAuthToken, upload.single("image"), processScan);
router.post("/generate", verifyAuthToken, generateToy);
router.get("/status/:taskId", verifyAuthToken, checkToyStatus);
router.post("/approve", verifyAuthToken, approveWish);
router.get("/wishes", verifyAuthToken, getWishes);

// Santa Admin Routes
router.get("/santa/wishes", getSantaWishes);
router.put("/santa/update/:id", updateWishStatus);

export default router;
