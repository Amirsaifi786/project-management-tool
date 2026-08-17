import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
    getProject,
    getProjectMembers,
    addProjectMember,
    updateProjectMember,
    removeProjectMember,
} from "../api/projectApi";

import { getUsers } from "../api/userApi";

function ProjectMembers() {
    const [members, setMembers] = useState([]);
    const [users, setUsers] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);



    const [userId, setUserId] = useState("");
    const [role, setRole] = useState("member");

    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {

        try {

            setLoading(true);

            const [
                projectResponse,
                membersResponse,
                usersResponse,
            ] = await Promise.all([
                getProject(id),
                getProjectMembers(id),
                getUsers(),
            ]);

            const projectData =
                projectResponse?.data?.data ??
                projectResponse?.data ??
                projectResponse;

            const memberData =
                membersResponse?.data;

            const userData =
                usersResponse?.data;

            setProject(projectData);

            setMembers(
                Array.isArray(memberData)
                    ? memberData
                    : memberData?.data || []
            );

            setUsers(
                Array.isArray(userData)
                    ? userData
                    : userData?.data || []
            );

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to load project members"
            );

        } finally {

            setLoading(false);

        }
    };

    const handleAddMember = async (e) => {

        e.preventDefault();

        if (!userId) {

            toast.error(
                "Please select a user"
            );

            return;
        }

        try {

            setAdding(true);

            await addProjectMember(id, {
                user_id: userId,
                role: role,
            });

            toast.success(
                "Member added successfully"
            );

            setUserId("");
            setRole("member");

            await loadData();

        } catch (error) {

            console.error(
                "Add Member Error:",
                error
            );

            const errors =
                error.response?.data?.errors;

            if (errors) {

                Object.values(errors).forEach(
                    messages => {

                        messages.forEach(
                            message =>
                                toast.error(
                                    message
                                )
                        );

                    }
                );

            } else {

                toast.error(
                    error.response?.data?.message ||
                    "Failed to add member"
                );

            }

        } finally {

            setAdding(false);

        }
    };

    const handleRoleChange = async (
        member,
        newRole
    ) => {

        const user =
            member.user || member;

        try {

            await updateProjectMember(
                id,
                user.id,
                {
                    role: newRole,
                }
            );

            toast.success(
                "Role updated successfully"
            );

            await loadData();

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to update role"
            );

        }
    };

    const handleRemove = async (
        member
    ) => {

        const user =
            member.user || member;

        const confirmed =
            window.confirm(
                `Remove ${user.name} from this project?`
            );

        if (!confirmed) {
            return;
        }

        try {

            await removeProjectMember(
                id,
                user.id
            );

            toast.success(
                "Member removed successfully"
            );

            await loadData();

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to remove member"
            );

        }
    };

    if (loading) {

        return (
            <div className="text-center py-5">

                <div
                    className="spinner-border"
                    role="status"
                />

                <p className="mt-2">
                    Loading members...
                </p>

            </div>
        );
    }

    return (

        <div>

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="mb-1">
                        Project Members
                    </h2>

                    <p className="text-muted mb-0">
                        {project?.name}
                    </p>

                </div>

                <Link
                    to={`/projects/${id}`}
                    className="btn btn-outline-secondary"
                >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Project
                </Link>

            </div>


            <div className="row g-4">

                {/* Add Member */}

                <div className="col-lg-4">

                    <div className="card shadow-sm">

                        <div className="card-header bg-white">

                            <h5 className="mb-0">
                                Add Member
                            </h5>

                        </div>

                        <div className="card-body">

                            <form
                                onSubmit={
                                    handleAddMember
                                }
                            >

                                <div className="mb-3">

                                    <label className="form-label">
                                        User
                                    </label>

                                    <select
                                        className="form-select"
                                        value={userId}
                                        onChange={(e) =>
                                            setUserId(
                                                e.target.value
                                            )
                                        }
                                        required
                                    >

                                        <option value="">
                                            Select User
                                        </option>

                                        {users.map(
                                            user => (

                                                <option
                                                    key={
                                                        user.id
                                                    }
                                                    value={
                                                        user.id
                                                    }
                                                >
                                                    {
                                                        user.name
                                                    }
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>


                                <div className="mb-3">

                                    <label className="form-label">
                                        Project Role
                                    </label>

                                    <select
                                        className="form-select"
                                        value={role}
                                        onChange={(e) =>
                                            setRole(
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="member">
                                            Member
                                        </option>

                                        <option value="developer">
                                            Developer
                                        </option>

                                        <option value="manager">
                                            Manager
                                        </option>

                                        <option value="lead">
                                            Team Lead
                                        </option>

                                    </select>

                                </div>


                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={adding}
                                >

                                    {adding ? (

                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                            />

                                            Adding...
                                        </>

                                    ) : (

                                        <>
                                            <i className="bi bi-plus-lg me-2"></i>
                                            Add Member
                                        </>

                                    )}

                                </button>

                            </form>

                        </div>

                    </div>

                </div>


                {/* Members List */}

                <div className="col-lg-8">

                    <div className="card shadow-sm">

                        <div className="card-header bg-white">

                            <h5 className="mb-0">
                                Team Members
                            </h5>

                        </div>

                        <div className="card-body p-0">

                            {members.length === 0 ? (

                                <div className="text-center py-5">

                                    <i className="bi bi-people fs-1 text-muted"></i>

                                    <p className="text-muted mt-2">
                                        No members assigned
                                    </p>

                                </div>

                            ) : (

                                <div className="table-responsive">

                                    <table className="table table-hover mb-0">

                                        <thead>

                                            <tr>

                                                <th>
                                                    User
                                                </th>

                                                <th>
                                                    Email
                                                </th>

                                                <th>
                                                    Role
                                                </th>

                                                <th className="text-end">
                                                    Action
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {members.map(
                                                member => {

                                                    const user =
                                                        member.user ||
                                                        member;

                                                    return (

                                                        <tr
                                                            key={
                                                                user.id
                                                            }
                                                        >

                                                            <td>

                                                                <div className="fw-semibold">
                                                                    {
                                                                        user.name
                                                                    }
                                                                </div>

                                                            </td>

                                                            <td>

                                                                <span className="text-muted">
                                                                    {
                                                                        user.email
                                                                    }
                                                                </span>

                                                            </td>

                                                            <td>

                                                                <select
                                                                    className="form-select form-select-sm"
                                                                    value={
                                                                        member.role ||
                                                                        "member"
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleRoleChange(
                                                                            member,
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                >

                                                                    <option value="member">
                                                                        Member
                                                                    </option>

                                                                    <option value="developer">
                                                                        Developer
                                                                    </option>

                                                                    <option value="manager">
                                                                        Manager
                                                                    </option>

                                                                    <option value="lead">
                                                                        Team Lead
                                                                    </option>

                                                                </select>

                                                            </td>

                                                            <td className="text-end">

                                                                <button
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() =>
                                                                        handleRemove(
                                                                            member
                                                                        )
                                                                    }
                                                                >
                                                                    <i className="bi bi-trash"></i>
                                                                </button>

                                                            </td>

                                                        </tr>

                                                    );
                                                }
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ProjectMembers;