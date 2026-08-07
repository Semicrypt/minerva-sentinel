import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Infrastructure from "./pages/Infrastructure";
import Services from "./pages/Services";
import AWSResources from "./pages/AWSResources";
import Containers from "./pages/Containers";
import Observability from "./pages/Observability";
import CICD from "./pages/CICD";
import Alerts from "./pages/Alerts";
import Logs from "./pages/Logs";
import Storage from "./pages/Storage";
import Security from "./pages/Security";
import CostExplorer from "./pages/CostExplorer";
import Settings from "./pages/Settings";

import ProtectedRoute from "./components/auth/ProtectedRoute";

export default function App() {

    return (

        <Routes>

            {/* Public Routes */}

            <Route
                path="/"
                element={<Landing />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            {/* Protected Routes */}

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/infrastructure"
                element={
                    <ProtectedRoute>
                        <Infrastructure />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/services"
                element={
                    <ProtectedRoute>
                        <Services />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/aws"
                element={
                    <ProtectedRoute>
                        <AWSResources />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/containers"
                element={
                    <ProtectedRoute>
                        <Containers />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/observability"
                element={
                    <ProtectedRoute>
                        <Observability />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/cicd"
                element={
                    <ProtectedRoute>
                        <CICD />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/alerts"
                element={
                    <ProtectedRoute>
                        <Alerts />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/logs"
                element={
                    <ProtectedRoute>
                        <Logs />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/storage"
                element={
                    <ProtectedRoute>
                        <Storage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/security"
                element={
                    <ProtectedRoute>
                        <Security />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/cost-explorer"
                element={
                    <ProtectedRoute>
                        <CostExplorer />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/settings"
                element={
                    <ProtectedRoute>
                        <Settings />
                    </ProtectedRoute>
                }
            />

            {/* 404 */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/"
                        replace
                    />
                }
            />

        </Routes>

    );

}