import api from "./api";

export async function login(email, password) {

    const response = await api.post("/auth/login", {

        email,
        password

    });

    const token = response.data.data.token;

    localStorage.setItem("token", token);

    return response.data.data;

}

export async function register(fullName, email, password) {

    const response = await api.post("/auth/register", {

        fullName,
        email,
        password

    });

    return response.data;

}

export async function getCurrentUser() {

    const response = await api.get("/auth/me");

    return response.data.data;

}

export function logout() {

    localStorage.removeItem("token");

}

export function isAuthenticated() {

    return !!localStorage.getItem("token");

}