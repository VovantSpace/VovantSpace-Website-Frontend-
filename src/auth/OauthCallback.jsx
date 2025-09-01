import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAppContext } from "@/context/AppContext.jsx";
import { handleOauthCallback } from "@/utils/oauthUtils.js";

const OauthCallback = () => {
    const navigate = useNavigate();
    const { provider } = useParams();
    const [searchParams] = useSearchParams();
    const { oauthLogin } = useAppContext();
    const [isProcessing, setIsProcessing] = useState(true);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const [hasStartedProcessing, setHasStartedProcessing] = useState(false);

    // Function to get the dashboard route based on the user role
    const getDashboardRoute = (role) => {
        const normalizedRole = role?.toLowerCase();
        switch (normalizedRole) {
            case 'innovator':
                return '/dashboard/innovator';
            case 'problem solver':
            case 'problemsolver':
            case 'problem-solver':
                return '/dashboard/ps';
            case 'advisor/mentor':
            case 'advisor':
            case 'mentor':
                return '/dashboard/advisor';
            case 'client/mentee':
            case 'client':
            case 'mentee':
                return '/dashboard/client';
            default:
                console.warn("Unknown user role:", role);
                return '/dashboard';
        }
    };

    const processOauthCallback = async (attempt = 1) => {
        try {
            console.log(`=== Processing OAuth Callback (Attempt ${attempt}) ===`);
            console.log('Provider:', provider);
            console.log('Current URL:', window.location.href);
            console.log('Search params:', Object.fromEntries(searchParams.entries()));

            setIsProcessing(true);
            setError(null);

            // Validate provider parameter
            if (!provider || !['google', 'github'].includes(provider)) {
                throw new Error(`Invalid or missing OAuth provider: ${provider}`);
            }

            // Small delay to ensure all browser state is settled
            if (attempt === 1) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            // Handle OAuth callback and get the authorization code
            // Pass provider to help with state validation
            const { code } = handleOauthCallback(searchParams, provider);
            console.log('Authorization code extracted successfully');

            // Send the code to the backend for token exchange
            console.log('Sending OAuth login request...');
            const result = await oauthLogin(provider, code);
            console.log('OAuth login result:', result);

            if (result.success && result.user) {
                const userRole = result.user.role;
                console.log('User role:', userRole);
                console.log('Needs role selection:', result.needsRoleSelection);

                if (userRole && !result.needsRoleSelection) {
                    // Existing user with role - redirect to their dashboard
                    const dashboardRoute = getDashboardRoute(userRole);
                    console.log("OAuth login successful, redirecting existing user to:", dashboardRoute);
                    navigate(dashboardRoute, { replace: true });
                } else {
                    // New user or user without role - redirect to role selection
                    console.log("User needs role selection, redirecting to role selection page");
                    navigate('/role-selection', {
                        state: {
                            userData: result.user,
                            fromOAuth: true,
                            provider: provider
                        },
                        replace: true,
                    });
                }
            } else {
                console.error('OAuth login failed:', result.message);
                setError(result.message || "Authentication failed. Please try again.");
            }
        } catch (err) {
            console.error(`OAuth callback error (attempt ${attempt}):`, err);

            // Handle specific error types with more granular retry logic
            if (err.message.includes('Security verification failed') ||
                err.message.includes('Invalid OAuth state parameter') ||
                err.message.includes('No state parameter')) {

                // For state validation errors, try once more with a longer delay
                if (attempt === 1 && retryCount < 1) {
                    console.log('State validation failed, retrying in 1000ms...');
                    setRetryCount(prev => prev + 1);
                    setTimeout(() => processOauthCallback(2), 1000);
                    return;
                }

                setError('Security verification failed. This usually happens when:\n' +
                    '• The login was started in a different tab (please use the same tab)\n' +
                    '• Your session expired (please try logging in again)\n' +
                    '• Browser storage is disabled (please enable cookies)');
            } else if (err.message.includes('No authorization code')) {
                setError('Authorization failed. The OAuth provider did not return an authorization code. Please try logging in again.');
            } else if (err.message.includes('OAuth error:')) {
                setError(err.message);
            } else if (err.message.includes('Invalid or missing OAuth provider')) {
                setError('Invalid authentication provider. Please start the login process again.');
            } else {
                setError(`Authentication failed: ${err.message}. Please try again.`);
            }
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        // Only process once when component mounts
        if (!hasStartedProcessing && !error && provider) {
            setHasStartedProcessing(true);
            processOauthCallback();
        } else if (!provider) {
            setError('Invalid authentication provider. Please start the login process again.');
            setIsProcessing(false);
        }
    }, [provider, searchParams]);

    // Enhanced cleanup function
    const clearOAuthStorage = () => {
        try {
            // Clear all OAuth-related storage
            sessionStorage.removeItem('oauth_state');
            sessionStorage.removeItem('oauth_provider');
            sessionStorage.removeItem('oauth_timestamp');

            // Clear provider-specific storage
            if (provider) {
                localStorage.removeItem(`oauth_state_${provider}`);
                localStorage.removeItem(`oauth_${window.location.hostname}_${provider}`);
            }

            localStorage.removeItem('oauth_backup_state');

            console.log('OAuth storage cleared successfully');
        } catch (error) {
            console.warn('Failed to clear OAuth storage:', error);
        }
    };

    // Error state with enhanced troubleshooting
    if (error) {
        return (
            <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="text-red-500 text-6xl mb-4">❌</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Failed</h2>
                    <div className="text-gray-600 mb-6 text-sm leading-relaxed whitespace-pre-line">
                        {error}
                    </div>

                    {/* Show additional help for common issues */}
                    {error.includes('Security verification failed') && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
                            <h4 className="font-semibold text-yellow-800 mb-2">💡 Troubleshooting Tips:</h4>
                            <ul className="text-sm text-yellow-700 space-y-1">
                                <li>• Always use the same browser tab for the entire login process</li>
                                <li>• Ensure cookies and local storage are enabled</li>
                                <li>• Try disabling browser extensions temporarily</li>
                                <li>• Clear your browser cache and try again</li>
                                <li>• If using incognito mode, try a regular browser window</li>
                            </ul>
                        </div>
                    )}

                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                clearOAuthStorage();
                                navigate('/login');
                            }}
                            className="w-full bg-[#00674f] text-white py-3 px-6 rounded-lg hover:bg-[#005a43] transition-colors font-medium"
                        >
                            Try Login Again
                        </button>
                        <button
                            onClick={() => {
                                clearOAuthStorage();
                                navigate('/signup');
                            }}
                            className="w-full bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                        >
                            Back to Signup
                        </button>

                        {/* Debug info for development */}
                        {/*{process.env.NODE_ENV === 'development' && (*/}
                        {/*    <details className="text-left mt-4">*/}
                        {/*        <summary className="cursor-pointer text-xs text-gray-500">Debug Info (Dev Only)</summary>*/}
                        {/*        <pre className="text-xs text-gray-400 mt-2 p-2 bg-gray-50 rounded overflow-auto max-h-32">*/}
                        {/*            {JSON.stringify({*/}
                        {/*                provider,*/}
                        {/*                searchParams: Object.fromEntries(searchParams.entries()),*/}
                        {/*                retryCount,*/}
                        {/*                userAgent: navigator.userAgent,*/}
                        {/*                url: window.location.href,*/}
                        {/*                availableStorage: {*/}
                        {/*                    sessionStorage: Object.keys(sessionStorage),*/}
                        {/*                    localStorage: Object.keys(localStorage).filter(key => key.includes('oauth'))*/}
                        {/*                }*/}
                        {/*            }, null, 2)}*/}
                        {/*        </pre>*/}
                        {/*    </details>*/}
                        {/*)}*/}
                    </div>
                </div>
            </div>
        );
    }

    // Loading state
    return (
        <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#00674f] mx-auto mb-6"></div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Authenticating with {provider === 'google' ? 'Google' : 'GitHub'}...
                </h2>
                <p className="text-gray-600 mb-4">Please wait while we complete your authentication.</p>

                {retryCount > 0 && (
                    <p className="text-sm text-yellow-600">
                        Retrying authentication... (Attempt {retryCount + 1})
                    </p>
                )}

                <div className="mt-6 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400">
                        This should only take a few seconds. If it&#39;s taking too long, try refreshing the page.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OauthCallback;