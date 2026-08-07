export default function ServiceOverview() {

    return (

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl">

            <h2 className="mb-6 text-2xl font-bold text-white">

                Active Services

            </h2>

            <div className="space-y-4">

                <Service
                    name="Google"
                    status="Online"
                />

                <Service
                    name="AWS API"
                    status="Online"
                />

                <Service
                    name="PostgreSQL"
                    status="Healthy"
                />

            </div>

        </div>

    );

}

function Service({

    name,

    status

}) {

    return (

        <div className="flex items-center justify-between rounded-xl bg-slate-800/40 p-4">

            <span className="text-white">

                {name}

            </span>

            <span className="text-emerald-400">

                ● {status}

            </span>

        </div>

    );

}