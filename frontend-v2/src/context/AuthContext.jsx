import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";

import {
    AUTH_CHANGED_EVENT,
    getCurrentUser,
    logout as logoutUser
} from "../services/authService";

const AuthContext =
    createContext(null);

export function AuthProvider({
    children
}) {
    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const refreshUser =
        useCallback(async () => {
            const token =
                localStorage.getItem(
                    "token"
                );

            if (!token) {
                setUser(null);

                return null;
            }

            try {
                const currentUser =
                    await getCurrentUser();

                setUser(currentUser);

                return currentUser;
            } catch (error) {
                logoutUser();
                setUser(null);

                throw error;
            }
        }, []);

    /*
    |--------------------------------------------------------------------------
    | Initial Authentication Load
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        setLoading(true);

        refreshUser()
            .catch(() => {
                /*
                | Invalid tokens are removed by
                | refreshUser.
                */
            })
            .finally(() => {
                setLoading(false);
            });
    }, [refreshUser]);

    /*
    |--------------------------------------------------------------------------
    | Same-Browser Authentication Changes
    |--------------------------------------------------------------------------
    |
    | Login.jsx and Sidebar use authService directly.
    | The service sends this event whenever the token
    | changes, keeping Navbar and protected routes in sync.
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        function handleAuthChanged(
            event
        ) {
            const nextUser =
                event.detail?.user ||
                null;

            if (nextUser) {
                setUser(nextUser);
                setLoading(false);

                return;
            }

            const token =
                localStorage.getItem(
                    "token"
                );

            if (!token) {
                setUser(null);
                setLoading(false);

                return;
            }

            setLoading(true);

            refreshUser()
                .catch(() => {
                    /*
                    | refreshUser clears an invalid
                    | authentication session.
                    */
                })
                .finally(() => {
                    setLoading(false);
                });
        }

        window.addEventListener(
            AUTH_CHANGED_EVENT,
            handleAuthChanged
        );

        return () => {
            window.removeEventListener(
                AUTH_CHANGED_EVENT,
                handleAuthChanged
            );
        };
    }, [refreshUser]);

    const signOut =
        useCallback(() => {
            logoutUser();
            setUser(null);
            setLoading(false);
        }, []);

    const value =
        useMemo(
            () => ({
                user,
                loading,
                refreshUser,
                signOut,
                isAuthenticated:
                    Boolean(user)
            }),
            [
                user,
                loading,
                refreshUser,
                signOut
            ]
        );

    return (
        <AuthContext.Provider
            value={value}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider."
        );
    }

    return context;
}