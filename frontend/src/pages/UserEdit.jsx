import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
    getUser,
    updateUser,
    assignRole,
} from "../api/userApi";

function UserEdit() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
    });

    useEffect(() => {
        loadUser();
    }, [id]);

    const loadUser = async () => {

        try {

            const response = await getUser(id);

            console.log("User:", response);

            const user =
                response?.data?.data ||
                response?.data ||
                response;

            setForm({
                name: user.name || "",
                email: user.email || "",
                password: "",
                password_confirmation: "",
                role: user.roles?.[0]?.name || "",
            });

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Unable to load user"
            );

            navigate("/users");

        } finally {

            setLoading(false);

        }
    };

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

    };

const handleSubmit = async (e) => {
    e.preventDefault();

    if (
        form.password &&
        form.password !== form.password_confirmation
    ) {
        toast.error("Passwords do not match");
        return;
    }

    try {
        setSaving(true);

        // User basic information
        const data = {
            name: form.name,
            email: form.email,
        };

        // Password only if entered
        if (form.password) {
            data.password = form.password;
            data.password_confirmation =
                form.password_confirmation;
        }

        console.log("UPDATE USER ID:", id);
        console.log("UPDATE DATA:", data);

        // Update user
        const updateResponse = await updateUser(id, data);

        console.log(
            "UPDATE RESPONSE:",
            updateResponse
        );

        // Update role separately
        if (form.role) {
            const roleResponse = await assignRole(
                id,
                form.role
            );

            console.log(
                "ROLE RESPONSE:",
                roleResponse
            );
        }

        toast.success("User updated successfully");

        navigate("/users");

    } catch (error) {

        console.error(
            "UPDATE USER ERROR:",
            error
        );

        console.error(
            "STATUS:",
            error.response?.status
        );

        console.error(
            "RESPONSE:",
            error.response?.data
        );

        const errors =
            error.response?.data?.errors;

        if (errors) {

            Object.values(errors).forEach(
                (messages) => {

                    messages.forEach(
                        (message) => {
                            toast.error(message);
                        }
                    );

                }
            );

        } else {

            toast.error(
                error.response?.data?.message ||
                "User update failed"
            );

        }

    } finally {

        setSaving(false);

    }
};

    if (loading) {
        return (
            <div className="text-center p-5">
                <div className="spinner-border"></div>
            </div>
        );
    }

    return (
        <div>

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2>Edit User</h2>

                    <p className="text-muted">
                        Update user information
                    </p>

                </div>

                <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/users")}
                >
                    Back
                </button>

            </div>

            <div className="card shadow-sm">

                <div className="card-body">

                    <form onSubmit={handleSubmit}>

                        <div className="row">

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Leave blank to keep current password"
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Confirm Password
                                </label>

                                <input
                                    type="password"
                                    name="password_confirmation"
                                    className="form-control"
                                    value={form.password_confirmation}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Role
                                </label>

                                <select
                                    name="role"
                                    className="form-select"
                                    value={form.role}
                                    onChange={handleChange}
                                >

                                    <option value="">
                                        Select Role
                                    </option>

                                    <option value="Admin">
                                        Admin
                                    </option>

                                    <option value="PM">
                                        PM
                                    </option>

                                    <option value="Developer">
                                        Developer
                                    </option>

                                    <option value="QA">
                                        QA
                                    </option>

                                </select>

                            </div>

                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={saving}
                        >
                            {saving
                                ? "Updating..."
                                : "Update User"
                            }
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default UserEdit;