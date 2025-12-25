import apiClient from "../config/api";

export interface ScanResponse {
    success: boolean;
    data?: any;
    error?: string;
}

export interface GenerateToyResponse {
    success: boolean;
    taskId?: string;
    message?: string;
    error?: string;
}

export interface TaskStatusResponse {
    success: boolean;
    data: any;
    error?: string;
}

export const uploadScan = async (file: File, token: string) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await apiClient.post<ScanResponse>(
        "/api/v1/scan",
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const generateToyTask = async (wish: string, token: string) => {
    const response = await apiClient.post<GenerateToyResponse>(
        "/api/v1/scan/generate",
        { wish },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data;
};

export const checkTaskStatus = async (taskId: string, token: string) => {
    const response = await apiClient.get<TaskStatusResponse>(
        `/api/v1/scan/status/${taskId}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data;
};

export const approveWish = async (data: any, token: string) => {
    const response = await apiClient.post<any>('/api/v1/scan/approve', data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getApprovedWishes = async (token: string) => {
    const response = await apiClient.get<any>('/api/v1/scan/wishes', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getWishById = async (id: string, token: string) => {
    const response = await apiClient.get<any>(`/api/v1/scan/wishes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Santa Admin Services
export const getSantaWishes = async () => {
    const response = await apiClient.get<any>('/api/v1/scan/santa/wishes');
    return response.data;
};

export const updateWishStatus = async (id: string, status: 'pending' | 'approved' | 'denied') => {
    const response = await apiClient.put<any>(`/api/v1/scan/santa/update/${id}`, { status });
    return response.data;
};
