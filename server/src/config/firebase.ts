import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Initialize Firebase Admin
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!admin.apps.length) {
    try {
        if (serviceAccountPath) {
            const resolvedPath = path.resolve(process.cwd(), serviceAccountPath);

            admin.initializeApp({
                credential: admin.credential.cert(require(resolvedPath)),
            });
        } else {
            console.warn('No GOOGLE_APPLICATION_CREDENTIALS found. Firebase Admin not initialized.');
        }
    } catch (error) {
        console.error('Firebase Admin Initialization Failed:', error);
    }
}

export default admin;
