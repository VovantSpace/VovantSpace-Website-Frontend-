import React, {createContext, useState, useContext, useEffect, ReactNode} from 'react';
import axios from 'axios';

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'Innovator' | "Problem Solver" | "Advisor/Mentor" | "Client/Mentee";
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string; user?: User }>
    logout: () => void;
    signup: (userData: any) => Promise<{ success: boolean; message?: string; user?: User }>
}

// App Context
const AppContext = createContext<AuthContextType | undefined>(undefined);

// API base Url
const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({children}) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
    const [isLoading, setIsLoading] = useState(true)

    // Check if user is authenticated
    const isAuthenticated = !!user && !!token

    // Axios config
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization']
        }
    }, [token]);

    // load user as soon as the app starts
    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const response = await axios.get(`${backendUrl}/user/profile`)
                    if (response.data.success) {
                        setUser(response.data.data.user)
                    } else {
                        // clear if invalid token
                        localStorage.removeItem('token')
                        setToken(null)
                    }
                } catch (error) {
                    console.error('Error loading user:', error)
                    // Clear the token
                    localStorage.removeItem('token')
                    setToken(null)
                }
            }
            setIsLoading(false)
        }

        loadUser()
    }, [token]);

    // Function to handle Login
    const login = async (email: string, password: string): Promise<{
        success: boolean;
        message?: string;
        user?: User
    }> => {
        try {
            setIsLoading(true);

            const response = await axios.post(`${backendUrl}/user/login`, {email, password})

            if (response.data.success) {
                const {user: userData, token: authToken} = response.data.data

                // store token in locale storage
                localStorage.setItem('token', authToken);
                setToken(authToken);
                setUser(userData)

                return {success: true, message: "Login successful!", user: userData}
            } else {
                return {success: false, message: response.data.message || "Login failed!"}
            }
        } catch (error: any) {
            console.error('Login error:', error);

            if (error.response?.data?.message) {
                return {success: false, message: error.response.data.message}
            }

            return {success: false, message: error.response.data.message}
        } finally {
            setIsLoading(false)
        }
    }

    // Signup function
    const signup = async (userData: any): Promise<{ success: boolean; message?: string; user?: User }> => {
        try {
            setIsLoading(true)

            const response = await axios.post(`${backendUrl}/user/signup`, userData)

            if (response.data.success) {
                const {user: newUser, token: authToken} = response.data.data;

                // Store token in localstorage
                localStorage.setItem('token', authToken);
                setToken(authToken);
                setUser(newUser)

                return {success: true, message: 'Account created successfully!', user: newUser}
            } else {
                return {success: false, message: response.data.message || "Signup failed"}
            }
        } catch (error: any) {
            console.error('Signup error:', error);

            if (error.response?.data?.message) {
                return {success: false, message: error.response.data.message}
            }

            return {success: false, message: "Network error. Please try again."}
        } finally {
            setIsLoading(false);
        }
    }

    // logout function
    const logout = () => {
        localStorage.removeItem('token')
        setToken(null);
        setUser(null)
        delete axios.defaults.headers.common['Authorization']
    }

    const value: AuthContextType = {
        user,
        token,
        isLoading,
        isAuthenticated,
        login,
        logout,
        signup
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = (): AuthContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}