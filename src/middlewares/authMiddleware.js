import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Middleware to verify the JWT token from Supabase Auth
export const verifyAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Expecting "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    // Usually, Supabase issues JWTs signed with a specific secret. You can find this secret 
    // in your Supabase Dashboard under Project Settings -> API -> JWT Secret.
    // HOWEVER, we can also use supabase.auth.getUser(token) to verify it against the Supabase API!
    // This is easier because we don't need to manually verify the JWT signature.
    import('../config/supabase.js').then(({ supabase }) => {
        supabase.auth.getUser(token).then(({ data, error }) => {
            if (error || !data.user) {
                return res.status(401).json({ error: 'Unauthorized: Invalid token' });
            }

            // Attach the user object to the request
            req.user = data.user;
            next();
        }).catch((err) => {
            return res.status(500).json({ error: 'Internal server error during auth' });
        });
    }).catch(err => {
        console.error("Failed to load supabase config:", err);
        return res.status(500).json({ error: 'Database configuration error' });
    });
};
