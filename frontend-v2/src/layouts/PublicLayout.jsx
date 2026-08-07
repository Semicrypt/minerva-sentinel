import AnimatedBackground from "../components/landing/AnimatedBackground";
import Navbar from "../components/landing/Navbar";

export default function PublicLayout({ children }) {

    return (

        <div className="relative min-h-screen overflow-hidden bg-transparent text-white">

            <AnimatedBackground />

            <Navbar />

            <main className="relative z-10">

                {children}

            </main>

        </div>

    );

}