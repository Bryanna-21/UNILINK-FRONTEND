import api from "./api";

/* ===========================================
   NOTES API SERVICE
=========================================== */

/**
 * Get all notes
 */
export const getAllNotes = async (params = {}) => {
    const response = await api.get("/notes", {
        params,
    });

    return response.data;
};

/**
 * Get note by ID
 */
export const getNoteById = async (noteId) => {
    const response = await api.get(`/notes/${noteId}`);

    return response.data;
};

/**
 * Get my uploaded notes
 */
export const getMyNotes = async () => {
    const response = await api.get("/notes/my");

    return response.data;
};

/**
 * Upload new note
 */
export const uploadNote = async (formData) => {
    const response = await api.post(
        "/notes",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

/**
 * Update note
 */
export const updateNote = async (
    noteId,
    formData
) => {
    const response = await api.put(
        `/notes/${noteId}`,
        formData,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data",
            },
        }
    );

    return response.data;
};

/**
 * Delete note
 */
export const deleteNote = async (noteId) => {
    const response = await api.delete(
        `/notes/${noteId}`
    );

    return response.data;
};

/**
 * Download note
 */
export const downloadNote = async (
    noteId
) => {
    const response = await api.get(
        `/notes/${noteId}/download`,
        {
            responseType: "blob",
        }
    );

    return response.data;
};

/**
 * Favourite / Unfavourite
 */
export const toggleFavourite = async (
    noteId
) => {
    const response = await api.patch(
        `/notes/${noteId}/favourite`
    );

    return response.data;
};

/**
 * Like note
 */
export const likeNote = async (
    noteId
) => {
    const response = await api.patch(
        `/notes/${noteId}/like`
    );

    return response.data;
};

/**
 * Rate note
 */
export const rateNote = async (
    noteId,
    rating
) => {
    const response = await api.post(
        `/notes/${noteId}/rating`,
        {
            rating,
        }
    );

    return response.data;
};

/**
 * Report note
 */
export const reportNote = async (
    noteId,
    reason
) => {
    const response = await api.post(
        `/notes/${noteId}/report`,
        {
            reason,
        }
    );

    return response.data;
};

/**
 * Search notes
 */
export const searchNotes = async (
    query
) => {
    const response = await api.get(
        "/notes/search",
        {
            params: {
                q: query,
            },
        }
    );

    return response.data;
};

/**
 * Recent notes
 */
export const getRecentNotes =
    async () => {
        const response = await api.get(
            "/notes/recent"
        );

        return response.data;
    };

/**
 * Popular notes
 */
export const getPopularNotes =
    async () => {
        const response = await api.get(
            "/notes/popular"
        );

        return response.data;
    };

/**
 * Notes by Course
 */
export const getCourseNotes =
    async (courseId) => {
        const response = await api.get(
            `/notes/course/${courseId}`
        );

        return response.data;
    };

/**
 * Notes by Unit
 */
export const getUnitNotes =
    async (unitId) => {
        const response = await api.get(
            `/notes/unit/${unitId}`
        );

        return response.data;
    };

/**
 * Favourite Notes
 */
export const getFavouriteNotes =
    async () => {
        const response = await api.get(
            "/notes/favourites"
        );

        return response.data;
    };

/**
 * Bookmark Note
 */
export const bookmarkNote =
    async (noteId) => {
        const response = await api.patch(
            `/notes/${noteId}/bookmark`
        );

        return response.data;
    };

/**
 * My Bookmarks
 */
export const getBookmarks =
    async () => {
        const response = await api.get(
            "/notes/bookmarks"
        );

        return response.data;
    };
