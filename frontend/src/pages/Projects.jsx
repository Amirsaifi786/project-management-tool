import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
    getProjects,
    deleteProject,
} from "../api/projectApi";

function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchProjects = async () => {
        try {
            setLoading(true);

            const response = await getProjects();

            console.log("Projects API:", response);

            // Laravel pagination:
            // response.data.data
            let data =
                response?.data?.data ??
                response?.data ??
                response;

            if (!Array.isArray(data)) {
                data = [];
            }

            setProjects(data);

        } catch (error) {
            console.error("Projects Error:", error);

            toast.error(
                error.response?.data?.message ||
                "Projects load nahi ho rahe"
            );

            setProjects([]);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this project?"
        );

        if (!confirmed) return;

        try {
            await deleteProject(id);

            toast.success(
                "Project deleted successfully"
            );

            fetchProjects();

        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Project delete failed"
            );
        }
    };

    const filteredProjects = projects.filter((project) =>
        project.name
            ?.toLowerCase()
            .includes(search.toLowerCase())
    );

    const getStatusClass = (status) => {
        switch (status) {
            case "active":
                return "bg-success";

            case "completed":
                return "bg-primary";

            case "planning":
                return "bg-warning text-dark";

            case "on_hold":
                return "bg-secondary";

            case "cancelled":
                return "bg-danger";

            default:
                return "bg-secondary";
        }
    };

    return (
        <div>

            {/* Header */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2 className="mb-1">
                        Projects
                    </h2>

                    <p className="text-muted mb-0">
                        Manage your projects
                    </p>
                </div>

                <Link
                    to="/projects/create"
                    className="btn btn-primary"
                >
                    <i className="bi bi-plus-lg me-2"></i>
                    Add Project
                </Link>

            </div>

            {/* Search */}

            <div className="card shadow-sm mb-4">

                <div className="card-body">

                    <div className="row">

                        <div className="col-md-5">

                            <div className="input-group">

                                <span className="input-group-text">
                                    <i className="bi bi-search"></i>
                                </span>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search project..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* Projects */}

            <div className="card shadow-sm">

                <div className="card-body p-0">

                    {loading ? (

                        <div className="text-center p-5">

                            <div
                                className="spinner-border"
                                role="status"
                            ></div>

                            <p className="mt-2 mb-0">
                                Loading projects...
                            </p>

                        </div>

                    ) : filteredProjects.length === 0 ? (

                        <div className="text-center p-5">

                            <i
                                className="bi bi-kanban fs-1 text-muted"
                            ></i>

                            <h5 className="mt-3">
                                No projects found
                            </h5>

                            <p className="text-muted">
                                Create your first project.
                            </p>

                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="table table-hover align-middle mb-0">

                                <thead className="table-light">

                                    <tr>

                                        <th>#</th>

                                        <th>
                                            Project
                                        </th>

                                        <th>
                                            Creator
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Start Date
                                        </th>

                                        <th>
                                            Due Date
                                        </th>

                                        <th>
                                            Members
                                        </th>

                                        <th className="text-end">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredProjects.map(
                                        (project, index) => (

                                            <tr
                                                key={
                                                    project.id
                                                }
                                            >

                                                <td>
                                                    {index + 1}
                                                </td>

                                                <td>

                                                    <strong>
                                                        {
                                                            project.name
                                                        }
                                                    </strong>

                                                    {project.description && (

                                                        <div
                                                            className="text-muted small text-truncate"
                                                            style={{
                                                                maxWidth:
                                                                    "250px",
                                                            }}
                                                        >
                                                            {
                                                                project.description
                                                            }
                                                        </div>

                                                    )}

                                                </td>

                                                <td>

                                                    {
                                                        project
                                                            .creator
                                                            ?.name ||
                                                        "-"
                                                    }

                                                </td>

                                                <td>

                                                    <span
                                                        className={`badge ${getStatusClass(
                                                            project.status
                                                        )}`}
                                                    >
                                                        {
                                                            project.status
                                                        }
                                                    </span>

                                                </td>

                                                <td>
                                                    {project.start_date
                                                        ? new Date(
                                                              project.start_date
                                                          ).toLocaleDateString()
                                                        : "-"}
                                                </td>

                                                <td>
                                                    {project.due_date
                                                        ? new Date(
                                                              project.due_date
                                                          ).toLocaleDateString()
                                                        : "-"}
                                                </td>

                                                <td>

                                                    <span className="badge bg-info text-dark">

                                                        {project.members
                                                            ?.length ||
                                                            0}

                                                    </span>

                                                </td>

                                                <td className="text-end">

                                                    <Link
                                                        to={`/projects/${project.id}`}
                                                        className="btn btn-sm btn-outline-secondary me-1"
                                                        title="View"
                                                    >
                                                        <i className="bi bi-eye"></i>
                                                    </Link>

                                                    <Link
                                                        to={`/projects/${project.id}/edit`}
                                                        className="btn btn-sm btn-outline-primary me-1"
                                                        title="Edit"
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </Link>

                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        title="Delete"
                                                        onClick={() =>
                                                            handleDelete(
                                                                project.id
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
    );
}

export default Projects;