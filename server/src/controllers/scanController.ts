import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import multer from 'multer';
import { analyzeImageForWishes } from '../services/geminiService';
import { createTripoTask, getTripoTask } from '../services/tripoService';
import Wish from '../models/Wish';
import cloudinary from '../config/cloudinary';

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
});

export const processScan = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image file provided." });
        }

        const aiResult = await analyzeImageForWishes(req.file.buffer, req.file.mimetype);

        res.json({
            success: true,
            data: aiResult
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || "Internal Server Error during scanning."
        });
    }
};


export const generateToy = async (req: Request, res: Response) => {
    try {
        const { wish } = req.body;

        if (!wish) {
            return res.status(400).json({ error: "No wish prompt provided." });
        }

        const taskId = await createTripoTask(wish);

        res.json({
            success: true,
            taskId: taskId,
            message: "Fabrication initiated."
        });

    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const checkToyStatus = async (req: Request, res: Response) => {
    try {
        const { taskId } = req.params;
        const result = await getTripoTask(taskId);

        res.json({
            success: true,
            data: result
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};



export const approveWish = async (req: Request, res: Response) => {
    try {
        const authReq = req as AuthRequest;
        if (!authReq.user) {
            return res.status(401).json({ success: false, error: "User not authenticated" });
        }

        const { username, wish, sentiment, status, modelUrl, imageUrl } = req.body;

        let uploadedImageUrl = imageUrl;
        if (imageUrl && !imageUrl.includes('res.cloudinary.com')) {
            try {
                const uploadRes = await cloudinary.uploader.upload(imageUrl, {
                    folder: 'claus_wishes'
                });
                uploadedImageUrl = uploadRes.secure_url;
            } catch (err: any) {

            }
        }

        const newWish = await Wish.create({
            userId: authReq.user.uid,
            username,
            wish,
            sentiment,
            status,
            modelUrl,
            imageUrl: uploadedImageUrl
        });

        res.json({
            success: true,
            data: newWish
        });

    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getWishes = async (req: Request, res: Response) => {
    try {
        const authReq = req as AuthRequest;
        if (!authReq.user) {
            return res.status(401).json({ success: false, error: "User not authenticated" });
        }

        const wishes = await Wish.find({
            userId: authReq.user.uid,
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: wishes
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};


export const getSantaWishes = async (req: Request, res: Response) => {
    try {
        const wishes = await Wish.find({}).sort({ createdAt: -1 });
        res.json({
            success: true,
            data: wishes
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateWishStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'approved', 'denied'].includes(status)) {
            return res.status(400).json({ success: false, error: "Invalid status" });
        }

        const updatedWish = await Wish.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedWish) {
            return res.status(404).json({ success: false, error: "Wish not found" });
        }

        res.json({
            success: true,
            data: updatedWish
        });

    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};
