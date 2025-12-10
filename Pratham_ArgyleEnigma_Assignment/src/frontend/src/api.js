import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
});

export const checkHealth = async () => {
    try {
        const response = await api.get('/health');
        return response.data;
    } catch (error) {
        console.error("Health check failed:", error);
        throw error;
    }
};

export const uploadPDF = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await api.post('/process', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Upload failed:", error);
        throw error;
    }
};

export default api;
