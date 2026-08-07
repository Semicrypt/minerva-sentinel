import axios from "axios";

/*
|--------------------------------------------------------------------------
| API Client
|--------------------------------------------------------------------------
|
| We no longer call http://localhost:5000 directly.
|
| Requests go to:
|
| localhost:5173/api/...
|
| Vite then proxies them internally to:
|
| 127.0.0.1:5000/api/...
|
*/

const api = axios.create({

    baseURL: "/api",

    timeout: 15000

});

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

api.interceptors.request.use(
    config => {

        const token =
            localStorage.getItem(
                "token"
            );

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }

        return config;

    },

    error =>
        Promise.reject(error)
);

/*
|--------------------------------------------------------------------------
| Response Handling
|--------------------------------------------------------------------------
*/

api.interceptors.response.use(

    response =>
        response,

    error => {

        if (
            error.response?.status === 401
        ) {

            console.warn(
                "Session expired. Redirecting to login..."
            );

            localStorage.removeItem(
                "token"
            );

            /*
            | Do not redirect if we're already
            | on the login page.
            */

            if (
                window.location.pathname !==
                "/login"
            ) {

                window.location.href =
                    "/login";

            }

        }

        return Promise.reject(
            error
        );

    }

);

export default api;