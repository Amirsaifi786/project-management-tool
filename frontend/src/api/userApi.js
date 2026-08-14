import api from "./axios";

export const getUsers = async () => {
    const response = await api.get("/users");

    console.log("Users API Response:", response.data);

    return response.data;
};

export const getUser = async (id) => {
    const response = await api.get(`/users/${id}`);

    return response.data;
};

export const createUser = async (data) => {
    const response = await api.post("/users", data);

    return response.data;
};


export const deleteUser = async (id) => {
    const response = await api.delete(`/users/${id}`);

    return response.data;
};



export const removeRole = async (id) => {
    const response = await api.delete(
        `/users/${id}/role`
    );

    return response.data;
};
export const updateUser = async (id, data) => {
    const response = await api.put(
        `/users/${id}`,
        data
    );

    return response.data;
};

export const assignRole = async (id, role) => {
    const response = await api.post(
        `/users/${id}/role`,
        {
            role: role,
        }
    );

    return response.data;
};