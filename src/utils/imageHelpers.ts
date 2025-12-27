/**
 * Normalize profile or media image URLs so they always load correctly
 * even if the backend returns a relative path
 */

const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ Resolve base URL safely at module load
const API_BASE_URL =
    typeof RAW_API_BASE_URL === "string" && RAW_API_BASE_URL.length > 0
        ? RAW_API_BASE_URL.replace(/\/$/, "")
        : "";

export const getImageUrl = (url?: string, name?: string): string => {
    // Default fallback avatar using name initials
    const fallback = `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(
        name || "User"
    )}`;

    if (!url) return fallback;

    // Handle relative paths by prepending the backend base URL
    if (url.startsWith("/uploads")) {
        // If API base URL is missing, still return a safe relative URL
        return API_BASE_URL ? `${API_BASE_URL}${url}` : url;
    }

    // Already absolute (https://...)
    return url;
};
