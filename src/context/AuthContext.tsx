// import { createContext, useEffect, useState } from "react";
// import notificationService, {User} from "@/hooks/notificationService";
//
//
// interface AuthContextValue {
//     user: User | null;
//     loading: boolean;
//     logout: () => void;
// }
//
// export const AuthContext = createContext<AuthContextValue | undefined>(
//     undefined
// );
//
// export function AuthProvider({ children }: { children: React.ReactNode }) {
//     const [user, setUser] = useState<User | null>(null);
//     const [loading, setLoading] = useState(true);
//
//     useEffect(() => {
//         // ✅ Auth layer owns user state
//         const currentUser = notificationService.getCurrentUser();
//         setUser(currentUser);
//         setLoading(false);
//     }, []);
//
//     const logout = async () => {
//         await userService.logoutUser();
//         setUser(null);
//     };
//
//     return (
//         <AuthContext.Provider value={{ user, loading, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// }