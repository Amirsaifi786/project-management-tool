import React, { useEffect, useState } from "react";
import api from "../services/api";

const TaskActivity = ({ taskId }) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (taskId) {
            fetchActivities();
        }
    }, [taskId]);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/tasks/${taskId}/activities`
            );

            setActivities(response.data?.data || []);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load task activity."
            );
        } finally {
            setLoading(false);
        }
    };

    const getActivityIcon = (action) => {
        switch (action) {
            case "task_created":
                return "bi-plus-circle";

            case "status_changed":
                return "bi-arrow-repeat";

            case "priority_changed":
                return "bi-lightning-charge";

            case "due_date_changed":
                return "bi-calendar-event";

            case "comment_added":
                return "bi-chat-left-text";

            case "comment_updated":
                return "bi-pencil";

            case "comment_deleted":
                return "bi-trash";

            case "attachment_uploaded":
                return "bi-paperclip";

            case "attachment_deleted":
                return "bi-trash3";

            default:
                return "bi-activity";
        }
    };

    const getActivityClass = (action) => {
        switch (action) {
            case "status_changed":
                return "activity-status";

            case "priority_changed":
                return "activity-priority";

            case "due_date_changed":
                return "activity-date";

            case "comment_added":
            case "comment_updated":
                return "activity-comment";

            case "comment_deleted":
            case "attachment_deleted":
                return "activity-delete";

            case "attachment_uploaded":
                return "activity-attachment";

            default:
                return "activity-default";
        }
    };

    const formatValue = (value) => {
        if (!value) {
            return "None";
        }

        return String(value)
            .replaceAll("_", " ")
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            );
    };

    const formatDate = (date) => {
        if (!date) {
            return "";
        }

        return new Date(date).toLocaleString([], {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getInitial = (name) => {
        return (
            name?.trim()?.charAt(0)?.toUpperCase() ||
            "U"
        );
    };

    if (loading) {
        return (
            <div className="card shadow-sm mb-4">
                <div className="card-header">
                    <h5 className="mb-0">
                        Activity
                    </h5>
                </div>

                <div className="card-body text-center py-5">
                    <div
                        className="spinner-border text-primary"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>

                    <div className="text-muted mt-2">
                        Loading activity...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card shadow-sm mb-4">

            <div className="card-header d-flex justify-content-between align-items-center">
                <div>
                    <h5 className="mb-1">
                        Activity
                    </h5>

                    <small className="text-muted">
                        Task history and recent changes
                    </small>
                </div>

                <span className="badge bg-secondary">
                    {activities.length}
                </span>
            </div>

            <div className="card-body">

                {error && (
                    <div className="alert alert-danger mb-0">
                        {error}
                    </div>
                )}

                {!error && activities.length === 0 && (
                    <div className="text-center py-5">

                        <div className="activity-empty-icon">
                            <i className="bi bi-clock-history"></i>
                        </div>

                        <h6 className="mt-3">
                            No activity yet
                        </h6>

                        <p className="text-muted mb-0">
                            Task changes and actions will
                            appear here.
                        </p>

                    </div>
                )}

                {!error && activities.length > 0 && (
                    <div className="task-activity-timeline">

                        {activities.map((activity, index) => {

                            const userName =
                                activity.user?.name ||
                                "System";

                            const isLast =
                                index ===
                                activities.length - 1;

                            return (
                                <div
                                    className={`task-activity-item ${
                                        isLast
                                            ? "last"
                                            : ""
                                    }`}
                                    key={activity.id}
                                >

                                    <div
                                        className={`task-activity-icon ${getActivityClass(
                                            activity.action
                                        )}`}
                                    >
                                        <i
                                            className={`bi ${getActivityIcon(
                                                activity.action
                                            )}`}
                                        ></i>
                                    </div>

                                    <div className="task-activity-content">

                                        <div className="task-activity-top">

                                            <div className="d-flex align-items-center gap-2">

                                                <span className="activity-avatar">
                                                    {getInitial(
                                                        userName
                                                    )}
                                                </span>

                                                <strong>
                                                    {userName}
                                                </strong>

                                            </div>

                                            <small className="text-muted">
                                                {formatDate(
                                                    activity.created_at
                                                )}
                                            </small>

                                        </div>

                                        <div className="task-activity-description">
                                            {activity.description}
                                        </div>

                                        {(activity.old_value ||
                                            activity.new_value) && (
                                            <div className="activity-change-box">

                                                {activity.old_value && (
                                                    <span className="activity-old-value">
                                                        {formatValue(
                                                            activity.old_value
                                                        )}
                                                    </span>
                                                )}

                                                {activity.old_value &&
                                                    activity.new_value && (
                                                        <i className="bi bi-arrow-right"></i>
                                                    )}

                                                {activity.new_value && (
                                                    <span className="activity-new-value">
                                                        {formatValue(
                                                            activity.new_value
                                                        )}
                                                    </span>
                                                )}

                                            </div>
                                        )}

                                    </div>

                                </div>
                            );
                        })}

                    </div>
                )}

            </div>
        </div>
    );
};

export default TaskActivity;