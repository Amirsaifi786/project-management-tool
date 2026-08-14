import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { createUser } from "../api/userApi";

function UserCreate() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.password_confirmation) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            await createUser(form);

            toast.success("User created successfully");

            navigate("/users");

        } catch (error) {
            console.error(error);

            const errors = error.response?.data?.errors;

            if (errors) {
                Object.values(errors).forEach((messages) => {
                    messages.forEach((message) => {
                        toast.error(message);
                    });
                });
            } else {
                toast.error(
                    error.response?.data?.message ||
                    "User creation failed"
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div>

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2>Create User</h2>
                    <p className="text-muted">
                        Add a new system user
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
                                    Password
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
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
                                    required
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
                                    required
                                >

                                    <option value="">
                                        Select Role
                                    </option>

                                    <option value="Admin">
                                        Admin
                                    </option>

                                    <option value="Project Manager">
                                        Project Manager
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
                            disabled={loading}
                        >
                            {loading
                                ? "Creating..."
                                : "Create User"
                            }
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default UserCreate;