import { Server, Socket } from 'socket.io';
import { Message } from '../models/Message';

export const setupSocket = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        socket.on("join_room", (room: string) => {
            socket.join(room);
            io.emit("user_active", { userId: room, socketId: socket.id });
        });

        socket.on("send_message", async (data: any) => {
            socket.to(data.room).emit("receive_message", data);

            io.emit("admin_receive_message", data);

            try {
                const isSanta = data.senderId === 'santa' || data.senderName === 'Santa Claus';
                const senderRole = isSanta ? 'santa' : 'user';

                const conversationOwnerId = data.room;

                await Message.create({
                    userId: conversationOwnerId,
                    senderId: data.senderId,
                    text: data.message,
                    sender: senderRole,
                    timestamp: new Date(),
                    read: false
                });
            } catch (error) {
                console.error("Error saving message to DB:", error);
            }
        });
    });
};
