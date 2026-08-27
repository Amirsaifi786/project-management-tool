import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);
export const getTaskComments = async (taskId) => {
    const response = await api.get(`/tasks/${taskId}/comments`);
    return response.data;
};

export const addTaskComment = async (taskId, comment) => {
    const response = await api.post(`/tasks/${taskId}/comments`, {
        comment,
    });

    return response.data;
};

export const updateTaskComment = async (commentId, comment) => {
    const response = await api.put(`/task-comments/${commentId}`, {
        comment,
    });

    return response.data;
};

export const deleteTaskComment = async (commentId) => {
    const response = await api.delete(`/task-comments/${commentId}`);
    return response.data;
};


export default api;
