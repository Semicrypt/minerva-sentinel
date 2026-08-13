import api from "./api";

export const AUTH_CHANGED_EVENT =
    "minerva:auth-changed";

function notifyAuthChanged(user) {
    if (typeof window === "undefined") {
        return;
    }

    window.dispatchEvent(
        new CustomEvent(
            AUTH_CHANGED_EVENT,
            {
                detail: {
                    user
                }
            }
        )
    );
}

export async function login(
    email,
    password
) {
    const response =
        await api.post(
            "/auth/login",
            {
                email,
                password
            }
        );

    const data =
        response.data?.data || {};

    const token =
        data.token;

    if (!token) {
        throw new Error(
            "The login response did not include an authentication token."
        );
    }

    localStorage.setItem(
        "token",
        token
    );

    try {
        /*
        | Load the authenticated account before
        | Login.jsx navigates to the dashboard.
        */

        const user =
            await getCurrentUser();

        notifyAuthChanged(user);

        return {
            ...data,
            user
        };
    } catch (error) {
        localStorage.removeItem(
            "token"
        );

        notifyAuthChanged(null);

        throw error;
    }
}

export async function register(
    fullName,
    email,
    password
) {
    const response =
        await api.post(
            "/auth/register",
            {
                fullName,
                email,
                password
            }
        );

    return response.data;
}

export async function getCurrentUser() {
    const response =
        await api.get(
            "/auth/me"
        );

    return response.data?.data;
}

export function logout() {
    localStorage.removeItem(
        "token"
    );

    notifyAuthChanged(null);
}

export function isAuthenticated() {
    return Boolean(
        localStorage.getItem(
            "token"
        )
    );
}