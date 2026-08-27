import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../api/authApi";

function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const initial =
    user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

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

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const nav = [
    ["/dashboard", "bi-grid-1x2", "Dashboard"],
    ["/projects", "bi-folder2-open", "Projects"],
    ["/tasks", "bi-check2-square", "Tasks"],
    ["/users", "bi-people", "Team members"],
  ];

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <div
          className="mobile-sidebar-overlay"
          onClick={closeSidebar}
        ></div>
      )}

      <aside
        className={`app-sidebar ${
          sidebarOpen ? "mobile-sidebar-open" : ""
        }`}
      >
        <div className="brand">
          <span className="brand-mark">P</span>
          <span className="brand-text">Projectly</span>

          <button
            type="button"
            className="mobile-sidebar-close"
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="sidebar-label">
          Workspace
        </div>

        <nav className="nav flex-column">
          {nav.map(([to, icon, label]) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeSidebar}
              className="nav-link"
            >
              <i className={`bi ${icon} me-2`}></i>
              <span className="nav-text">
                {label}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-user">
          <span className="user-avatar">
            {initial}
          </span>

          <div>
            <strong>
              {user?.name || "Workspace user"}
            </strong>

            <small>Signed in</small>
          </div>
        </div>
      </aside>

      <section className="app-content">
        <header className="app-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-menu-button"
              onClick={() =>
                setSidebarOpen(true)
              }
              aria-label="Open menu"
            >
              <i className="bi bi-list"></i>
            </button>

            <div className="app-topbar-title">
              My workspace
            </div>
          </div>

          <div className="topbar-actions">
            <button
              className="topbar-icon"
              aria-label="Notifications"
            >
              <i className="bi bi-bell"></i>
            </button>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              <span>Sign out</span>
            </button>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </section>
    </div>
  );
}

export default AdminLayout;
