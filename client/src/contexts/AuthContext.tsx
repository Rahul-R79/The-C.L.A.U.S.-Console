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

        // The Source of Truth: Listen for Auth Changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (mounted) {
                console.log("Auth State Changed:", user ? "Logged In" : "Logged Out");
                setCurrentUser(user);
                setLoading(false);
            }
        });

        // Optional: Check redirect result for logging/debugging
        getRedirectResult(auth).catch(e => console.log("Redirect check info:", e));

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, []);

    const loginWithGoogle = async () => {
        try {
            console.log("Attempting Popup Login...");
            await signInWithPopup(auth, googleProvider);
        } catch (error: any) {
            console.error("Popup Failed:", error.code);

            console.log("Falling back to Redirect Method...");
            try {
                // Ensure persistence is Local before redirecting
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
