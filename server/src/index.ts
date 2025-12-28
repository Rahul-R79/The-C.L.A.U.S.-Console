import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import scanRoutes from "./routes/scanRoutes";
import chatRoutes from "./routes/chatRoutes";
import connectDB from './config/db';
import { setupSocket } from './socket/socketHandler';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 8080;

// Connect to Database
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/scan", scanRoutes);
app.use("/api/v1/chat", chatRoutes);

// Socket io
setupSocket(io);

httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
