// utils/oauthUtils.js

/**
 * Generate Google OAuth URL
 */
export const getGoogleAuthUrl = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/google/callback`;
    const scope = 'openid profile email';
    const state = generateState();

    // Store state in multiple places for better reliability
    storeOAuthState(state, 'google');

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: scope,
        response_type: 'code',
        state: state,
        access_type: 'offline',
        prompt: 'consent'
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

/**
 * Generate GitHub OAuth URL
 */
export const getGithubAuthUrl = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/github/callback`;
    const scope = 'user:email';
    const state = generateState();

    // Store state in multiple places for better reliability
    storeOAuthState(state, 'github');

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: scope,
        state: state
    });

    return `https://github.com/login/oauth/authorize?${params.toString()}`;
};

/**
 * Generate random state for CSRF protection
 */
const generateState = () => {
    // Create a more robust state with timestamp
    const randomPart = Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
    const timestamp = Date.now().toString(36);
    return `${randomPart}_${timestamp}`;
};

/**
 * Store OAuth state in multiple locations for better reliability
 */
const storeOAuthState = (state, provider) => {
    const timestamp = Date.now();

    // Check if this is a signup flow
    const signupContext = sessionStorage.getItem('oauth_signup_context');
    let contextData = null;
    if (signupContext) {
        try {
            contextData = JSON.parse(signupContext);
        } catch (error) {
            console.warn('Failed to parse signup context:', error);
        }
    }

    const stateData = {
        state,
        provider,
        timestamp,
        signupContext: contextData,
        origin: window.location.origin
    };

    try {
        // Primary storage - sessionStorage
        sessionStorage.setItem('oauth_state', state);
        sessionStorage.setItem('oauth_provider', provider);
        sessionStorage.setItem('oauth_timestamp', timestamp.toString());

        // Enhanced fallback storage - localStorage with more context
        const storageKey = `oauth_state_${provider}`;
        localStorage.setItem(storageKey, JSON.stringify(stateData));

        // Store a general backup as well
        localStorage.setItem('oauth_backup_state', JSON.stringify(stateData));

        // Store state with a more specific key that includes domain
        const domainKey = `oauth_${window.location.hostname}_${provider}`;
        localStorage.setItem(domainKey, JSON.stringify(stateData));

        console.log('OAuth state stored successfully:', {
            state: state.substring(0, 10) + '...',
            provider,
            storageLocations: ['sessionStorage', 'localStorage']
        });

    } catch (error) {
        console.warn('Failed to store OAuth state:', error);
        throw new Error('Failed to initialize OAuth state. Please try again.');
    }
};

/**
 * Retrieve OAuth state from multiple sources with enhanced fallback
 */
const getStoredOAuthState = (provider = null) => {
    console.log('=== Retrieving OAuth State ===');

    // Try sessionStorage first
    let storedState = sessionStorage.getItem('oauth_state');
    let storedProvider = sessionStorage.getItem('oauth_provider');
    let timestamp = sessionStorage.getItem('oauth_timestamp');

    if (storedState && storedProvider) {
        console.log('Found state in sessionStorage');
        return {
            state: storedState,
            provider: storedProvider,
            timestamp: timestamp ? parseInt(timestamp) : Date.now(),
            source: 'sessionStorage'
        };
    }

    // Try provider-specific localStorage key
    if (provider) {
        try {
            const providerKey = `oauth_state_${provider}`;
            const providerData = localStorage.getItem(providerKey);
            if (providerData) {
                const parsed = JSON.parse(providerData);
                // Check if not expired (30 minutes)
                if (Date.now() - parsed.timestamp < 30 * 60 * 1000) {
                    console.log('Found state in provider-specific localStorage');
                    return {
                        state: parsed.state,
                        provider: parsed.provider,
                        timestamp: parsed.timestamp,
                        source: 'localStorage_provider'
                    };
                } else {
                    localStorage.removeItem(providerKey);
                }
            }
        } catch (error) {
            console.warn('Failed to parse provider-specific OAuth state:', error);
        }
    }

    // Try domain-specific localStorage key
    if (provider) {
        try {
            const domainKey = `oauth_${window.location.hostname}_${provider}`;
            const domainData = localStorage.getItem(domainKey);
            if (domainData) {
                const parsed = JSON.parse(domainData);
                if (Date.now() - parsed.timestamp < 30 * 60 * 1000) {
                    console.log('Found state in domain-specific localStorage');
                    return {
                        state: parsed.state,
                        provider: parsed.provider,
                        timestamp: parsed.timestamp,
                        source: 'localStorage_domain'
                    };
                } else {
                    localStorage.removeItem(domainKey);
                }
            }
        } catch (error) {
            console.warn('Failed to parse domain-specific OAuth state:', error);
        }
    }

    // Try general localStorage backup
    try {
        const backupData = localStorage.getItem('oauth_backup_state');
        if (backupData) {
            const parsed = JSON.parse(backupData);
            // Check if not expired (30 minutes)
            if (Date.now() - parsed.timestamp < 30 * 60 * 1000) {
                console.log('Found state in general localStorage backup');
                return {
                    state: parsed.state,
                    provider: parsed.provider,
                    timestamp: parsed.timestamp,
                    source: 'localStorage_backup'
                };
            } else {
                localStorage.removeItem('oauth_backup_state');
            }
        }
    } catch (error) {
        console.warn('Failed to parse backup OAuth state:', error);
    }

    console.log('No valid OAuth state found in any storage location');
    return null;
};

/**
 * Clean up OAuth state from all storage locations
 */
const cleanupOAuthState = (provider = null) => {
    try {
        console.log('Cleaning up OAuth state...');

        // Clean sessionStorage
        sessionStorage.removeItem('oauth_state');
        sessionStorage.removeItem('oauth_provider');
        sessionStorage.removeItem('oauth_timestamp');

        // Clean provider-specific localStorage
        if (provider) {
            localStorage.removeItem(`oauth_state_${provider}`);
            localStorage.removeItem(`oauth_${window.location.hostname}_${provider}`);
        } else {
            // Clean all provider keys if provider not specified
            ['google', 'github'].forEach(p => {
                localStorage.removeItem(`oauth_state_${p}`);
                localStorage.removeItem(`oauth_${window.location.hostname}_${p}`);
            });
        }

        // Clean general backup
        localStorage.removeItem('oauth_backup_state');

        console.log('OAuth state cleanup completed');
    } catch (error) {
        console.warn('Failed to cleanup OAuth state:', error);
    }
};

/**
 * Clean up expired signup context (older than 30 minutes)
 */
const cleanupExpiredSignupContext = () => {
    try {
        const signupContext = sessionStorage.getItem('oauth_signup_context');
        if (signupContext) {
            const context = JSON.parse(signupContext);
            // Remove if older than 30 minutes
            if (Date.now() - context.timestamp > 30 * 60 * 1000) {
                sessionStorage.removeItem('oauth_signup_context');
                console.log('Removed expired signup context');
            }
        }
    } catch (error) {
        console.warn('Failed to cleanup signup context:', error);
        // If parsing fails, remove the corrupted data
        sessionStorage.removeItem('oauth_signup_context');
    }
};

/**
 * Initiate OAuth flow for a specified provider
 */
export const initiateOauthFlow = (provider) => {
    try {
        console.log(`=== Initiating OAuth flow for ${provider} ===`);

        // Clean up any existing state first, but preserve signup context
        const existingSignupContext = sessionStorage.getItem('oauth_signup_context');
        cleanupOAuthState();

        // Restore signup context if it existed
        if (existingSignupContext) {
            sessionStorage.setItem('oauth_signup_context', existingSignupContext);
        }

        // Clean up expired signup context
        cleanupExpiredSignupContext();

        let authUrl;

        switch (provider) {
            case 'google':
                authUrl = getGoogleAuthUrl();
                break;
            case 'github':
                authUrl = getGithubAuthUrl();
                break;
            default:
                throw new Error(`Unsupported OAuth provider: ${provider}`);
        }

        console.log('OAuth URL generated, redirecting...');

        // Use window.location.href for same-tab navigation to preserve state
        window.location.href = authUrl;
    } catch (error) {
        console.error('OAuth flow initiation error:', error);
        throw error;
    }
};

/**
 * Validate OAuth state parameter for CSRF protection with enhanced fallbacks
 */
export const validateOAuthState = (receivedState, provider = null) => {
    console.log('=== OAuth State Validation ===');

    // Check if state parameter exists
    if (!receivedState) {
        console.error('No state parameter provided');
        return false;
    }

    console.log('Received state:', receivedState.substring(0, 10) + '...');

    // Get stored state from multiple sources
    const storedStateData = getStoredOAuthState(provider);

    if (!storedStateData) {
        console.error('No stored state found in any storage location');

        // Additional debug info
        console.log('Available storage keys:', {
            sessionStorage: Object.keys(sessionStorage),
            localStorage: Object.keys(localStorage).filter(key => key.includes('oauth'))
        });

        return false;
    }

    console.log('Found stored state from:', storedStateData.source);

    // Validate state match
    const isValid = storedStateData.state === receivedState;

    if (!isValid) {
        console.error('State mismatch:', {
            received: receivedState.substring(0, 10) + '...',
            stored: storedStateData.state.substring(0, 10) + '...',
            source: storedStateData.source
        });
    } else {
        console.log('State validation successful from:', storedStateData.source);
    }

    return isValid;
};

/**
 * Handle OAuth callback and extract authorization code with enhanced error handling
 */
export const handleOauthCallback = (searchParams, provider = null) => {
    console.log('=== Handling OAuth Callback ===');

    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    console.log('Callback parameters:', {
        code: code ? `${code.substring(0, 10)}...` : null,
        state: state ? `${state.substring(0, 10)}...` : null,
        error,
        errorDescription,
        provider
    });

    if (error) {
        const errorMessage = errorDescription || error;
        console.error('OAuth provider error:', errorMessage);

        // Clean up state on error
        cleanupOAuthState(provider);

        throw new Error(`OAuth error: ${errorMessage}`);
    }

    if (!code) {
        console.error('No authorization code provided');
        cleanupOAuthState(provider);
        throw new Error('No authorization code provided');
    }

    if (!state) {
        console.error('No state parameter provided');
        cleanupOAuthState(provider);
        throw new Error('Security verification failed: No state parameter received');
    }

    // Enhanced state validation with provider context
    if (!validateOAuthState(state, provider)) {
        console.error('OAuth state validation failed');
        cleanupOAuthState(provider);

        // Provide more helpful error message
        throw new Error('Security verification failed. This can happen if:\n' +
            '• You opened the login link in a new tab (please use the same tab)\n' +
            '• Your session expired (please try logging in again)\n' +
            '• Your browser is blocking cookies/storage');
    }

    // Clean up state after successful validation
    cleanupOAuthState(provider);

    console.log('OAuth callback validation successful');
    return { code };
};