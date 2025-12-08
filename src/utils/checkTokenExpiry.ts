export function isTokenExpired(token: string | null): boolean {
    if (!token) return true;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const expiry = payload.exp * 1000;
        const now = Date.now();

        return now >= expiry;
    } catch (err) {
        console.error("Failed to decode token:", err)
        return true;
    }
}