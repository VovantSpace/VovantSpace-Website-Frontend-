/**
 * Normalize profile or media image URLs so they always load correctly
 * even if the backend returns a relative path
 */

export const getImageUrl = (url?: string, name?: string): string => {
    // Default fallback avatar using name initials
    const fallback = `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(
        name || "User"
    )}`;

    if (!url) return fallback;

    const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8000";

    // Handle relative paths by prepending the base URL
    if (url.startsWith("/uploads")) {
        return `${base}${url}`;
    }

    return url;
}
