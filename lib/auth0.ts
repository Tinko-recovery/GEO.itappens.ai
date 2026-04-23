import { Auth0Client } from "@auth0/nextjs-auth0/server";

/**
 * Auth0 v4 Client Instance.
 * Corrected configuration:
 * 1. Uses 'issuerBaseUrl' instead of 'domain' for OIDC compliance.
 * 2. Explicitly maps authentication routes to /auth/* prefix.
 */
export const auth0 = new Auth0Client({
    appBaseUrl: process.env.AUTH0_BASE_URL || 'http://localhost:3000',
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    secret: process.env.AUTH0_SECRET,
    // v4 requires issuerBaseUrl with https:// protocol
    issuerBaseUrl: process.env.AUTH0_ISSUER_BASE_URL,
    domain: process.env.AUTH0_DOMAIN,
    routes: {
        login: '/auth/login',
        callback: '/auth/callback',
        logout: '/auth/logout'
    }
});
