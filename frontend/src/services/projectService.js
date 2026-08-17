import api from "./api";

export const getUsers = async () => {
    const response = await api.get("/users");
    return response.data;
};
export const getProjectMembers = async (projectId) => {
    const response = await api.get(`/projects/${projectId}/members`);
    return response.data;
};

export const addProjectMember = async (projectId, data) => {
    const response = await api.post(
        `/projects/${projectId}/members`,
        data
    );

    return response.data;
};

export const updateProjectMember = async (
    projectId,
    userId,
    data
) => {
    const response = await api.put(
        `/projects/${projectId}/members/${userId}`,
        data
    );

    return response.data;
};

export const removeProjectMember = async (
    projectId,
    userId
) => {
    const response = await api.delete(
        `/projects/${projectId}/members/${userId}`
    );

    return response.data;
};