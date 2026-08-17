import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { createTask } from "../api/taskApi";
import { getProjects } from "../api/projectApi";
import { getUsers } from "../api/userApi";

function TaskCreate() {

    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        project_id: "",
        title: "",
        description: "",
        assigned_to: "",
        status: "todo",
        priority: "medium",
        start_date: "",
        due_date: "",
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {

        try {

            setLoading(true);

            const [
                projectResponse,
                userResponse,
            ] = await Promise.all([
                getProjects(),
                getUsers(),
            ]);

            const projectData =
                projectResponse?.data;

            const userData =
                userResponse?.data;

            setProjects(
                Array.isArray(projectData)
                    ? projectData
                    : projectData?.data || []
            );

            setUsers(
                Array.isArray(userData)
                    ? userData
                    : userData?.data || []
            );

        } catch (error) {

            console.error(error);

            toast.error(
                "Failed to load projects or users"
            );

        } finally {

            setLoading(false);

        }
    };

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!form.project_id) {
            toast.error(
                "Please select a project"
            );
            return;
        }

        if (!form.title.trim()) {
            toast.error(
                "Task title is required"
            );
            return;
        }

        try {

            setSaving(true);

            await createTask({
                ...form,
                assigned_to:
                    form.assigned_to || null,
                start_date:
                    form.start_date || null,
                due_date:
                    form.due_date || null,
            });

            toast.success(
                "Task created successfully"
            );

            navigate("/tasks");

        } catch (error) {

            console.error(
                "Create Task Error:",
                error
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
                    "Task creation failed"
                );

            }

        } finally {

            setSaving(false);

        }
    };

    if (loading) {

        return (
            <div className="text-center py-5">

                <div
                    className="spinner-border"
                    role="status"
                ></div>

                <p className="mt-2">
                    Loading...
                </p>

            </div>
        );
    }

    return (

        <div>

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2>
                        Create Task
                    </h2>

                    <p className="text-muted mb-0">
                        Create a new project task
                    </p>
                </div>

                <button
                    className="btn btn-outline-secondary"
                    onClick={() =>
                        navigate("/tasks")
                    }
                >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back
                </button>

            </div>


            <div className="card shadow-sm">

                <div className="card-body">

                    <form onSubmit={handleSubmit}>

                        <div className="row g-3">

                            <div className="col-md-6">

                                <label className="form-label">
                                    Project
                                    <span className="text-danger">
                                        *
                                    </span>
                                </label>

                                <select
                                    name="project_id"
                                    className="form-select"
                                    value={
                                        form.project_id
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Project
                                    </option>

                                    {projects.map(
                                        (project) => (
                                            <option
                                                key={
                                                    project.id
                                                }
                                                value={
                                                    project.id
                                                }
                                            >
                                                {
                                                    project.name
                                                }
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>


                            <div className="col-md-6">

                                <label className="form-label">
                                    Assigned To
                                </label>

                                <select
                                    name="assigned_to"
                                    className="form-select"
                                    value={
                                        form.assigned_to
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <option value="">
                                        Unassigned
                                    </option>

                                    {users.map(
                                        (user) => (
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


                            <div className="col-12">

                                <label className="form-label">
                                    Task Title
                                    <span className="text-danger">
                                        *
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    className="form-control"
                                    placeholder="Enter task title"
                                    value={
                                        form.title
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>


                            <div className="col-12">

                                <label className="form-label">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    className="form-control"
                                    rows="5"
                                    placeholder="Enter task description"
                                    value={
                                        form.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>


                            <div className="col-md-4">

                                <label className="form-label">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    className="form-select"
                                    value={
                                        form.status
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <option value="todo">
                                        Todo
                                    </option>

                                    <option value="in_progress">
                                        In Progress
                                    </option>

                                    <option value="review">
                                        Review
                                    </option>

                                    <option value="completed">
                                        Completed
                                    </option>

                                </select>

                            </div>


                            <div className="col-md-4">

                                <label className="form-label">
                                    Priority
                                </label>

                                <select
                                    name="priority"
                                    className="form-select"
                                    value={
                                        form.priority
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <option value="low">
                                        Low
                                    </option>

                                    <option value="medium">
                                        Medium
                                    </option>

                                    <option value="high">
                                        High
                                    </option>

                                    <option value="urgent">
                                        Urgent
                                    </option>

                                </select>

                            </div>


                            <div className="col-md-4">

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


                        <div className="d-flex justify-content-end gap-2 mt-4">

                            <button
                                type="button"
                                className="btn btn-light"
                                onClick={() =>
                                    navigate(
                                        "/tasks"
                                    )
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={saving}
                            >

                                {saving
                                    ? "Creating..."
                                    : "Create Task"}

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default TaskCreate;