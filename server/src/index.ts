import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import scanRoutes from "./routes/scanRoutes";
import connectDB from './config/db';

const app = express();
const PORT = process.env.PORT;

// Connect to Database
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/scan", scanRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
