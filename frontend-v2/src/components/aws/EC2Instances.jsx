import {
    Server,
    Circle
} from "lucide-react";

const instances = [

    {

        name: "minerva-web",

        id: "i-0a84d91f3e",

        type: "t3.medium",

        region: "eu-west-1",

        cpu: "23%",

        ip: "18.203.41.56",

        status: "Running"

    },

    {

        name: "minerva-api",

        id: "i-03bc2f918d",

        type: "t3.small",

        region: "eu-west-1",

        cpu: "31%",

        ip: "54.247.11.92",

        status: "Running"

    },

    {

        name: "postgres-db",

        id: "i-09dcf81b42",

        type: "t3.medium",

        region: "eu-west-1",

        cpu: "18%",

        ip: "Private",

        status: "Running"

    }

];

export default function EC2Instances() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        EC2 Instances

                    </h2>

                    <p className="mt-2 text-slate-400">

                        Compute instances currently deployed in your AWS environment.

                    </p>

                </div>

                <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2">

                    <Circle
                        size={10}
                        fill="#22c55e"
                        className="text-emerald-400"
                    />

                    <span className="text-sm font-semibold text-emerald-400">

                        3 Running

                    </span>

                </div>

            </div>

            <div className="mt-8 overflow-x-auto">

                <table className="min-w-full">

                    <thead>

                        <tr className="border-b border-slate-800 text-left">

                            <th className="pb-4 text-sm font-semibold text-slate-400">

                                Instance

                            </th>

                            <th className="pb-4 text-sm font-semibold text-slate-400">

                                Instance ID

                            </th>

                            <th className="pb-4 text-sm font-semibold text-slate-400">

                                Type

                            </th>

                            <th className="pb-4 text-sm font-semibold text-slate-400">

                                Region

                            </th>

                            <th className="pb-4 text-sm font-semibold text-slate-400">

                                CPU

                            </th>

                            <th className="pb-4 text-sm font-semibold text-slate-400">

                                Public IP

                            </th>

                            <th className="pb-4 text-sm font-semibold text-slate-400">

                                Status

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            instances.map((instance) => (

                                <tr
                                    key={instance.id}
                                    className="border-b border-slate-800/60 transition hover:bg-slate-900/40"
                                >

                                    <td className="py-5">

                                        <div className="flex items-center gap-4">

                                            <div className="rounded-xl bg-orange-500/10 p-3">

                                                <Server
                                                    size={18}
                                                    className="text-orange-400"
                                                />

                                            </div>

                                            <span className="font-semibold text-white">

                                                {instance.name}

                                            </span>

                                        </div>

                                    </td>

                                    <td className="py-5 font-mono text-sm text-slate-400">

                                        {instance.id}

                                    </td>

                                    <td className="py-5 text-white">

                                        {instance.type}

                                    </td>

                                    <td className="py-5 text-slate-300">

                                        {instance.region}

                                    </td>

                                    <td className="py-5">

                                        <span className="font-semibold text-cyan-400">

                                            {instance.cpu}

                                        </span>

                                    </td>

                                    <td className="py-5 text-slate-300">

                                        {instance.ip}

                                    </td>

                                    <td className="py-5">

                                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400">

                                            <Circle
                                                size={8}
                                                fill="#22c55e"
                                            />

                                            {instance.status}

                                        </span>

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