import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({

    plugins: [

        react(),

        tailwindcss()

    ],

    /*
    |--------------------------------------------------------------------------
    | Development Server
    |--------------------------------------------------------------------------
    */

    server: {

        host: true,

        port: 5173,

        /*
        |--------------------------------------------------------------------------
        | Backend Proxy
        |--------------------------------------------------------------------------
        |
        | The browser talks only to localhost:5173.
        |
        | Vite forwards backend requests internally to port 5000.
        |
        */

        proxy: {

            /*
            |--------------------------------------------------------------------------
            | REST API
            |--------------------------------------------------------------------------
            */

            "/api": {

                target: "http://127.0.0.1:5000",

                changeOrigin: true

            },

            /*
            |--------------------------------------------------------------------------
            | Socket.IO
            |--------------------------------------------------------------------------
            */

            "/socket.io": {

                target: "http://127.0.0.1:5000",

                changeOrigin: true,

                ws: true

            }

        }

    }

});
