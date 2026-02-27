import { createContext, useContext, useReducer, ReactNode, useEffect } from "react";
import { BlogResult, PastBlog } from "../lib/types";

type AppState = {
    currentBlogId: string | null;
    currentBlog: BlogResult | null;
    pastBlogs: PastBlog[];
};

type Action =
    | { type: "SET_CURRENT_BLOG_ID"; payload: string | null }
    | { type: "SET_CURRENT_BLOG"; payload: BlogResult | null }
    | { type: "SET_PAST_BLOGS"; payload: PastBlog[] }
    | { type: "ADD_PAST_BLOG"; payload: PastBlog };

const initialState: AppState = {
    currentBlogId: null,
    currentBlog: null,
    pastBlogs: [],
};

function appReducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case "SET_CURRENT_BLOG_ID":
            return { ...state, currentBlogId: action.payload };
        case "SET_CURRENT_BLOG":
            return { ...state, currentBlog: action.payload };
        case "SET_PAST_BLOGS":
            return { ...state, pastBlogs: action.payload };
        case "ADD_PAST_BLOG":
            return { ...state, pastBlogs: [action.payload, ...state.pastBlogs] };
        default:
            return state;
    }
}

interface AppContextType extends AppState {
    dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    useEffect(() => {
        // Force light mode on document root
        const root = window.document.documentElement;
        root.classList.remove("dark");
    }, []);

    return (
        <AppContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
}
