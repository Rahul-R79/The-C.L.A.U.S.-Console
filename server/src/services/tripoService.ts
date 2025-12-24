import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = 'https://api.tripo3d.ai/v2/openapi/task';

export const createTripoTask = async (prompt: string): Promise<string> => {
    const TRIPO_API_KEY = process.env.TRIPO_API_KEY;

    try {
        const response = await axios.post(
            API_URL,
            {
                type: "text_to_model",
                prompt: prompt
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${TRIPO_API_KEY}`
                }
            }
        );

        if (response.data && response.data.data && response.data.data.task_id) {
            return response.data.data.task_id;
        } else {
            console.error("Unexpected Tripo Response:", response.data);
            throw new Error("Failed to retrieve Task ID from Tripo API");
        }

    } catch (error: any) {
        throw new Error("Failed to initiate 3D generation. ");
    }
};

export const getTripoTask = async (taskId: string) => {
    const TRIPO_API_KEY = process.env.TRIPO_API_KEY;
    try {
        const response = await axios.get(
            `${API_URL}/${taskId}`,
            {
                headers: {
                    'Authorization': `Bearer ${TRIPO_API_KEY}`
                }
            }
        );

        return response.data;
    } catch (error: any) {
        throw new Error("Failed to check task status.");
    }
};
