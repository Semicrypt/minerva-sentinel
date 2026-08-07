import {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    CheckCircle2,
    CircleX,
    Clock3
} from "lucide-react";

import {
    getServices,
    getServiceHistory
} from "../../services/serviceService";

/*
|--------------------------------------------------------------------------
| Calculate Uptime
|--------------------------------------------------------------------------
*/

function calculateUptime(
    history
) {

    if (
        !Array.isArray(history) ||
        history.length === 0
    ) {

        return "--";

    }

    const successfulChecks =
        history.filter(
            check =>
                String(
                    check.status
                ).toUpperCase() ===
                "UP"
        ).length;

    const percentage =
        (
            successfulChecks /
            history.length
        ) * 100;

    return `${percentage.toFixed(2)}%`;

}

/*
|--------------------------------------------------------------------------
| Latest Check
|--------------------------------------------------------------------------
*/

function getLatestCheck(
    history
) {

    if (
        !Array.isArray(history) ||
        history.length === 0
    ) {

        return null;

    }

    return history[
        history.length - 1
    ];

}

/*
|--------------------------------------------------------------------------
| Format Last Checked
|--------------------------------------------------------------------------
*/

function formatCheckedAt(
    value
) {

    if (!value) {

        return "--";

    }

    const date =
        new Date(
            value
        );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "--";

    }

    return date.toLocaleTimeString(
        [],
        {
            hour:
                "2-digit",

            minute:
                "2-digit",

            second:
                "2-digit"
        }
    );

}

/*
|--------------------------------------------------------------------------
| Service Health
|--------------------------------------------------------------------------
*/

export default function ServiceHealth() {

    const [services, setServices] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    /*
    |--------------------------------------------------------------------------
    | Load Service Health
    |--------------------------------------------------------------------------
    */

    const loadServiceHealth =
        useCallback(
            async () => {

                try {

                    setError(
                        null
                    );

                    const serviceData =
                        await getServices();

                    if (
                        !Array.isArray(
                            serviceData
                        )
                    ) {

                        setServices(
                            []
                        );

                        return;

                    }

                    const enriched =
                        await Promise.all(

                            serviceData.map(
                                async service => {

                                    try {

                                        const history =
                                            await getServiceHistory(
                                                service.id
                                            );

                                        const latest =
                                            getLatestCheck(
                                                history
                                            );

                                        return {

                                            ...service,

                                            history:
                                                Array.isArray(
                                                    history
                                                )
                                                    ? history
                                                    : [],

                                            uptime:
                                                calculateUptime(
                                                    history
                                                ),

                                            responseTime:
                                                latest
                                                    ? Number(
                                                        latest.response_time_ms || 0
                                                    )
                                                    : null,

                                            httpStatus:
                                                latest
                                                    ? latest.http_status
                                                    : null,

                                            lastChecked:
                                                latest
                                                    ? latest.checked_at
                                                    : null

                                        };

                                    }

                                    catch (
                                        historyError
                                    ) {

                                        console.error(
                                            `Unable to load history for service ${service.id}:`,
                                            historyError
                                        );

                                        return {

                                            ...service,

                                            history:
                                                [],

                                            uptime:
                                                "--",

                                            responseTime:
                                                null,

                                            httpStatus:
                                                null,

                                            lastChecked:
                                                null

                                        };

                                    }

                                }
                            )

                        );

                    setServices(
                        enriched
                    );

                }

                catch (
                    requestError
                ) {

                    console.error(
                        "Unable to load service health:",
                        requestError
                    );

                    setError(
                        "Unable to load monitored services."
                    );

                }

                finally {

                    setLoading(
                        false
                    );

                }

            },
            []
        );

    /*
    |--------------------------------------------------------------------------
    | Automatic Refresh
    |--------------------------------------------------------------------------
    */

    useEffect(
        () => {

            loadServiceHealth();

            const interval =
                setInterval(

                    loadServiceHealth,

                    10000

                );

            return () =>
                clearInterval(
                    interval
                );

        },
        [
            loadServiceHealth
        ]
    );

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (
        loading
    ) {

        return (

            <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

                <h2 className="text-3xl font-bold text-white">

                    Service Health

                </h2>

                <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/40 py-16 text-center text-slate-500">

                    Loading monitored services...

                </div>

            </section>

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Page
    |--------------------------------------------------------------------------
    */

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        Service Health

                    </h2>

                    <p className="mt-2 text-slate-400">

                        Real availability and response data from monitored services.

                    </p>

                </div>

                <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400">

                    {services.length} Services

                </span>

            </div>

            {
                error && (

                    <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-300">

                        {error}

                    </div>

                )
            }

            {
                services.length === 0
                    ? (

                        <div className="mt-8 rounded-2xl border border-dashed border-slate-800 py-16 text-center text-slate-500">

                            No monitored services available.

                        </div>

                    )
                    : (

                        <div className="mt-8 space-y-4">

                            {
                                services.map(
                                    service => {

                                        const isUp =
                                            String(
                                                service.status
                                            ).toUpperCase() ===
                                            "UP";

                                        return (

                                            <div
                                                key={service.id}
                                                className="
                                                    flex
                                                    flex-col
                                                    gap-5
                                                    rounded-2xl
                                                    border
                                                    border-slate-800
                                                    bg-slate-900/40
                                                    p-5
                                                    transition
                                                    hover:border-cyan-500/30
                                                    lg:flex-row
                                                    lg:items-center
                                                    lg:justify-between
                                                "
                                            >

                                                <div>

                                                    <div className="flex items-center gap-3">

                                                        <h3 className="text-lg font-bold text-white">

                                                            {service.name}

                                                        </h3>

                                                        <span className="rounded-lg bg-slate-800 px-2 py-1 text-xs uppercase text-slate-400">

                                                            {service.service_type}

                                                        </span>

                                                    </div>

                                                    <p className="mt-2 max-w-lg truncate text-sm text-slate-500">

                                                        {service.url}

                                                    </p>

                                                    <p className="mt-2 text-slate-400">

                                                        Uptime:{" "}

                                                        <span className="font-semibold text-white">

                                                            {service.uptime}

                                                        </span>

                                                    </p>

                                                </div>

                                                <div className="flex flex-wrap items-center gap-8">

                                                    <div>

                                                        <p className="text-sm text-slate-500">

                                                            Response

                                                        </p>

                                                        <p className="mt-1 font-semibold text-white">

                                                            {
                                                                service.responseTime !== null
                                                                    ? `${service.responseTime} ms`
                                                                    : "--"
                                                            }

                                                        </p>

                                                    </div>

                                                    <div>

                                                        <p className="text-sm text-slate-500">

                                                            HTTP

                                                        </p>

                                                        <p className="mt-1 font-semibold text-white">

                                                            {
                                                                service.httpStatus ||
                                                                "--"
                                                            }

                                                        </p>

                                                    </div>

                                                    <div>

                                                        <p className="text-sm text-slate-500">

                                                            Last Check

                                                        </p>

                                                        <div className="mt-1 flex items-center gap-2 text-white">

                                                            <Clock3
                                                                size={15}
                                                                className="text-slate-500"
                                                            />

                                                            <span className="font-semibold">

                                                                {
                                                                    formatCheckedAt(
                                                                        service.lastChecked
                                                                    )
                                                                }

                                                            </span>

                                                        </div>

                                                    </div>

                                                    {
                                                        isUp
                                                            ? (

                                                                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400">

                                                                    <CheckCircle2
                                                                        size={16}
                                                                    />

                                                                    UP

                                                                </div>

                                                            )
                                                            : (

                                                                <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-sm font-semibold text-red-400">

                                                                    <CircleX
                                                                        size={16}
                                                                    />

                                                                    DOWN

                                                                </div>

                                                            )
                                                    }

                                                </div>

                                            </div>

                                        );

                                    }
                                )
                            }

                        </div>

                    )
            }

        </section>

    );

}