import { useState, useEffect, useCallback } from "react";
import { fetchPastBlogs, fetchBlogById } from "../lib/api";
import { useAppContext } from "../context/AppContext";
import { toast } from "sonner";

export function usePastBlogs() {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingBlog, setIsFetchingBlog] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { pastBlogs, dispatch } = useAppContext();

    const loadPastBlogs = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const blogs = await fetchPastBlogs();
            dispatch({ type: "SET_PAST_BLOGS", payload: blogs });
        } catch (err: any) {
            console.error(err);
            setError("Failed to load past blogs.");
            toast.error("Failed to load past blogs.");
        } finally {
            setIsLoading(false);
        }
    }, [dispatch]);

    const loadBlog = useCallback(async (id: string) => {
        setIsFetchingBlog(true);
        try {
            const blog = await fetchBlogById(id);
            dispatch({ type: "SET_CURRENT_BLOG", payload: blog });
            return blog;
        } catch (err: any) {
            console.error(err);
            toast.error("Failed to load blog details.");
            return null;
        } finally {
            setIsFetchingBlog(false);
        }
    }, [dispatch]);

    useEffect(() => {
        loadPastBlogs();
    }, [loadPastBlogs]);

    return { pastBlogs, isLoading, loadPastBlogs, loadBlog, isFetchingBlog, error };
}
