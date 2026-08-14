import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { createProject } from "../api/projectApi";

function ProjectCreate() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        description: "",
        status: "planning",
        start_date: "",
        due_date: "",
    });

    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            toast.error("Project name is required");
            return;
        }

        try {
            setSaving(true);

            await createProject(form);

            toast.success(
                "Project created successfully"
            );

            navigate("/projects");

        } catch (error) {
            console.error(
                "Create Project Error:",
                error
            );

            const errors =
                error.response?.data?.errors;

            if (errors) {
                Object.values(errors).forEach(
                    (messages) => {
                        messages.forEach((message) => {
                            toast.error(message);
                        });
                    }
                );
            } else {
                toast.error(
                    error.response?.data?.message ||
                    "Project creation failed"
                );
            }

        } finally {
            setSaving(false);
        }
    };

    return (
        <div>

            {/* Header */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2 className="mb-1">
                        Create Project
                    </h2>

                    <p className="text-muted mb-0">
                        Create a new project
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/projects")}
                >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back
                </button>

            </div>


            {/* Form */}

            <div className="card shadow-sm">

                <div className="card-body">

                    <form onSubmit={handleSubmit}>

                        <div className="row g-3">

                            {/* Project Name */}

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
                                    placeholder="Enter project name"
                                    value={form.name}
                                    onChange={handleChange}
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
                                    onChange={handleChange}
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
                                    className="form-control"
                                    rows="5"
                                    placeholder="Enter project description"
                                    value={form.description}
                                    onChange={handleChange}
                                ></textarea>

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
                                    value={form.start_date}
                                    onChange={handleChange}
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
                                    value={form.due_date}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>


                        {/* Buttons */}

                        <div className="d-flex justify-content-end gap-2 mt-4">

                            <button
                                type="button"
                                className="btn btn-light"
                                onClick={() =>
                                    navigate("/projects")
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

                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check-lg me-2"></i>
                                        Create Project
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

export default ProjectCreate;