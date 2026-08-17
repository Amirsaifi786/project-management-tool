import { useEffect, useState } from "react";
import {
    getProjectMembers,
    addProjectMember,
    removeProjectMember,
    getUsers,
} from "../services/projectService";

function ProjectMembers({ projectId }) {
    const [members, setMembers] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState("");

    const extractArray = (response) => {
        if (Array.isArray(response)) {
            return response;
        }

        if (Array.isArray(response?.data)) {
            return response.data;
        }

        if (Array.isArray(response?.users)) {
            return response.users;
        }

        if (Array.isArray(response?.data?.users)) {
            return response.data.users;
        }

        if (Array.isArray(response?.data?.data)) {
            return response.data.data;
        }

        return [];
    };

    const loadMembers = async () => {
        try {
            const response = await getProjectMembers(projectId);

            console.log("MEMBERS API:", response);

            setMembers(extractArray(response));
        } catch (error) {
            console.error(
                "Members error:",
                error.response?.data || error
            );

            setMembers([]);
        }
    };

    const loadUsers = async () => {
        try {
            const response = await getUsers();

            console.log("USERS API:", response);

            const userList = extractArray(response);

            console.log("USERS ARRAY:", userList);

            setUsers(userList);
        } catch (error) {
            console.error(
                "Users error:",
                error.response?.data || error
            );

            setUsers([]);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError("");

            await Promise.all([
                loadMembers(),
                loadUsers(),
            ]);

            setLoading(false);
        };

        if (projectId) {
            loadData();
        }
    }, [projectId]);

    const handleAdd = async (e) => {
        e.preventDefault();

        if (!selectedUser) {
            return;
        }

        try {
            setAdding(true);
            setError("");

            await addProjectMember(projectId, {
                user_id: Number(selectedUser),
            });

            setSelectedUser("");

            await loadMembers();
        } catch (error) {
            console.error(
                "Add member error:",
                error.response?.data || error
            );

            setError(
                error.response?.data?.message ||
                "Unable to add member."
            );
        } finally {
            setAdding(false);
        }
    };

    const handleRemove = async (userId) => {
        if (!window.confirm("Are you sure you want to remove this member?")) {
            return;
        }

        try {
            setError("");

            await removeProjectMember(projectId, userId);

            await loadMembers();
        } catch (error) {
            console.error(
                "Remove member error:",
                error.response?.data || error
            );

            setError(
                error.response?.data?.message ||
                "Unable to remove member."
            );
        }
    };

    const availableUsers = Array.isArray(users)
        ? users.filter((user) => {
              return !members.some((member) => {
                  const memberUserId =
                      member.user_id ??
                      member.user?.id ??
                      member.id;

                  return Number(memberUserId) === Number(user.id);
              });
          })
        : [];

    if (loading) {
        return (
            <div className="card mt-4">
                <div className="card-body">
                    Loading project members...
                </div>
            </div>
        );
    }

    return (
        <div className="card mt-4">
            <div className="card-header">
                <h5 className="mb-0">Project Members</h5>
            </div>

            <div className="card-body">

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleAdd}
                    className="row g-2 mb-4"
                >
                    <div className="col-md-8">
                        <select
                            className="form-select"
                            value={selectedUser}
                            onChange={(e) =>
                                setSelectedUser(e.target.value)
                            }
                        >
                            <option value="">
                                Select User
                            </option>

                            {availableUsers.map((user) => (
                                <option
                                    key={user.id}
                                    value={user.id}
                                >
                                    {user.name} - {user.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-4">
                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={
                                adding || !selectedUser
                            }
                        >
                            {adding
                                ? "Adding..."
                                : "Add Member"}
                        </button>
                    </div>
                </form>

                {members.length === 0 ? (
                    <div className="alert alert-info">
                        No members assigned to this project.
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-bordered align-middle">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {members.map((member) => {
                                    const user =
                                        member.user || member;

                                    const userId =
                                        member.user_id ??
                                        user.id;

                                    return (
                                        <tr key={userId}>
                                            <td>
                                                {user.name || "-"}
                                            </td>

                                            <td>
                                                {user.email || "-"}
                                            </td>

                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() =>
                                                        handleRemove(
                                                            userId
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProjectMembers;