import { Router } from "express";
import { verifyAuthToken } from "../middleware/auth";
import { processScan, upload, generateToy, checkToyStatus, approveWish, getWishes } from "../controllers/scanController";

const router = Router();

router.post("/", verifyAuthToken, upload.single("image"), processScan);
router.post("/generate", verifyAuthToken, generateToy);
router.get("/status/:taskId", verifyAuthToken, checkToyStatus);
router.post("/approve", verifyAuthToken, approveWish);
router.get("/wishes", verifyAuthToken, getWishes);

export default router;
