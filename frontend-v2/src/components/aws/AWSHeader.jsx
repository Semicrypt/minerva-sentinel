import {
    Cloud,
    RefreshCw,
    MapPin,
    ShieldCheck
} from "lucide-react";

export default function AWSHeader() {

    return (

        <section
            className="
                rounded-[32px]
                border
                border-slate-800
                bg-[#111827]
                p-8
                shadow-xl
                shadow-black/20
            "
        >

            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                <div>

                    <div className="flex items-center gap-3">

                        <div
                            className="
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-2xl
                                bg-orange-500/10
                            "
                        >

                            <Cloud
                                size={28}
                                className="text-orange-400"
                            />

                        </div>

                        <div>

                            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">

                                Amazon Web Services

                            </p>

                            <h1 className="mt-1 text-4xl font-black text-white">

                                AWS Resources

                            </h1>

                        </div>

                    </div>

                    <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">

                        Monitor your AWS infrastructure including EC2,
                        CloudWatch, RDS, Lambda, S3, IAM and networking
                        services from a unified cloud operations dashboard.

                    </p>

                </div>

                <div className="grid gap-4">

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            rounded-2xl
                            border
                            border-slate-800
                            bg-slate-900/50
                            px-5
                            py-4
                        "
                    >

                        <div className="flex items-center gap-3">

                            <MapPin
                                size={18}
                                className="text-cyan-400"
                            />

                            <span className="text-slate-300">

                                Region

                            </span>

                        </div>

                        <span className="font-semibold text-white">

                            eu-west-1

                        </span>

                    </div>

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            rounded-2xl
                            border
                            border-slate-800
                            bg-slate-900/50
                            px-5
                            py-4
                        "
                    >

                        <div className="flex items-center gap-3">

                            <ShieldCheck
                                size={18}
                                className="text-emerald-400"
                            />

                            <span className="text-slate-300">

                                Account

                            </span>

                        </div>

                        <span className="font-semibold text-emerald-400">

                            Connected

                        </span>

                    </div>

                    <button
                        className="
                            flex
                            items-center
                            justify-center
                            gap-3
                            rounded-2xl
                            bg-gradient-to-r
                            from-blue-600
                            to-cyan-500
                            px-6
                            py-4
                            font-semibold
                            text-white
                            transition
                            hover:scale-[1.02]
                        "
                    >

                        <RefreshCw size={18} />

                        Refresh Resources

                    </button>

                </div>

            </div>

        </section>

    );

}