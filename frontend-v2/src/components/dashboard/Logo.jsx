import { Shield } from "lucide-react";

export default function Logo() {
    return (
        <div className="flex items-center gap-4">

            <div
                className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-gradient-to-br
                    from-blue-600
                    via-indigo-600
                    to-purple-600
                    shadow-lg
                    shadow-blue-600/20
                "
            >
                <Shield
                    size={30}
                    className="text-white"
                    strokeWidth={2.5}
                />
            </div>

            <div>

                <h1 className="text-xl font-black tracking-[0.18em] text-white">
                    MINERVA
                </h1>

                <p className="mt-1 text-xs uppercase tracking-[0.45em] text-slate-400">
                    SENTINEL
                </p>

            </div>

        </div>
    );
}