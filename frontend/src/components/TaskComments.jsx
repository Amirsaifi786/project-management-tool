import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    getTaskComments,
    addTaskComment,
    updateTaskComment,
    deleteTaskComment,
} from "../services/api";

const TaskComments = ({ taskId }) => {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const currentUser = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const currentUserId = currentUser?.id;

    const loadComments = async () => {
        try {
            setLoading(true);

            const response = await getTaskComments(taskId);

            setComments(response.data || []);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to load comments"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (taskId) {
            loadComments();
        }
    }, [taskId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const value = comment.trim();

        if (!value) {
            toast.error("Please enter a comment");
            return;
        }

        try {
            setSubmitting(true);

            const response = await addTaskComment(taskId, value);

            setComments((prev) => [
                response.data,
                ...prev,
            ]);

            setComment("");

            toast.success("Comment added successfully");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to add comment"
            );
        } finally {
            setSubmitting(false);
        }
    };

    const startEdit = (item) => {
        setEditingId(item.id);
        setEditingText(item.comment);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditingText("");
    };

    const handleUpdate = async (id) => {
        const value = editingText.trim();

        if (!value) {
            toast.error("Comment cannot be empty");
            return;
        }

        try {
            const response = await updateTaskComment(id, value);

            setComments((prev) =>
                prev.map((item) =>
                    item.id === id
                        ? response.data
                        : item
                )
            );

            cancelEdit();

            toast.success("Comment updated successfully");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to update comment"
            );
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this comment?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(id);

            await deleteTaskComment(id);

            setComments((prev) =>
                prev.filter((item) => item.id !== id)
            );

            toast.success("Comment deleted successfully");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to delete comment"
            );
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "";
        }

        return new Date(date).toLocaleString();
    };

    return (
        <div className="card border-0 shadow-sm mt-4">
            <div className="card-header bg-white border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                        <i className="bi bi-chat-left-text me-2"></i>
                        Comments
                    </h5>

                    <span className="badge bg-primary">
                        {comments.length}
                    </span>
                </div>
            </div>

            <div className="card-body">
                <form onSubmit={handleSubmit} className="mb-4">
                    <label className="form-label fw-semibold">
                        Add Comment
                    </label>

                    <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Write a comment..."
                        value={comment}
                        onChange={(e) =>
                            setComment(e.target.value)
                        }
                        disabled={submitting}
                    />

                    <div className="text-end mt-2">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                    ></span>
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-send me-1"></i>
                                    Add Comment
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {loading ? (
                    <div className="text-center py-4">
                        <div
                            className="spinner-border text-primary"
                            role="status"
                        ></div>
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center text-muted py-4">
                        <i className="bi bi-chat-square-text fs-2 d-block mb-2"></i>
                        No comments yet.
                    </div>
                ) : (
                    <div>
                        {comments.map((item) => {
                            const isOwner =
                                Number(item.user_id) ===
                                Number(currentUserId);

                            return (
                                <div
                                    key={item.id}
                                    className="border rounded p-3 mb-3"
                                >
                                    <div className="d-flex justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <div
                                                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                }}
                                            >
                                                {item.user?.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase() ||
                                                    "U"}
                                            </div>

                                            <div>
                                                <div className="fw-semibold">
                                                    {item.user?.name ||
                                                        "Unknown User"}
                                                </div>

                                                <small className="text-muted">
                                                    {formatDate(
                                                        item.created_at
                                                    )}
                                                </small>
                                            </div>
                                        </div>

                                        {isOwner && (
                                            <div className="dropdown">
                                                <button
                                                    className="btn btn-sm btn-light"
                                                    type="button"
                                                    data-bs-toggle="dropdown"
                                                >
                                                    <i className="bi bi-three-dots-vertical"></i>
                                                </button>

                                                <ul className="dropdown-menu dropdown-menu-end">
                                                    <li>
                                                        <button
                                                            className="dropdown-item"
                                                            onClick={() =>
                                                                startEdit(
                                                                    item
                                                                )
                                                            }
                                                        >
                                                            <i className="bi bi-pencil me-2"></i>
                                                            Edit
                                                        </button>
                                                    </li>

                                                    <li>
                                                        <button
                                                            className="dropdown-item text-danger"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    item.id
                                                                )
                                                            }
                                                            disabled={
                                                                deletingId ===
                                                                item.id
                                                            }
                                                        >
                                                            <i className="bi bi-trash me-2"></i>
                                                            {deletingId ===
                                                            item.id
                                                                ? "Deleting..."
                                                                : "Delete"}
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-3">
                                        {editingId === item.id ? (
                                            <>
                                                <textarea
                                                    className="form-control"
                                                    rows="3"
                                                    value={
                                                        editingText
                                                    }
                                                    onChange={(e) =>
                                                        setEditingText(
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                                <div className="mt-2">
                                                    <button
                                                        className="btn btn-sm btn-primary me-2"
                                                        onClick={() =>
                                                            handleUpdate(
                                                                item.id
                                                            )
                                                        }
                                                    >
                                                        Save
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-secondary"
                                                        onClick={
                                                            cancelEdit
                                                        }
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <p className="mb-0 text-break">
                                                {item.comment}
                                            </p>
                                        )}
                                    </div>

                                    {item.updated_at !==
                                        item.created_at && (
                                        <small className="text-muted d-block mt-2">
                                            Edited
                                        </small>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskComments;