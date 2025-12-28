import { Router } from "express";
import { verifyAuthToken } from "../middleware/auth";
import { processScan, upload, generateToy, checkToyStatus, approveWish, getWishes, getWishById, getSantaWishes, updateWishStatus, proxyModel, proxyRawModel } from "../controllers/scanController";


const router = Router();

router.post("/", verifyAuthToken, upload.single("image"), processScan);
router.post("/generate", verifyAuthToken, generateToy);
router.get("/status/:taskId", verifyAuthToken, checkToyStatus);
router.post("/approve", verifyAuthToken, approveWish);
router.get("/wishes", verifyAuthToken, getWishes);
router.get("/wishes/:id", verifyAuthToken, getWishById);
router.get("/model-proxy/:id", proxyModel);
router.get("/model-proxy-raw", proxyRawModel);


router.get("/santa/wishes", getSantaWishes);
router.put("/santa/update/:id", updateWishStatus);

export default router;
