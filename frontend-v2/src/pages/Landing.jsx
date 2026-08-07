import PublicLayout from "../layouts/PublicLayout";

import Hero from "../components/landing/Hero";
import DashboardPreview from "../components/landing/DashboardPreview";
import TrustedSection from "../components/landing/TrustedSection";
import Features from "../components/landing/Features";
import Architecture from "../components/landing/Architecture";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";

export default function Landing() {

    return (

        <PublicLayout>

            <Hero />

            <DashboardPreview />

            <TrustedSection />

            <Features />

            <Architecture />

            <CTA />

            <Footer />

        </PublicLayout>

    );

}