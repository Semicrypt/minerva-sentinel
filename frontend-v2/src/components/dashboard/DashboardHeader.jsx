import { ShieldCheck } from "lucide-react";

export default function DashboardHeader() {
    return (

        <section className="mb-14">

            <div className="flex items-center gap-5">

                <div
                    className="
                        flex
                        h-16
                        w-16
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        bg-gradient-to-br
                        from-blue-600
                        via-cyan-500
                        to-sky-400
                        shadow-lg
                        shadow-cyan-500/20
                    "
                >

                    <ShieldCheck
                        size={30}
                        className="text-white"
                    />

                </div>

                <div>

                    <h2 className="text-4xl font-bold tracking-tight text-white">

                        Infrastructure Overview

                    </h2>

                    <p className="mt-2 max-w-3xl text-base leading-7 text-slate-400">

                        Monitor servers, cloud services and application health from one unified dashboard.

                    </p>

                </div>

            </div>

        </section>

    );
}