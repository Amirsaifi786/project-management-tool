import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const TaskDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchTask();
    }, [id]);

    const fetchTask = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(`/tasks/${id}`);

            const data = response.data?.data || response.data;

            setTask(data);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load task details."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files || []);

        setSelectedFiles(files);
        setError("");
        setSuccess("");
    };

    const handleUpload = async () => {
        if (!selectedFiles.length) {
            setError("Please select at least one file.");
            return;
        }

        try {
            setUploading(true);
            setError("");
            setSuccess("");

            const formData = new FormData();

            selectedFiles.forEach((file) => {
                formData.append("files[]", file);
            });

            const response = await api.post(
                `/tasks/${id}/attachments`,
                formData,
                {
                    headers: {
                        "Content-Type": undefined,
                    },
                }
            );

            setTask((prev) => ({
                ...prev,
                attachments: response.data.attachments || [],
            }));

            setSelectedFiles([]);
            setSuccess("Files uploaded successfully.");

            document.getElementById("taskFileInput").value = "";
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to upload files."
            );
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (attachmentId) => {
        if (!window.confirm("Are you sure you want to delete this file?")) {
            return;
        }

        try {
            setDeleting(attachmentId);
            setError("");
            setSuccess("");

            const response = await api.delete(
                `/tasks/${id}/attachments/${attachmentId}`
            );

            setTask((prev) => ({
                ...prev,
                attachments: response.data.attachments || [],
            }));

            setSuccess("File deleted successfully.");
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to delete file."
            );
        } finally {
            setDeleting(null);
        }
    };

    const handleDownload = async (attachment) => {
        try {
            setError("");

            const response = await api.get(
                `/tasks/${id}/attachments/${attachment.id}/download`,
                {
                    responseType: "blob",
                }
            );

            const blob = new Blob(
                [response.data],
                {
                    type:
                        response.headers["content-type"] ||
                        attachment.type ||
                        "application/octet-stream",
                }
            );

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = attachment.name;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to download file."
            );
        }
    };

    const formatFileSize = (bytes) => {
        if (!bytes || bytes === 0) {
            return "0 Bytes";
        }

        const sizes = [
            "Bytes",
            "KB",
            "MB",
            "GB",
        ];

        const index = Math.floor(
            Math.log(bytes) / Math.log(1024)
        );

        return (
            parseFloat(
                (bytes / Math.pow(1024, index)).toFixed(2)
            ) +
            " " +
            sizes[index]
        );
    };

    const getFileIcon = (extension) => {
        const ext = extension?.toLowerCase();

        if (
            [
                "jpg",
                "jpeg",
                "png",
                "gif",
                "webp",
            ].includes(ext)
        ) {
            return "🖼️";
        }

        if (ext === "pdf") {
            return "📕";
        }

        if (
            [
                "doc",
                "docx",
            ].includes(ext)
        ) {
            return "📘";
        }

        if (
            [
                "xls",
                "xlsx",
                "csv",
            ].includes(ext)
        ) {
            return "📊";
        }

        if (
            [
                "ppt",
                "pptx",
            ].includes(ext)
        ) {
            return "📙";
        }

        if (ext === "zip") {
            return "🗜️";
        }

        if (ext === "txt") {
            return "📄";
        }

        return "📎";
    };

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case "completed":
            case "done":
                return "bg-success";

            case "in progress":
            case "in_progress":
                return "bg-primary";

            case "pending":
            case "todo":
                return "bg-warning text-dark";

            case "cancelled":
            case "canceled":
                return "bg-danger";

            default:
                return "bg-secondary";
        }
    };

    const getPriorityClass = (priority) => {
        switch (priority?.toLowerCase()) {
            case "high":
            case "urgent":
                return "text-danger";

            case "medium":
                return "text-warning";

            case "low":
                return "text-success";

            default:
                return "text-muted";
        }
    };

    if (loading) {
        return (
            <div className="container-fluid py-4">
                <div className="text-center py-5">
                    <div
                        className="spinner-border text-primary"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>

                    <div className="mt-3">
                        Loading task details...
                    </div>
                </div>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="container-fluid py-4">
                <div className="alert alert-danger">
                    {error || "Task not found."}
                </div>

                <button
                    className="btn btn-secondary"
                    onClick={() => navigate(-1)}
                >
                    Back
                </button>
            </div>
        );
    }

    const attachments = task.attachments || [];

    return (
        <div className="container-fluid py-4">

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <button
                        className="btn btn-outline-secondary btn-sm mb-3"
                        onClick={() => navigate(-1)}
                    >
                        ← Back
                    </button>

                    <h2 className="mb-1">
                        {task.title}
                    </h2>

                    <p className="text-muted mb-0">
                        Task Details
                    </p>
                </div>

                <div className="d-flex gap-2">

                    {task.status && (
                        <span
                            className={`badge ${getStatusClass(
                                task.status
                            )} px-3 py-2`}
                        >
                            {task.status}
                        </span>
                    )}

                    {task.priority && (
                        <span
                            className={`badge bg-light ${getPriorityClass(
                                task.priority
                            )} px-3 py-2`}
                        >
                            {task.priority}
                        </span>
                    )}

                </div>

            </div>

            {/* Alerts */}

            {error && (
                <div className="alert alert-danger alert-dismissible">
                    {error}

                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setError("")}
                    ></button>
                </div>
            )}

            {success && (
                <div className="alert alert-success alert-dismissible">
                    {success}

                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setSuccess("")}
                    ></button>
                </div>
            )}

            <div className="row">

                {/* Main Task Details */}

                <div className="col-lg-8">

                    <div className="card shadow-sm mb-4">

                        <div className="card-header">
                            <h5 className="mb-0">
                                Task Information
                            </h5>
                        </div>

                        <div className="card-body">

                            <div className="mb-4">
                                <label className="fw-semibold mb-2">
                                    Description
                                </label>

                                <div className="text-muted">
                                    {task.description ? (
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    task.description,
                                            }}
                                        />
                                    ) : (
                                        "No description available."
                                    )}
                                </div>
                            </div>

                        </div>

                    </div>


                    {/* Attachments */}

                    <div className="card shadow-sm mb-4">

                        <div className="card-header d-flex justify-content-between align-items-center">

                            <div>
                                <h5 className="mb-1">
                                    Task Attachments
                                </h5>

                                <small className="text-muted">
                                    Upload images, PDF and documents
                                </small>
                            </div>

                            <label
                                htmlFor="taskFileInput"
                                className="btn btn-primary"
                            >
                                📎 Select Files
                            </label>

                            <input
                                id="taskFileInput"
                                type="file"
                                multiple
                                hidden
                                accept="
                                    .jpg,
                                    .jpeg,
                                    .png,
                                    .gif,
                                    .webp,
                                    .pdf,
                                    .doc,
                                    .docx,
                                    .xls,
                                    .xlsx,
                                    .ppt,
                                    .pptx,
                                    .txt,
                                    .csv,
                                    .zip
                                "
                                onChange={handleFileSelect}
                            />

                        </div>

                        <div className="card-body">

                            {/* Selected Files */}

                            {selectedFiles.length > 0 && (
                                <div className="mb-4">

                                    <h6>
                                        Selected Files
                                    </h6>

                                    <div className="border rounded">

                                        {selectedFiles.map(
                                            (file, index) => (
                                                <div
                                                    key={index}
                                                    className="d-flex justify-content-between align-items-center p-3 border-bottom"
                                                >

                                                    <div className="d-flex align-items-center gap-3">

                                                        <span
                                                            style={{
                                                                fontSize:
                                                                    "28px",
                                                            }}
                                                        >
                                                            {getFileIcon(
                                                                file.name
                                                                    .split(
                                                                        "."
                                                                    )
                                                                    .pop()
                                                            )}
                                                        </span>

                                                        <div>
                                                            <div className="fw-semibold">
                                                                {
                                                                    file.name
                                                                }
                                                            </div>

                                                            <small className="text-muted">
                                                                {formatFileSize(
                                                                    file.size
                                                                )}
                                                            </small>
                                                        </div>

                                                    </div>

                                                </div>
                                            )
                                        )}

                                    </div>

                                    <div className="mt-3">

                                        <button
                                            type="button"
                                            className="btn btn-success"
                                            onClick={handleUpload}
                                            disabled={uploading}
                                        >
                                            {uploading ? (
                                                <>
                                                    <span
                                                        className="spinner-border spinner-border-sm me-2"
                                                    ></span>

                                                    Uploading...
                                                </>
                                            ) : (
                                                <>
                                                    ⬆ Upload Files
                                                </>
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary ms-2"
                                            onClick={() => {
                                                setSelectedFiles(
                                                    []
                                                );

                                                document.getElementById(
                                                    "taskFileInput"
                                                ).value = "";
                                            }}
                                            disabled={uploading}
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                </div>
                            )}


                            {/* Existing Attachments */}

                            <div>

                                <div className="d-flex justify-content-between align-items-center mb-3">

                                    <h6 className="mb-0">
                                        Uploaded Files
                                    </h6>

                                    <span className="badge bg-secondary">
                                        {attachments.length} Files
                                    </span>

                                </div>

                                {attachments.length === 0 ? (

                                    <div className="text-center py-5 border rounded">

                                        <div
                                            style={{
                                                fontSize: "45px",
                                            }}
                                        >
                                            📎
                                        </div>

                                        <h6 className="mt-3">
                                            No files attached
                                        </h6>

                                        <p className="text-muted mb-3">
                                            Upload files using the
                                            Select Files button above.
                                        </p>

                                    </div>

                                ) : (

                                    <div className="list-group">

                                        {attachments.map(
                                            (attachment) => (
                                                <div
                                                    key={
                                                        attachment.id
                                                    }
                                                    className="list-group-item"
                                                >

                                                    <div className="d-flex justify-content-between align-items-center">

                                                        <div className="d-flex align-items-center gap-3">

                                                            <div
                                                                style={{
                                                                    fontSize:
                                                                        "35px",
                                                                }}
                                                            >
                                                                {getFileIcon(
                                                                    attachment.extension
                                                                )}
                                                            </div>

                                                            <div>

                                                                <div className="fw-semibold">
                                                                    {
                                                                        attachment.name
                                                                    }
                                                                </div>

                                                                <small className="text-muted">

                                                                    {attachment.extension?.toUpperCase()}

                                                                    {" • "}

                                                                    {formatFileSize(
                                                                        attachment.size
                                                                    )}

                                                                </small>

                                                            </div>

                                                        </div>


                                                        <div className="d-flex gap-2">

                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-primary"
                                                                onClick={() =>
                                                                    handleDownload(
                                                                        attachment
                                                                    )
                                                                }
                                                            >
                                                                ⬇ Download
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        attachment.id
                                                                    )
                                                                }
                                                                disabled={
                                                                    deleting ===
                                                                    attachment.id
                                                                }
                                                            >
                                                                {deleting ===
                                                                attachment.id
                                                                    ? "Deleting..."
                                                                    : "Delete"}
                                                            </button>

                                                        </div>

                                                    </div>

                                                </div>
                                            )
                                        )}

                                    </div>

                                )}

                            </div>

                        </div>

                    </div>

                </div>


                {/* Sidebar */}

                <div className="col-lg-4">

                    <div className="card shadow-sm mb-4">

                        <div className="card-header">
                            <h5 className="mb-0">
                                Task Information
                            </h5>
                        </div>

                        <div className="card-body">

                            <div className="mb-3">

                                <small className="text-muted d-block">
                                    Task ID
                                </small>

                                <strong>
                                    #{task.id}
                                </strong>

                            </div>


                            <div className="mb-3">

                                <small className="text-muted d-block">
                                    Status
                                </small>

                                <strong>
                                    {task.status || "N/A"}
                                </strong>

                            </div>


                            <div className="mb-3">

                                <small className="text-muted d-block">
                                    Priority
                                </small>

                                <strong
                                    className={getPriorityClass(
                                        task.priority
                                    )}
                                >
                                    {task.priority || "N/A"}
                                </strong>

                            </div>


                            <div className="mb-3">

                                <small className="text-muted d-block">
                                    Assigned To
                                </small>

                                <strong>
                                    {task.assigned_user?.name ||
                                        task.assignedUser?.name ||
                                        "Unassigned"}
                                </strong>

                            </div>


                            <div className="mb-3">

                                <small className="text-muted d-block">
                                    Due Date
                                </small>

                                <strong>
                                    {task.due_date
                                        ? new Date(
                                              task.due_date
                                          ).toLocaleDateString()
                                        : "No due date"}
                                </strong>

                            </div>


                            <div>

                                <small className="text-muted d-block">
                                    Created At
                                </small>

                                <strong>
                                    {task.created_at
                                        ? new Date(
                                              task.created_at
                                          ).toLocaleDateString()
                                        : "N/A"}
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* Attachment Summary */}

                    <div className="card shadow-sm">

                        <div className="card-body text-center">

                            <div
                                style={{
                                    fontSize: "40px",
                                }}
                            >
                                📎
                            </div>

                            <h5 className="mt-2">
                                {attachments.length}
                            </h5>

                            <p className="text-muted mb-0">
                                Total Attachments
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default TaskDetail;