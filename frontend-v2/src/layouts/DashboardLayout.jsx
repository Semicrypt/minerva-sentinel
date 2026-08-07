import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";

const SIDEBAR_WIDTH = 260;

export default function DashboardLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#050B16] text-white">

            {/* Sidebar */}

            <Sidebar />

            {/* Main Content */}

            <div
                className="flex min-h-screen flex-col"
                style={{
                    marginLeft: SIDEBAR_WIDTH
                }}
            >

                <Navbar />

                <main className="flex-1">

                    <div
                        className="
                            mx-auto
                            w-full
                            max-w-[1700px]
                            px-10
                            pt-16
                            pb-10
                        "
                    >
                        {children}
                    </div>

                </main>

            </div>

        </div>
    );
}