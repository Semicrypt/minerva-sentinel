import {
    Globe,
    Shield,
    Lock,
    Server,
    KeyRound,
    Database,
    CheckCircle2
} from "lucide-react";

const architecture = [

    {
        icon: Globe,
        title: "Internet",
        subtitle: "Incoming Requests"
    },

    {
        icon: Shield,
        title: "AWS WAF",
        subtitle: "Firewall Protection"
    },

    {
        icon: Lock,
        title: "IAM",
        subtitle: "Authentication"
    },

    {
        icon: Server,
        title: "Application",
        subtitle: "Minerva Sentinel"
    },

    {
        icon: KeyRound,
        title: "Secrets + KMS",
        subtitle: "Credential & Key Management"
    },

    {
        icon: Database,
        title: "PostgreSQL",
        subtitle: "Encrypted Database"
    }

];

export default function SecurityArchitecture() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="mb-10">

                <h2 className="text-3xl font-bold text-white">

                    Security Architecture

                </h2>

                <p className="mt-2 text-slate-400">

                    End-to-end protection across the Minerva Sentinel cloud platform.

                </p>

            </div>

            <div className="grid gap-6 lg:grid-cols-6">

                {

                    architecture.map((item, index) => {

                        const Icon = item.icon;

                        return (

                            <div
                                key={item.title}
                                className="relative"
                            >

                                <div
                                    className="
                                        rounded-3xl
                                        border
                                        border-slate-800
                                        bg-slate-900/40
                                        p-6
                                        text-center
                                        transition
                                        duration-300
                                        hover:-translate-y-1
                                        hover:border-emerald-500/30
                                    "
                                >

                                    <div
                                        className="
                                            mx-auto
                                            flex
                                            h-16
                                            w-16
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            bg-emerald-500/10
                                        "
                                    >

                                        <Icon
                                            size={30}
                                            className="text-emerald-400"
                                        />

                                    </div>

                                    <h3 className="mt-5 text-lg font-bold text-white">

                                        {item.title}

                                    </h3>

                                    <p className="mt-2 text-sm text-slate-400">

                                        {item.subtitle}

                                    </p>

                                    <div
                                        className="
                                            mt-5
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-full
                                            bg-emerald-500/10
                                            px-3
                                            py-1
                                            text-sm
                                            font-semibold
                                            text-emerald-400
                                        "
                                    >

                                        <CheckCircle2 size={16} />

                                        Protected

                                    </div>

                                </div>

                                {

                                    index !== architecture.length - 1 && (

                                        <div
                                            className="
                                                absolute
                                                left-full
                                                top-1/2
                                                hidden
                                                h-1
                                                w-6
                                                -translate-y-1/2
                                                bg-gradient-to-r
                                                from-emerald-500
                                                to-cyan-500
                                                lg:block
                                            "
                                        />

                                    )

                                }

                            </div>

                        );

                    })

                }

            </div>

            <div
                className="
                    mt-10
                    rounded-2xl
                    border
                    border-emerald-500/20
                    bg-emerald-500/5
                    p-6
                "
            >

                <h3 className="text-xl font-bold text-white">

                    Security Workflow

                </h3>

                <p className="mt-4 leading-8 text-slate-300">

                    Every request first passes through AWS WAF for web protection,
                    then IAM validates identity and permissions. Secrets Manager
                    securely provides application credentials, AWS KMS encrypts
                    sensitive information, and PostgreSQL stores data using
                    encrypted volumes, providing layered security throughout the
                    platform.

                </p>

            </div>

        </section>

    );

}