import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
    getAllNotes,
    deleteNote,
    toggleFavourite,
    downloadNote,
} from "../services/noteService";

const useNotes = () => {

    const [notes, setNotes] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("All");

    const [sortBy, setSortBy] = useState("Newest");

    const loadNotes = useCallback(async () => {

        try {

            setLoading(true);

            const response = await getAllNotes();

            setNotes(response || []);

        } catch (error) {

            toast.error("Unable to load notes.");

        } finally {

            setLoading(false);

        }

    }, []);

    useEffect(() => {

        loadNotes();

    }, [loadNotes]);

    const removeNote = async (id) => {

        try {

            await deleteNote(id);

            toast.success("Note deleted.");

            loadNotes();

        } catch {

            toast.error("Unable to delete note.");

        }

    };

    const favouriteNote = async (id) => {

        try {

            await toggleFavourite(id);

            loadNotes();

        } catch {

            toast.error("Unable to update favourite.");

        }

    };

    const download = async (id) => {

        try {

            await downloadNote(id);

        } catch {

            toast.error("Download failed.");

        }

    };

    const filteredNotes = notes

        .filter((note) => {

            const matchesSearch =

                note.title

                    ?.toLowerCase()

                    .includes(search.toLowerCase()) ||

                note.unit

                    ?.toLowerCase()

                    .includes(search.toLowerCase());

            const matchesCategory =

                category === "All"

                    ? true

                    : note.category === category;

            return matchesSearch && matchesCategory;

        })

        .sort((a, b) => {

            if (sortBy === "Newest") {

                return new Date(b.createdAt) - new Date(a.createdAt);

            }

            if (sortBy === "Oldest") {

                return new Date(a.createdAt) - new Date(b.createdAt);

            }

            if (sortBy === "Downloads") {

                return b.downloads - a.downloads;

            }

            return 0;

        });

    return {

        loading,

        notes: filteredNotes,

        search,

        setSearch,

        category,

        setCategory,

        sortBy,

        setSortBy,

        loadNotes,

        removeNote,

        favouriteNote,

        download,

    };

};

export default useNotes;
