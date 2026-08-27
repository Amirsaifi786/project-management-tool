import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";

function Login() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError("");

        try {

            const response = await login(form);

            console.log("Login Response:", response);

            // Save token
            localStorage.setItem(
                "token",
                response.token
            );

            // Save user
            localStorage.setItem(
                "user",
                JSON.stringify(response.user)
            );

            // Dashboard
            navigate("/dashboard");

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Invalid email or password"
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="login-page">
            <section className="login-visual">
                <div className="brand"><span className="brand-mark">P</span>Projectly</div>
                <div className="login-copy">
                    <h1>Make every project move forward.</h1>
                    <p>Plan work, bring your team together, and stay on top of every important detail in one calm workspace.</p>
                </div>
            </section>
            <section className="login-panel">
                <div className="login-card">
                    <div className="login-logo"><span className="brand-mark me-2 d-inline-grid">P</span>Projectly</div>
                    <div className="mb-4">
                        <h2 className="mb-2">Welcome back</h2>
                        <p className="text-muted mb-0">Sign in to continue to your workspace.</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">

                            <label className="form-label">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="Enter email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="mb-3">

                            <label className="form-label">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                placeholder="Enter password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading}
                        >

                            {loading
                                ? "Logging in..."
                                : "Login"
                            }

                        </button>

                    </form>

                </div>
            </section>

        </div>
    );
}

export default Login;
