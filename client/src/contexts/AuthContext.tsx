import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    type User,
    onAuthStateChanged,
    signInWithRedirect,
    signInWithPopup,
    getRedirectResult,
    signOut,
    browserLocalPersistence
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const initAuth = async () => {
            console.log("Auth Provider Mounted. URL:", window.location.href);

            // 1. Check for Redirect Result (Mobile Flow)
            try {
                // This checks if we just returned from a signInWithRedirect
                const result = await getRedirectResult(auth);
                if (result) {
                    console.log("Redirect Login Detected & Successful:", result.user.email);
                    // No need to set currentUser manually, onAuthStateChanged will catch it
                } else {
                    console.log("No redirect result (Normal load).");
                }
            } catch (error) {
                console.error("Redirect Check Error:", error);
            }

            // 2. Listen for Auth State
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (!mounted) return;
                console.log("Auth State Changed:", user ? "Logged In" : "Logged Out");
                setCurrentUser(user);
                setLoading(false);
            });

            return unsubscribe;
        };

        const unsubPromise = initAuth();

        return () => {
            mounted = false;
        };
    }, []);

    const loginWithGoogle = async () => {
        try {
            console.log("Attempting Popup Login...");
            // Standard Popup Flow (Best for PWA/Desktop)
            await signInWithPopup(auth, googleProvider);
        } catch (error: any) {
            console.error("Popup Failed:", error.code, error.message);

            // Fallback for Mobile/Blockers/COOP issues
            console.log("Falling back to Redirect Method...");
            try {
                // Force local persistence to survive redirect
                await auth.setPersistence(browserLocalPersistence);
                await signInWithRedirect(auth, googleProvider);
            } catch (redirectError) {
                console.error("Redirect Failed:", redirectError);
                throw redirectError;
            }
        }
    };

    const logout = async () => {
        await signOut(auth);
    };

    const value = {
        currentUser,
        loading,
        loginWithGoogle,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
