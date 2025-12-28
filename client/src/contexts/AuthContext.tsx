import React, { createContext, useContext, useEffect, useState } from 'react';
import { type User, onAuthStateChanged, signInWithRedirect, getRedirectResult, signOut, browserLocalPersistence } from 'firebase/auth';
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
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    console.log("AuthProvider Mounted");
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Check for redirect result independently (doesn't block auth state)
        getRedirectResult(auth)
            .then((result) => {
                if (result) {
                    console.log("Redirect Login Successful. User:", result.user.email);
                } else {
                    console.log("No redirect result (Normal page load).");
                }
            })
            .catch((error) => {
                console.error("Redirect Result Error:", error);
            });

        // 2. Listen for auth state changes (this is the single source of truth)
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log("Auth State Changed:", user ? `Logged in as ${user.email}` : "Logged Out");
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const loginWithGoogle = async () => {
        try {
            console.log("Setting persistence to LOCAL...");
            await auth.setPersistence(browserLocalPersistence);
            console.log("Persistence set. Starting Redirect...");
            await signInWithRedirect(auth, googleProvider);
        } catch (error: any) {
            console.error("Login Initiation Error:", error);
            throw error;
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
