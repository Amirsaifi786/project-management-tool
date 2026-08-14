import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
    getUsers,
    deleteUser,
} from "../api/userApi";

function Users() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

const fetchUsers = async () => {
    try {
        setLoading(true);

        const response = await getUsers();

        console.log("FULL API RESPONSE:", response);

        // Laravel pagination response
        if (Array.isArray(response.data?.data)) {
            setUsers(response.data.data);
        }
        // Normal Laravel response
        else if (Array.isArray(response.data)) {
            setUsers(response.data);
        }
        // Direct array
        else if (Array.isArray(response)) {
            setUsers(response);
        }
        else {
            console.error("Unexpected users response:", response);
            setUsers([]);
        }

    } catch (error) {
        console.error("Users API Error:", error);

        toast.error(
            error.response?.data?.message ||
            "Users load nahi ho rahe"
        );

        setUsers([]);
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await deleteUser(id);

            toast.success("User deleted successfully");

            fetchUsers();

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "User delete failed"
            );
        }
    };

    return (
        <div>

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2 className="mb-1">
                        Users
                    </h2>

                    <p className="text-muted mb-0">
                        Manage system users
                    </p>
                </div>

                <Link
                    to="/users/create"
                    className="btn btn-primary"
                >
                    <i className="bi bi-plus-lg me-2"></i>
                    Add User
                </Link>

            </div>

            <div className="card shadow-sm">

                <div className="card-body p-0">

                    {loading ? (

                        <div className="text-center p-5">
                            <div
                                className="spinner-border"
                                role="status"
                            ></div>

                            <p className="mt-2 mb-0">
                                Loading users...
                            </p>
                        </div>

                    ) : users.length === 0 ? (

                        <div className="text-center p-5">

                            <i
                                className="bi bi-people fs-1 text-muted"
                            ></i>

                            <h5 className="mt-3">
                                No users found
                            </h5>

                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="table table-hover align-middle mb-0">

                                <thead className="table-light">

                                    <tr>

                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Created</th>
                                        <th className="text-end">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {users.map((user, index) => (

                                        <tr key={user.id}>

                                            <td>
                                                {index + 1}
                                            </td>

                                            <td>
                                                <strong>
                                                    {user.name}
                                                </strong>
                                            </td>

                                            <td>
                                                {user.email}
                                            </td>

                                            <td>

                                                {user.roles?.length > 0 ? (

                                                    user.roles.map((role) => (

                                                        <span
                                                            key={role.id || role.name}
                                                            className="badge bg-primary me-1"
                                                        >
                                                            {role.name}
                                                        </span>

                                                    ))

                                                ) : (

                                                    <span className="badge bg-secondary">
                                                        No Role
                                                    </span>

                                                )}

                                            </td>

                                            <td>
                                                {user.created_at
                                                    ? new Date(
                                                        user.created_at
                                                    ).toLocaleDateString()
                                                    : "-"
                                                }
                                            </td>

                                            <td className="text-end">

                                                <Link
                                                    to={`/users/${user.id}/edit`}
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </Link>

                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() =>
                                                        handleDelete(user.id)
                                                    }
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default Users;