import {createContext, useState, useContext, useEffect} from 'react';
import axios from 'axios';
import PropTypes from "prop-types";

// App Context
const AppContext = createContext(undefined);

// API base Url
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const AppProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'))
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
                    const response = await axios.get(`${backendUrl}/api/user/profile`)
                    if (response.data.success) {
                        setUser(response.data.user)
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
    const login = async (email, password) => {
        try {
            setIsLoading(true);

            const response = await axios.post(backendUrl +'/api/user/login', {email, password})

            if (response.data.success) {
                const userData = response.data.user;
                const authToken = response.data.token;

                // validate that we received the required data
                if (!userData || !authToken) {
                    console.error('Invalid response data:', response.data);
                    return {success: false, message: "Invalid response from server"}
                }

                // store token in locale storage
                localStorage.setItem('token', authToken);
                setToken(authToken);
                setUser(userData)

                return {success: true, message: "Login successful!", user: userData}
            } else {
                return {success: false, message: response.data.message || "Login failed!"}
            }
        } catch (error) {
            console.error('Login error:', error);

            if (error.response?.data?.message) {
                return {success: false, message: error.response.data.message}
            }

            return {success: false, message: error.response?.data?.message || "Network error. Please try again."}
        } finally {
            setIsLoading(false)
        }
    }

    // Signup function
    const signup = async (userData) => {
        try {
            setIsLoading(true)

            const response = await axios.post(`${backendUrl}/api/user/signup`, userData)

            if (response.data.success) {
                // Updated to match your backend response structure
                const newUser = response.data.user;
                const authToken = response.data.token;

                // Validate data
                if (!newUser || !authToken) {
                    console.error('Invalid signup response data:', response.data);
                    return {success: false, message: "Invalid response from server"}
                }

                // Store token in localstorage
                localStorage.setItem('token', authToken);
                setToken(authToken);
                setUser(newUser)

                return {success: true, message: 'Account created successfully!', user: newUser}
            } else {
                return {success: false, message: response.data.message || "Signup failed"}
            }
        } catch (error) {
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

    const value = {
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

AppProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}