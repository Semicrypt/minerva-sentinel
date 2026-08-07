import {
    CheckCircle2,
    XCircle
} from "lucide-react";

const deployments = [

    {

        version: "v2.1.0",

        environment: "Production",

        commit: "8f4c2a1",

        duration: "2m 41s",

        status: "Success"

    },

    {

        version: "v2.0.9",

        environment: "Production",

        commit: "7d19ab3",

        duration: "2m 08s",

        status: "Success"

    },

    {

        version: "v2.0.8",

        environment: "Staging",

        commit: "3bc7812",

        duration: "1m 52s",

        status: "Failed"

    },

    {

        version: "v2.0.7",

        environment: "Development",

        commit: "af231de",

        duration: "1m 37s",

        status: "Success"

    }

];

export default function DeploymentHistory() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        Deployment History

                    </h2>

                    <p className="mt-2 text-slate-400">

                        Recent deployment activity across all environments.

                    </p>

                </div>

                <span className="rounded-full bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-400">

                    4 Deployments

                </span>

            </div>

            <div className="mt-8 overflow-x-auto">

                <table className="min-w-full">

                    <thead>

                        <tr className="border-b border-slate-800">

                            <th className="pb-4 text-left text-sm text-slate-400">

                                Version

                            </th>

                            <th className="pb-4 text-left text-sm text-slate-400">

                                Environment

                            </th>

                            <th className="pb-4 text-left text-sm text-slate-400">

                                Commit

                            </th>

                            <th className="pb-4 text-left text-sm text-slate-400">

                                Duration

                            </th>

                            <th className="pb-4 text-left text-sm text-slate-400">

                                Status

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            deployments.map((deployment) => (

                                <tr

                                    key={deployment.version}

                                    className="border-b border-slate-800/60 transition hover:bg-slate-900/40"

                                >

                                    <td className="py-5 font-semibold text-white">

                                        {deployment.version}

                                    </td>

                                    <td className="py-5 text-slate-300">

                                        {deployment.environment}

                                    </td>

                                    <td className="py-5 font-mono text-cyan-400">

                                        {deployment.commit}

                                    </td>

                                    <td className="py-5 text-white">

                                        {deployment.duration}

                                    </td>

                                    <td className="py-5">

                                        {

                                            deployment.status === "Success"

                                                ? (

                                                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400">

                                                        <CheckCircle2 size={16} />

                                                        Success

                                                    </span>

                                                )

                                                : (

                                                    <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-sm font-semibold text-red-400">

                                                        <XCircle size={16} />

                                                        Failed

                                                    </span>

                                                )

                                        }

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </section>

    );

}