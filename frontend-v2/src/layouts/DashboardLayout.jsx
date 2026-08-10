import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen min-w-0 bg-[#050B16] text-white">
            <Sidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex min-h-screen min-w-0 flex-col lg:pl-64">
                <Navbar
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main className="min-w-0 flex-1">
                    <div className="mx-auto w-full max-w-[1700px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}