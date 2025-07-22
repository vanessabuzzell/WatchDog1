// middleware/auth.js
import pkg from "express-openid-connect";

const { requiresAuth: realRequiresAuth } = pkg;

export const requiresAuth = () =>
    process.env.NODE_ENV === 'test'
        ? (req, res, next) => {
            req.oidc = { isAuthenticated: () => true, user: { sub: 'test-user' } };
            return next();
        }
        : realRequiresAuth();
