import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";
import toast from "react-hot-toast";
import ProjectMembers from "../components/ProjectMembers";
import {
    getProject,
    getProjectMembers,
    removeProjectMember,
} from "../api/projectApi";

import {
    getTasks,
    deleteTask,
} from "../api/taskApi";

function ProjectDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [members, setMembers] = useState([]);
    const [tasks, setTasks] = useState([]);
const { id: projectId } = useParams();
    const [loading, setLoading] = useState(true);
    const [tasksLoading, setTasksLoading] = useState(true);

    useEffect(() => {
        loadProject();
    }, [id]);

    const loadProject = async () => {

        try {

            setLoading(true);
            setTasksLoading(true);

            const [
                projectResponse,
                membersResponse,
                tasksResponse,
            ] = await Promise.all([
                getProject(id),
                getProjectMembers(id),
                getTasks({
                    project_id: id,
                }),
            ]);

            const projectData =
                projectResponse?.data?.data ??
                projectResponse?.data ??
                projectResponse;

            const membersData =
                membersResponse?.data;

            const tasksData =
                tasksResponse?.data;

            setProject(projectData);

            setMembers(
                Array.isArray(membersData)
                    ? membersData
                    : membersData?.data || []
            );

            setTasks(
                Array.isArray(tasksData)
                    ? tasksData
                    : tasksData?.data || []
            );

        } catch (error) {

            console.error(
                "Project Details Error:",
                error
            );

            console.error(
                "Response:",
                error.response?.data
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to load project"
            );

            navigate("/projects");

        } finally {

            setLoading(false);
            setTasksLoading(false);

        }
    };

    const handleRemoveMember = async (
        userId
    ) => {

        const confirmed =
            window.confirm(
                "Remove this member from project?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await removeProjectMember(
                id,
                userId
            );

            toast.success(
                "Member removed successfully"
            );

            await loadProject();

        } catch (error) {

            console.error(
                "Remove Member Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to remove member"
            );

        }
    };

    const handleDeleteTask = async (
        taskId
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this task?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await deleteTask(taskId);

            toast.success(
                "Task deleted successfully"
            );

            await loadProject();

        } catch (error) {

            console.error(
                "Delete Task Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to delete task"
            );

        }
    };

    const getTaskStatusClass = (
        status
    ) => {

        switch (status) {

            case "completed":
                return "bg-success";

            case "in_progress":
                return "bg-primary";

            case "review":
                return "bg-warning text-dark";

            case "cancelled":
                return "bg-danger";

            default:
                return "bg-secondary";
        }
    };

    const getPriorityClass = (
        priority
    ) => {

        switch (priority) {

            case "urgent":
                return "bg-danger";

            case "high":
                return "bg-warning text-dark";

            case "medium":
                return "bg-info text-dark";

            default:
                return "bg-secondary";
        }
    };

    const formatStatus = (
        status
    ) => {

        if (!status) {
            return "Todo";
        }

        return String(status)
            .replaceAll("_", " ")
            .replace(
                /\b\w/g,
                (letter) =>
                    letter.toUpperCase()
            );
    };

    const getAssignedUser = (
        task
    ) => {

        return (
            task.assigned_user?.name ||
            task.assignedUser?.name ||
            task.user?.name ||
            task.assignee?.name ||
            "Unassigned"
        );
    };

    if (loading) {

        return (
            <div className="text-center py-5">

                <div
                    className="spinner-border"
                    role="status"
                />

                <p className="mt-2 mb-0">
                    Loading project...
                </p>

            </div>
        );
    }

    if (!project) {
        return null;
    }

    return (

        <div>

            {/* Header */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="mb-1">
                        {project.name}
                    </h2>

                    <p className="text-muted mb-0">
                        Project Details
                    </p>

                </div>

                <div className="d-flex gap-2">

                    <Link
                        to={`/projects/${id}/edit`}
                        className="btn btn-outline-primary"
                    >
                        <i className="bi bi-pencil me-2"></i>
                        Edit
                    </Link>

                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                            navigate("/projects")
                        }
                    >
                        <i className="bi bi-arrow-left me-2"></i>
                        Back
                    </button>

                </div>

            </div>


            {/* Main Row */}

            <div className="row g-4">


                {/* Project Information */}

                <div className="col-lg-8">

                    <div className="card shadow-sm h-100">

                        <div className="card-header bg-white">

                            <h5 className="mb-0">
                                Project Information
                            </h5>
<ProjectMembers projectId={projectId} />
                        </div>

                        <div className="card-body">

                            <div className="row g-4">


                                {/* Name */}

                                <div className="col-md-6">

                                    <small className="text-muted d-block mb-1">
                                        Project Name
                                    </small>

                                    <div className="fw-semibold">
                                        {project.name}
                                    </div>

                                </div>


                                {/* Status */}

                                <div className="col-md-6">

                                    <small className="text-muted d-block mb-1">
                                        Status
                                    </small>

                                    <span className="badge bg-primary">

                                        {formatStatus(
                                            project.status ||
                                            "active"
                                        )}

                                    </span>

                                </div>


                                {/* Description */}

                                <div className="col-12">

                                    <small className="text-muted d-block mb-1">
                                        Description
                                    </small>

                                    <div>

                                        {project.description ||
                                            "No description available."}

                                    </div>

                                </div>


                                {/* Start Date */}

                                <div className="col-md-6">

                                    <small className="text-muted d-block mb-1">
                                        Start Date
                                    </small>

                                    <div>

                                        {project.start_date
                                            ? String(
                                                  project.start_date
                                              ).substring(
                                                  0,
                                                  10
                                              )
                                            : "-"}

                                    </div>

                                </div>


                                {/* Due Date */}

                                <div className="col-md-6">

                                    <small className="text-muted d-block mb-1">
                                        Due Date
                                    </small>

                                    <div>

                                        {project.due_date
                                            ? String(
                                                  project.due_date
                                              ).substring(
                                                  0,
                                                  10
                                              )
                                            : "-"}

                                    </div>

                                </div>


                                {/* Created */}

                                <div className="col-md-6">

                                    <small className="text-muted d-block mb-1">
                                        Created At
                                    </small>

                                    <div>

                                        {project.created_at
                                            ? String(
                                                  project.created_at
                                              ).substring(
                                                  0,
                                                  10
                                              )
                                            : "-"}

                                    </div>

                                </div>


                                {/* Updated */}

                                <div className="col-md-6">

                                    <small className="text-muted d-block mb-1">
                                        Updated At
                                    </small>

                                    <div>

                                        {project.updated_at
                                            ? String(
                                                  project.updated_at
                                              ).substring(
                                                  0,
                                                  10
                                              )
                                            : "-"}

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* Members */}

                <div className="col-lg-4">

                    <div className="card shadow-sm h-100">

                        <div className="card-header bg-white d-flex justify-content-between align-items-center">

                            <h5 className="mb-0">
                                Members
                            </h5>

                            <Link
                                to={`/projects/${id}/members`}
                                className="btn btn-sm btn-primary"
                            >
                                <i className="bi bi-plus-lg"></i>
                            </Link>

                        </div>

                        <div className="card-body p-0">

                            {members.length === 0 ? (

                                <div className="text-center py-5 px-3">

                                    <i className="bi bi-people fs-1 text-muted"></i>

                                    <p className="text-muted mt-2 mb-3">
                                        No members assigned
                                    </p>

                                    <Link
                                        to={`/projects/${id}/members`}
                                        className="btn btn-sm btn-primary"
                                    >
                                        Add Member
                                    </Link>

                                </div>

                            ) : (

                                <div className="list-group list-group-flush">

                                    {members.map(
                                        (member) => {

                                            const user =
                                                member.user ||
                                                member;

                                            return (

                                                <div
                                                    key={
                                                        user.id
                                                    }
                                                    className="list-group-item"
                                                >

                                                    <div className="d-flex justify-content-between align-items-center">

                                                        <div className="d-flex align-items-center">

                                                            <div
                                                                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                                                                style={{
                                                                    width: "40px",
                                                                    height: "40px",
                                                                }}
                                                            >
                                                                {user.name
                                                                    ?.charAt(
                                                                        0
                                                                    )
                                                                    ?.toUpperCase()}
                                                            </div>

                                                            <div>

                                                                <div className="fw-semibold">
                                                                    {
                                                                        user.name
                                                                    }
                                                                </div>

                                                                <small className="text-muted">
                                                                    {
                                                                        user.email
                                                                    }
                                                                </small>

                                                            </div>

                                                        </div>

                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() =>
                                                                handleRemoveMember(
                                                                    user.id
                                                                )
                                                            }
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>

                                                    </div>

                                                    {member.role && (

                                                        <div className="mt-2">

                                                            <span className="badge bg-light text-dark border">

                                                                {formatStatus(
                                                                    member.role
                                                                )}

                                                            </span>

                                                        </div>

                                                    )}

                                                </div>

                                            );
                                        }
                                    )}

                                </div>

                            )}

                        </div>

                    </div>

                </div>


                {/* Tasks */}

                <div className="col-12">

                    <div className="card shadow-sm">

                        <div className="card-header bg-white d-flex justify-content-between align-items-center">

                            <div>

                                <h5 className="mb-0">
                                    Project Tasks
                                </h5>

                                <small className="text-muted">
                                    {tasks.length}{" "}
                                    {tasks.length === 1
                                        ? "task"
                                        : "tasks"}
                                </small>

                            </div>

                            <Link
                                to={`/tasks/create?project_id=${id}`}
                                className="btn btn-primary btn-sm"
                            >
                                <i className="bi bi-plus-lg me-2"></i>
                                Add Task
                            </Link>

                        </div>

                        <div className="card-body p-0">

                            {tasksLoading ? (

                                <div className="text-center py-5">

                                    <div
                                        className="spinner-border"
                                        role="status"
                                    />

                                    <p className="mt-2 mb-0">
                                        Loading tasks...
                                    </p>

                                </div>

                            ) : tasks.length === 0 ? (

                                <div className="text-center py-5">

                                    <i className="bi bi-list-task fs-1 text-muted"></i>

                                    <h6 className="mt-3">
                                        No Tasks Found
                                    </h6>

                                    <p className="text-muted">
                                        This project doesn't have
                                        any tasks yet.
                                    </p>

                                    <Link
                                        to={`/tasks/create?project_id=${id}`}
                                        className="btn btn-primary"
                                    >
                                        <i className="bi bi-plus-lg me-2"></i>
                                        Create First Task
                                    </Link>

                                </div>

                            ) : (

                                <div className="table-responsive">

                                    <table className="table table-hover align-middle mb-0">

                                        <thead>

                                            <tr>

                                                <th className="ps-4">
                                                    Task
                                                </th>

                                                <th>
                                                    Assigned To
                                                </th>

                                                <th>
                                                    Priority
                                                </th>

                                                <th>
                                                    Status
                                                </th>

                                                <th>
                                                    Due Date
                                                </th>

                                                <th className="text-end pe-4">
                                                    Actions
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {tasks.map(
                                                (task) => (

                                                    <tr
                                                        key={
                                                            task.id
                                                        }
                                                    >

                                                        {/* Task */}

                                                        <td className="ps-4">

                                                            <div className="fw-semibold">
                                                                {
                                                                    task.title
                                                                }
                                                            </div>

                                                            {task.description && (

                                                                <small className="text-muted">

                                                                    {task.description.length >
                                                                    70
                                                                        ? `${task.description.substring(
                                                                              0,
                                                                              70
                                                                          )}...`
                                                                        : task.description}

                                                                </small>

                                                            )}

                                                        </td>


                                                        {/* Assigned */}

                                                        <td>

                                                            {getAssignedUser(
                                                                task
                                                            )}

                                                        </td>


                                                        {/* Priority */}

                                                        <td>

                                                            <span
                                                                className={`badge ${getPriorityClass(
                                                                    task.priority
                                                                )}`}
                                                            >

                                                                {formatStatus(
                                                                    task.priority ||
                                                                    "medium"
                                                                )}

                                                            </span>

                                                        </td>


                                                        {/* Status */}

                                                        <td>

                                                            <span
                                                                className={`badge ${getTaskStatusClass(
                                                                    task.status
                                                                )}`}
                                                            >

                                                                {formatStatus(
                                                                    task.status
                                                                )}

                                                            </span>

                                                        </td>


                                                        {/* Due Date */}

                                                        <td>

                                                            {task.due_date
                                                                ? String(
                                                                      task.due_date
                                                                  ).substring(
                                                                      0,
                                                                      10
                                                                  )
                                                                : "-"}

                                                        </td>


                                                        {/* Actions */}

                                                        <td className="text-end pe-4">

                                                            <Link
                                                                to={`/tasks/${task.id}/edit`}
                                                                className="btn btn-sm btn-outline-primary me-2"
                                                                title="Edit Task"
                                                            >
                                                                <i className="bi bi-pencil"></i>
                                                            </Link>

                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-danger"
                                                                title="Delete Task"
                                                                onClick={() =>
                                                                    handleDeleteTask(
                                                                        task.id
                                                                    )
                                                                }
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                            </button>

                                                        </td>

                                                    </tr>

                                                )
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

export default ProjectDetails;