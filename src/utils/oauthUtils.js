/**
 * Oauth config
 * */

export const OAUTH_CONFIG = {
    google: {
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        redirectUri: `${window.location.origin}/auth/google/callback`,
        scope: 'openid email profile',
        responseType: 'code',
        authUrl: 'https://accounts.google.com/oauth/authorize'
    },
    github: {
        clientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
        redirectUri: `${window.location.origin}/auth/github/callback`,
        scope: 'user:email',
        authUrl: 'https://github.com/login/oauth/authorize'
    }
}

/**
 * Generate a random state parameter for Oauth security
 */
export const generateState = () => {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}

/**
 * Store state in sessionStorage for verification
 */
export const storeOauthState = (state) => {
    sessionStorage.setItem('oauthState', state);
}

/**
 * Verify Oauth state parameter
 **/
export const verifyOauthState = (receivedState) => {
    const storedState = sessionStorage.getItem('oauth_state');
    sessionStorage.removeItem('oauth_state');
    return storedState === receivedState;
}

/**
 * Build Oauth authorization URL
 */
export const buildOauthUrl = (provider, state) => {
    const config = OAUTH_CONFIG[provider];
    const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        scope: config.scope,
        response_type: config.responseType || 'code',
        state: state
    })

    return `${config.authUrl}?${params.toString()}`;
}

/**
 * Initiate Oauth flow
 */
export const initiateOauthFlow = (provider) => {
    const state = generateState();
    storeOauthState(state);
    window.location.href = buildOauthUrl(provider, state);
}

/**
 * Handle Oauth callback
 */

export const handleOauthCallback = (searchParams) => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
        throw new Error(`Oauth error: ${error}`);
    }

    if (!code) {
        throw new Error('Oauth code not found');
    }

    if (!verifyOauthState(state)) {
        throw new Error('Invalid state parameter - possible CSRF attack');
    }

    return {code, state};
}