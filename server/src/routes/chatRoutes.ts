import express from 'express';
import { getChatHistory, getActiveUsers, markRead } from '../controllers/chatController';

const router = express.Router();

router.get('/users', getActiveUsers);
router.get('/history/:userId', getChatHistory);
router.put('/read/:userId', markRead);

export default router;
