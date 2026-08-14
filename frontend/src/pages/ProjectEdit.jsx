import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
    getProject,
    updateProject,
} from "../api/projectApi";

function ProjectEdit() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        name: "",
        description: "",
        status: "planning",
        start_date: "",
        due_date: "",
    });

    // =========================
    // Load Project
    // =========================

    useEffect(() => {
        fetchProject();
    }, [id]);

    const fetchProject = async () => {

        try {

            setLoading(true);

            const response = await getProject(id);

            console.log(
                "Project Response:",
                response
            );

            const project =
                response?.data?.data ??
                response?.data ??
                response;

            setForm({
                name: project.name || "",
                description:
                    project.description || "",
                status:
                    project.status || "planning",

                start_date:
                    project.start_date
                        ? project.start_date.substring(0, 10)
                        : "",

                due_date:
                    project.due_date
                        ? project.due_date.substring(0, 10)
                        : "",
            });

        } catch (error) {

            console.error(
                "Fetch Project Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Project load failed"
            );

            navigate("/projects");

        } finally {

            setLoading(false);

        }
    };


    // =========================
    // Input Change
    // =========================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

    };


    // =========================
    // Update Project
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!form.name.trim()) {

            toast.error(
                "Project name is required"
            );

            return;
        }

        try {

            setSaving(true);

            console.log(
                "Updating Project:",
                id
            );

            console.log(
                "Update Data:",
                form
            );

            await updateProject(
                id,
                form
            );

            toast.success(
                "Project updated successfully"
            );

            navigate("/projects");

        } catch (error) {

            console.error(
                "Update Project Error:",
                error
            );

            console.error(
                "Response:",
                error.response?.data
            );

            const errors =
                error.response?.data?.errors;

            if (errors) {

                Object.values(errors).forEach(
                    (messages) => {

                        messages.forEach(
                            (message) => {

                                toast.error(
                                    message
                                );

                            }
                        );

                    }
                );

            } else {

                toast.error(
                    error.response?.data?.message ||
                    "Project update failed"
                );

            }

        } finally {

            setSaving(false);

        }
    };


    // =========================
    // Loading
    // =========================

    if (loading) {

        return (
            <div className="text-center p-5">

                <div
                    className="spinner-border"
                    role="status"
                ></div>

                <p className="mt-2">
                    Loading project...
                </p>

            </div>
        );

    }


    return (

        <div>

            {/* Header */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="mb-1">
                        Edit Project
                    </h2>

                    <p className="text-muted mb-0">
                        Update project information
                    </p>

                </div>

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


            {/* Form */}

            <div className="card shadow-sm">

                <div className="card-body">

                    <form
                        onSubmit={handleSubmit}
                    >

                        <div className="row g-3">

                            {/* Name */}

                            <div className="col-md-8">

                                <label className="form-label">
                                    Project Name
                                    <span className="text-danger">
                                        *
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={form.name}
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>


                            {/* Status */}

                            <div className="col-md-4">

                                <label className="form-label">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    className="form-select"
                                    value={form.status}
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <option value="planning">
                                        Planning
                                    </option>

                                    <option value="active">
                                        Active
                                    </option>

                                    <option value="on_hold">
                                        On Hold
                                    </option>

                                    <option value="completed">
                                        Completed
                                    </option>

                                    <option value="cancelled">
                                        Cancelled
                                    </option>

                                </select>

                            </div>


                            {/* Description */}

                            <div className="col-12">

                                <label className="form-label">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    rows="5"
                                    className="form-control"
                                    value={
                                        form.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>


                            {/* Start Date */}

                            <div className="col-md-6">

                                <label className="form-label">
                                    Start Date
                                </label>

                                <input
                                    type="date"
                                    name="start_date"
                                    className="form-control"
                                    value={
                                        form.start_date
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>


                            {/* Due Date */}

                            <div className="col-md-6">

                                <label className="form-label">
                                    Due Date
                                </label>

                                <input
                                    type="date"
                                    name="due_date"
                                    className="form-control"
                                    value={
                                        form.due_date
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>

                        </div>


                        {/* Buttons */}

                        <div className="d-flex justify-content-end gap-2 mt-4">

                            <button
                                type="button"
                                className="btn btn-light"
                                onClick={() =>
                                    navigate(
                                        "/projects"
                                    )
                                }
                                disabled={saving}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={saving}
                            >

                                {saving ? (

                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                        ></span>

                                        Updating...
                                    </>

                                ) : (

                                    <>
                                        <i className="bi bi-check-lg me-2"></i>

                                        Update Project
                                    </>

                                )}

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>

    );
}

export default ProjectEdit;