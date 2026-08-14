import {
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";

import AdminLayout from "../components/AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute";

import Users from "../pages/Users";
import UserCreate from "../pages/UserCreate";
import UserEdit from "../pages/UserEdit";
import Projects from "../pages/Projects";
import ProjectCreate from "../pages/ProjectCreate";
import ProjectEdit from "../pages/ProjectEdit";

function Tasks() {
    return <h2>Tasks</h2>;
}


function AppRoutes() {

    return (

        <Routes>

            {/* =========================
                PUBLIC ROUTES
            ========================== */}

            <Route
                path="/login"
                element={<Login />}
            />


            {/* =========================
                PROTECTED ROUTES
            ========================== */}

            <Route element={<ProtectedRoute />}>

                <Route element={<AdminLayout />}>

                    {/* Dashboard */}

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />


                    {/* =====================
                        USERS
                    ====================== */}

                    <Route
                        path="/users"
                        element={<Users />}
                    />

                    {/* Add User */}

                    <Route
                        path="/users/create"
                        element={<UserCreate />}
                    />

                    {/* Edit User */}

                    <Route
                        path="/users/:id/edit"
                        element={<UserEdit />}
                    />


                    {/* =====================
                        PROJECTS
                    ====================== */}

                  <Route
                    path="/projects"
                    element={<Projects />}
                />


<Route
    path="/projects/create"
    element={<ProjectCreate />}
/>
<Route
    path="/projects/:id/edit"
    element={<ProjectEdit />}
/>
                    {/* =====================
                        TASKS
                    ====================== */}

                    <Route
                        path="/tasks"
                        element={<Tasks />}
                    />


                </Route>

            </Route>


            {/* =========================
                FALLBACK
            ========================== */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/dashboard"
                        replace
                    />
                }
            />

        </Routes>

    );
}

export default AppRoutes;