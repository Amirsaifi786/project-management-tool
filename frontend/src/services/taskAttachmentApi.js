import api from "./api";
export const uploadTaskAttachments = (
    taskId,
    files,
    onUploadProgress
) => {
    const formData = new FormData();

    files.forEach((file) => {
        formData.append("files[]", file);
    });

    return api.post(
        `/tasks/${taskId}/attachments`,
        formData,
        {
            transformRequest: [
                (data, headers) => {
                    delete headers["Content-Type"];
                    return data;
                },
            ],
            onUploadProgress,
        }
    );
};

export const getTaskAttachments = (taskId) => {
    return api.get(`/tasks/${taskId}/attachments`);
};

export const deleteTaskAttachment = (taskId, attachmentId) => {
    return api.delete(
        `/tasks/${taskId}/attachments/${attachmentId}`
    );
};

export const getTaskAttachmentDownloadUrl = (
    taskId,
    attachmentId
) => {
    return `http://127.0.0.1:8000/api/tasks/${taskId}/attachments/${attachmentId}/download`;
};