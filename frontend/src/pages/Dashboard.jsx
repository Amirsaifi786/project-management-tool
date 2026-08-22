import { useEffect, useState } from "react";
import dashboardService from "../services/dashboardService";

function Dashboard() {
    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const [dashboard, setDashboard] = useState({
        stats: {
            total_users: 0,
            total_projects: 0,
            total_tasks: 0,
            completed_tasks: 0,
            pending_tasks: 0,
            in_progress_tasks: 0,
            cancelled_tasks: 0,
            my_tasks: 0,
            overdue_tasks: 0,
        },
        recent_projects: [],
        recent_tasks: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);

            const response =
                await dashboardService.getDashboard();

            if (response.success) {
                setDashboard(response.data);
            }
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load dashboard."
            );
        } finally {
            setLoading(false);
        }
    };

    const stats = dashboard.stats;

    return (
        <div>

            <h2 className="mb-4">
                Dashboard
            </h2>

            <div className="alert alert-success">
                Welcome, <strong>{user?.name}</strong>
            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <div className="row g-4">

                <div className="col-md-3">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h6>Total Users</h6>
                            <h2>
                                {loading ? "..." : stats.total_users}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h6>Total Projects</h6>
                            <h2>
                                {loading ? "..." : stats.total_projects}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h6>Total Tasks</h6>
                            <h2>
                                {loading ? "..." : stats.total_tasks}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h6>Completed</h6>
                            <h2>
                                {loading ? "..." : stats.completed_tasks}
                            </h2>
                        </div>
                    </div>
                </div>

            </div>

            <div className="row g-4 mt-1">

                <div className="col-md-3">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h6>Pending Tasks</h6>
                            <h2>
                                {loading ? "..." : stats.pending_tasks}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h6>In Progress</h6>
                            <h2>
                                {loading ? "..." : stats.in_progress_tasks}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h6>My Tasks</h6>
                            <h2>
                                {loading ? "..." : stats.my_tasks}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h6>Overdue</h6>
                            <h2>
                                {loading ? "..." : stats.overdue_tasks}
                            </h2>
                        </div>
                    </div>
                </div>

            </div>

            <div className="row g-4 mt-2">

                <div className="col-md-6">

                    <div className="card shadow-sm">

                        <div className="card-header">
                            <strong>Recent Projects</strong>
                        </div>

                        <div className="card-body p-0">

                            <div className="table-responsive">

                                <table className="table table-hover mb-0">

                                    <thead>
                                        <tr>
                                            <th>Project</th>
                                            <th>Created</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {dashboard.recent_projects.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan="2"
                                                    className="text-center"
                                                >
                                                    No projects found
                                                </td>
                                            </tr>
                                        ) : (
                                            dashboard.recent_projects.map(
                                                (project) => (
                                                    <tr key={project.id}>
                                                        <td>
                                                            {project.name}
                                                        </td>

                                                        <td>
                                                            {new Date(
                                                                project.created_at
                                                            ).toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </div>

                </div>

                <div className="col-md-6">

                    <div className="card shadow-sm">

                        <div className="card-header">
                            <strong>Recent Tasks</strong>
                        </div>

                        <div className="card-body p-0">

                            <div className="table-responsive">

                                <table className="table table-hover mb-0">

                                    <thead>
                                        <tr>
                                            <th>Task</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {dashboard.recent_tasks.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan="2"
                                                    className="text-center"
                                                >
                                                    No tasks found
                                                </td>
                                            </tr>
                                        ) : (
                                            dashboard.recent_tasks.map(
                                                (task) => (
                                                    <tr key={task.id}>
                                                        <td>
                                                            {task.title}
                                                        </td>

                                                        <td>
                                                            <span className="badge bg-secondary">
                                                                {task.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;