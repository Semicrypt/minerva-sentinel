import {
    KeyRound,
    Database,
    RefreshCw,
    CheckCircle2
} from "lucide-react";

const secrets = [

    {
        name: "Database Credentials",
        type: "PostgreSQL",
        rotation: "30 Days",
        status: "Healthy"
    },

    {
        name: "JWT Secret",
        type: "Application",
        rotation: "60 Days",
        status: "Healthy"
    },

    {
        name: "AWS Access Key",
        type: "Cloud",
        rotation: "90 Days",
        status: "Healthy"
    },

    {
        name: "SMTP Password",
        type: "Email Service",
        rotation: "30 Days",
        status: "Pending"
    }

];

export default function SecretsManager() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        AWS Secrets Manager

                    </h2>

                    <p className="mt-2 text-slate-400">

                        Secure storage and automatic rotation of application secrets.

                    </p>

                </div>

                <span className="rounded-full bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-400">

                    4 Secrets

                </span>

            </div>

            <div className="mt-8 space-y-5">

                {

                    secrets.map((secret) => (

                        <div
                            key={secret.name}
                            className="
                                flex
                                flex-col
                                gap-5
                                rounded-2xl
                                border
                                border-slate-800
                                bg-slate-900/40
                                p-6
                                transition
                                hover:border-violet-500/30
                                lg:flex-row
                                lg:items-center
                                lg:justify-between
                            "
                        >

                            <div className="flex items-center gap-5">

                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">

                                    {

                                        secret.type === "PostgreSQL"

                                            ? (

                                                <Database
                                                    size={26}
                                                    className="text-violet-400"
                                                />

                                            )

                                            : (

                                                <KeyRound
                                                    size={26}
                                                    className="text-violet-400"
                                                />

                                            )

                                    }

                                </div>

                                <div>

                                    <h3 className="text-lg font-bold text-white">

                                        {secret.name}

                                    </h3>

                                    <p className="mt-1 text-slate-400">

                                        {secret.type}

                                    </p>

                                </div>

                            </div>

                            <div className="flex items-center gap-8">

                                <div>

                                    <p className="text-sm text-slate-500">

                                        Rotation

                                    </p>

                                    <div className="flex items-center gap-2">

                                        <RefreshCw
                                            size={16}
                                            className="text-cyan-400"
                                        />

                                        <span className="font-semibold text-white">

                                            {secret.rotation}

                                        </span>

                                    </div>

                                </div>

                                {

                                    secret.status === "Healthy"

                                        ? (

                                            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400">

                                                <CheckCircle2 size={16} />

                                                Healthy

                                            </div>

                                        )

                                        : (

                                            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-sm font-semibold text-amber-400">

                                                <RefreshCw size={16} />

                                                Pending

                                            </div>

                                        )

                                }

                            </div>

                        </div>

                    ))

                }

            </div>

        </section>

    );

}