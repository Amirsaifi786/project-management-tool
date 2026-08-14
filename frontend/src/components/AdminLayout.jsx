import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../api/authApi";

function AdminLayout() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const handleLogout = async () => {

        try {
            await logout();
        } catch (error) {
            console.error(error);
        }

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <div className="d-flex min-vh-100">

            {/* Sidebar */}

            <aside
                className="bg-dark text-white p-3"
                style={{ width: "250px" }}
            >

                <h4 className="mb-4">
                    Project Manager
                </h4>

                <nav className="nav flex-column gap-2">

                    <NavLink
                        to="/dashboard"
                        className="nav-link text-white"
                    >
                        <i className="bi bi-speedometer2 me-2"></i>
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/users"
                        className="nav-link text-white"
                    >
                        <i className="bi bi-people me-2"></i>
                        Users
                    </NavLink>

                    <NavLink
                        to="/projects"
                        className="nav-link text-white"
                    >
                        <i className="bi bi-kanban me-2"></i>
                        Projects
                    </NavLink>

                    <NavLink
                        to="/tasks"
                        className="nav-link text-white"
                    >
                        <i className="bi bi-check2-square me-2"></i>
                        Tasks
                    </NavLink>

                </nav>

            </aside>

            {/* Main */}

            <div className="flex-grow-1 bg-light">

                <header className="bg-white border-bottom p-3">

                    <div className="d-flex justify-content-between">

                        <h5 className="mb-0">
                            Admin Panel
                        </h5>

                        <div>

                            <span className="me-3">
                                {user?.name}
                            </span>

                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>

                        </div>

                    </div>

                </header>

                <main className="p-4">

                    <Outlet />

                </main>

            </div>

        </div>
    );
}

export default AdminLayout;