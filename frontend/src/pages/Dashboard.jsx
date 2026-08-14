function Dashboard() {

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    return (
        <div>

            <h2 className="mb-4">
                Dashboard
            </h2>

            <div className="alert alert-success">
                Welcome, <strong>{user?.name}</strong>
            </div>

            <div className="row g-4">

                <div className="col-md-3">

                    <div className="card shadow-sm">
                        <div className="card-body">

                            <h6>
                                Total Users
                            </h6>

                            <h2>0</h2>

                        </div>
                    </div>

                </div>

                <div className="col-md-3">

                    <div className="card shadow-sm">
                        <div className="card-body">

                            <h6>
                                Projects
                            </h6>

                            <h2>0</h2>

                        </div>
                    </div>

                </div>

                <div className="col-md-3">

                    <div className="card shadow-sm">
                        <div className="card-body">

                            <h6>
                                Tasks
                            </h6>

                            <h2>0</h2>

                        </div>
                    </div>

                </div>

                <div className="col-md-3">

                    <div className="card shadow-sm">
                        <div className="card-body">

                            <h6>
                                Completed
                            </h6>

                            <h2>0</h2>

                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;