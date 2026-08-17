import api from "./axios";

export const getProjects = async (params = {}) => {
    const response = await api.get("/projects", {
        params,
    });

    return response.data;
};

export const getProject = async (id) => {
    const response = await api.get(
        `/projects/${id}`
    );

    return response.data;
};

export const createProject = async (data) => {
    const response = await api.post(
        "/projects",
        data
    );

    return response.data;
};

export const updateProject = async (id, data) => {
    const response = await api.put(
        `/projects/${id}`,
        data
    );

    return response.data;
};

export const deleteProject = async (id) => {
    const response = await api.delete(
        `/projects/${id}`
    );

    return response.data;
};

export const getProjectMembers = async (id) => {
    const response = await api.get(
        `/projects/${id}/members`
    );

    return response.data;
};

export const addProjectMember = async (
    id,
    data
) => {
    const response = await api.post(
        `/projects/${id}/members`,
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