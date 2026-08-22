import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getTasks, deleteTask } from "../api/taskApi";


function Tasks() {
const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");

    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, [status, priority]);

    const fetchTasks = async (page = 1) => {

        try {

            setLoading(true);

            const response = await getTasks({
                page,
                status: status || undefined,
                priority: priority || undefined,
            });

            console.log("Tasks Response:", response);

            const data = response?.data;

            if (Array.isArray(data)) {
                setTasks(data);
                setPagination(null);
            } else {
                setTasks(data?.data || []);
                setPagination(data || null);
            }

        } catch (error) {

            console.error(
                "Fetch Tasks Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to load tasks"
            );

            setTasks([]);

        } finally {

            setLoading(false);

        }
    };

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await deleteTask(id);

            toast.success(
                "Task deleted successfully"
            );

            fetchTasks();

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

    const getStatusBadge = (value) => {

        const classes = {
            todo: "bg-secondary",
            in_progress: "bg-primary",
            review: "bg-warning text-dark",
            completed: "bg-success",
        };

        const labels = {
            todo: "Todo",
            in_progress: "In Progress",
            review: "Review",
            completed: "Completed",
        };

        return (
            <span
                className={`badge ${
                    classes[value] ||
                    "bg-secondary"
                }`}
            >
                {labels[value] || value}
            </span>
        );
    };

    const getPriorityBadge = (value) => {

        const classes = {
            low: "bg-secondary",
            medium: "bg-info text-dark",
            high: "bg-warning text-dark",
            urgent: "bg-danger",
        };

        return (
            <span
                className={`badge ${
                    classes[value] ||
                    "bg-secondary"
                }`}
            >
                {value
                    ? value.charAt(0).toUpperCase() +
                      value.slice(1)
                    : "-"}
            </span>
        );
    };

    return (

        <div>

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2 className="mb-1">
                        Tasks
                    </h2>

                    <p className="text-muted mb-0">
                        Manage project tasks
                    </p>
                </div>

                <Link
                    to="/tasks/create"
                    className="btn btn-primary"
                >
                    <i className="bi bi-plus-lg me-2"></i>
                    Add Task
                </Link>


            </div>


            <div className="card shadow-sm">

                <div className="card-body">

                    <div className="row g-3 mb-4">

                        <div className="col-md-4">

                            <select
                                className="form-select"
                                value={status}
                                onChange={(e) =>
                                    setStatus(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    All Status
                                </option>

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

                            <select
                                className="form-select"
                                value={priority}
                                onChange={(e) =>
                                    setPriority(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    All Priority
                                </option>

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

                    </div>


                    {loading ? (

                        <div className="text-center py-5">

                            <div
                                className="spinner-border"
                                role="status"
                            ></div>

                            <p className="mt-2 mb-0">
                                Loading tasks...
                            </p>

                        </div>

                    ) : tasks.length === 0 ? (

                        <div className="text-center py-5">

                            <i className="bi bi-list-task fs-1 text-muted"></i>

                            <h5 className="mt-3">
                                No tasks found
                            </h5>

                            <Link
                                to="/tasks/create"
                                className="btn btn-primary mt-2"
                            >
                                Create Task
                            </Link>

                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="table table-hover align-middle">

                                <thead>

                                    <tr>
                                        <th>#</th>
                                        <th>Task</th>
                                        <th>Project</th>
                                        <th>Assigned To</th>
                                        <th>Status</th>
                                        <th>Priority</th>
                                        <th>Due Date</th>
                                        <th className="text-end">
                                            Action
                                        </th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {tasks.map(
                                        (task, index) => (

                                            <tr
                                                key={
                                                    task.id
                                                }
                                            >

                                                <td>
                                                    {index + 1}
                                                </td>

                                                <td>

                                                    <strong>
                                                        {task.title}
                                                    </strong>

                                                    {task.description && (
                                                        <div className="small text-muted">
                                                            {task.description.length >
                                                            60
                                                                ? task.description.substring(
                                                                      0,
                                                                      60
                                                                  ) +
                                                                  "..."
                                                                : task.description}
                                                        </div>
                                                    )}

                                                </td>

                                                <td>
                                                    {task.project?.name ||
                                                        "-"}
                                                </td>

                                                <td>
                                                    {task.assignee?.name ||
                                                        "Unassigned"}
                                                </td>

                                                <td>
                                                    {getStatusBadge(
                                                        task.status
                                                    )}
                                                </td>

                                                <td>
                                                    {getPriorityBadge(
                                                        task.priority
                                                    )}
                                                </td>

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

                                                <td className="text-end">

                                                    <div className="btn-group">

                                                        <Link
                                                            to={`/tasks/${task.id}/edit`}
                                                            className="btn btn-sm btn-outline-primary"
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    task.id
                                                                )
                                                            }
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                      <button
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => navigate(`/tasks/${task.id}`)}
                                                        >
                                                            View
                                                        </button>

                                                    </div>

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

export default Tasks;