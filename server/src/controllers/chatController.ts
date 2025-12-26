import { Request, Response } from 'express';
import { Message } from '../models/Message';

export const getChatHistory = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const messages = await Message.find({ userId }).sort({ timestamp: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chat history' });
    }
};

export const getActiveUsers = async (req: Request, res: Response) => {
    try {
        const users = await Message.distinct('userId');
        const activeUsers = await Promise.all(users.map(async (userId) => {
            const lastMessage = await Message.findOne({ userId }).sort({ timestamp: -1 });
            const unreadCount = await Message.countDocuments({ userId, sender: 'user', read: false });

            return {
                userId,
                lastActive: lastMessage?.timestamp,
                lastMessage: lastMessage?.text,
                hasUnread: unreadCount > 0
            };
        }));

        activeUsers.sort((a, b) => {
            return (new Date(b.lastActive || 0).getTime() - new Date(a.lastActive || 0).getTime());
        });

        res.status(200).json(activeUsers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching active users' });
    }
};

export const markRead = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        await Message.updateMany(
            { userId, sender: 'user', read: false },
            { $set: { read: true } }
        );
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark messages as read' });
    }
};
