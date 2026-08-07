import {
    useState
} from "react";

import {
    X,
    Server,
    Copy,
    Check,
    Terminal,
    Activity,
    Wifi,
    ShieldCheck
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| Configuration
|--------------------------------------------------------------------------
|
| Current WSL backend address.
|
| When Minerva is deployed to a VPS/cloud server, this can later come from
| an environment variable instead of being hard-coded.
|--------------------------------------------------------------------------
*/

const DEFAULT_SERVER_IP =
    "172.27.110.97";

const DEFAULT_API_URL =
    `http://${DEFAULT_SERVER_IP}:5000/api/metrics`;

/*
|--------------------------------------------------------------------------
| Copy Button
|--------------------------------------------------------------------------
*/

function CopyButton({
    value,
    label = "Copy"
}) {

    const [copied, setCopied] =
        useState(false);

    async function handleCopy() {

        try {

            await navigator.clipboard.writeText(
                value
            );

            setCopied(true);

            setTimeout(
                () =>
                    setCopied(false),
                1500
            );

        }
        catch (error) {

            console.error(
                "Unable to copy:",
                error
            );

        }

    }

    return (

        <button
            type="button"
            onClick={handleCopy}
            className="
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-slate-700
                bg-slate-900
                px-3
                py-2
                text-xs
                font-semibold
                text-slate-300
                transition
                hover:border-blue-500/50
                hover:text-white
            "
        >

            {
                copied
                    ? (
                        <>
                            <Check
                                size={14}
                                className="text-emerald-400"
                            />

                            Copied
                        </>
                    )
                    : (
                        <>
                            <Copy size={14} />

                            {label}
                        </>
                    )
            }

        </button>

    );

}

/*
|--------------------------------------------------------------------------
| Code Block
|--------------------------------------------------------------------------
*/

function CodeBlock({
    value
}) {

    return (

        <div className="relative mt-3 rounded-2xl border border-slate-800 bg-slate-950 p-4">

            <pre className="overflow-x-auto pr-20 text-sm leading-7 text-slate-300">

                {value}

            </pre>

            <div className="absolute right-3 top-3">

                <CopyButton
                    value={value}
                />

            </div>

        </div>

    );

}

/*
|--------------------------------------------------------------------------
| Add Host / Agent Onboarding Modal
|--------------------------------------------------------------------------
*/

export default function AddHostModal({

    open,

    onClose

}) {

    if (!open) {

        return null;

    }

    const installCommand =
`cd ~/hybrid-cloud-monitor-v2/agent
npm install`;

    const envConfiguration =
`API_URL=${DEFAULT_API_URL}
API_KEY=minerva-agent
INTERVAL=10000`;

    const startCommand =
`cd ~/hybrid-cloud-monitor-v2/agent
node src/agent.js`;

    return (

        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                overflow-y-auto
                bg-black/75
                p-6
                backdrop-blur-sm
            "
        >

            <div
                className="
                    my-auto
                    w-full
                    max-w-4xl
                    rounded-3xl
                    border
                    border-slate-800
                    bg-[#111827]
                    shadow-2xl
                    shadow-black/50
                "
            >

                {/* Header */}

                <div className="flex items-center justify-between border-b border-slate-800 px-8 py-6">

                    <div className="flex items-center gap-4">

                        <div
                            className="
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-2xl
                                bg-blue-500/10
                            "
                        >

                            <Server
                                size={24}
                                className="text-blue-400"
                            />

                        </div>

                        <div>

                            <h2 className="text-2xl font-semibold text-white">

                                Add Infrastructure Host

                            </h2>

                            <p className="mt-1 text-sm text-slate-400">

                                Connect another machine using the Minerva Sentinel Agent.

                            </p>

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-xl
                            p-2
                            text-slate-400
                            transition
                            hover:bg-slate-800
                            hover:text-white
                        "
                    >

                        <X size={20} />

                    </button>

                </div>

                {/* Content */}

                <div className="space-y-8 p-8">

                    {/* Architecture */}

                    <div className="grid gap-4 md:grid-cols-4">

                        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">

                            <Terminal
                                size={22}
                                className="text-blue-400"
                            />

                            <p className="mt-4 font-semibold text-white">

                                Minerva Agent

                            </p>

                            <p className="mt-1 text-sm text-slate-500">

                                Collects host metrics

                            </p>

                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">

                            <Wifi
                                size={22}
                                className="text-cyan-400"
                            />

                            <p className="mt-4 font-semibold text-white">

                                Metrics API

                            </p>

                            <p className="mt-1 text-sm text-slate-500">

                                Sends metrics to Minerva

                            </p>

                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">

                            <Activity
                                size={22}
                                className="text-violet-400"
                            />

                            <p className="mt-4 font-semibold text-white">

                                Monitoring

                            </p>

                            <p className="mt-1 text-sm text-slate-500">

                                CPU, RAM, disk, uptime

                            </p>

                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">

                            <ShieldCheck
                                size={22}
                                className="text-emerald-400"
                            />

                            <p className="mt-4 font-semibold text-white">

                                Registration

                            </p>

                            <p className="mt-1 text-sm text-slate-500">

                                Appears automatically

                            </p>

                        </div>

                    </div>

                    {/* Backend */}

                    <section>

                        <div className="flex items-center justify-between gap-4">

                            <div>

                                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">

                                    Minerva Backend

                                </p>

                                <h3 className="mt-1 text-lg font-semibold text-white">

                                    Metrics Endpoint

                                </h3>

                            </div>

                            <CopyButton
                                value={DEFAULT_API_URL}
                                label="Copy URL"
                            />

                        </div>

                        <div className="mt-3 rounded-2xl border border-blue-500/20 bg-blue-500/5 px-5 py-4">

                            <code className="text-sm text-blue-300">

                                {DEFAULT_API_URL}

                            </code>

                        </div>

                    </section>

                    {/* Step 1 */}

                    <section>

                        <div className="flex items-center gap-3">

                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-sm font-bold text-blue-400">

                                1

                            </div>

                            <h3 className="text-lg font-semibold text-white">

                                Install the agent dependencies

                            </h3>

                        </div>

                        <CodeBlock
                            value={installCommand}
                        />

                    </section>

                    {/* Step 2 */}

                    <section>

                        <div className="flex items-center gap-3">

                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/10 text-sm font-bold text-cyan-400">

                                2

                            </div>

                            <h3 className="text-lg font-semibold text-white">

                                Configure the agent

                            </h3>

                        </div>

                        <p className="mt-3 text-sm leading-6 text-slate-400">

                            Create or update the agent's .env file with the
                            Minerva backend address.

                        </p>

                        <CodeBlock
                            value={envConfiguration}
                        />

                    </section>

                    {/* Step 3 */}

                    <section>

                        <div className="flex items-center gap-3">

                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/10 text-sm font-bold text-violet-400">

                                3

                            </div>

                            <h3 className="text-lg font-semibold text-white">

                                Start monitoring

                            </h3>

                        </div>

                        <CodeBlock
                            value={startCommand}
                        />

                    </section>

                    {/* Result */}

                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">

                        <div className="flex items-start gap-4">

                            <Check
                                size={22}
                                className="mt-0.5 shrink-0 text-emerald-400"
                            />

                            <div>

                                <h3 className="font-semibold text-emerald-300">

                                    Automatic host discovery

                                </h3>

                                <p className="mt-2 leading-7 text-slate-400">

                                    You do not need to manually create the host
                                    in Minerva Sentinel. After the agent sends
                                    its first metric payload, the backend
                                    registers or updates the host automatically
                                    and it will appear on this Infrastructure
                                    page.

                                </p>

                            </div>

                        </div>

                    </div>

                    {/* Network warning */}

                    <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5">

                        <p className="font-semibold text-orange-300">

                            Network note

                        </p>

                        <p className="mt-2 leading-7 text-slate-400">

                            172.27.110.97 is currently the WSL address of this
                            Minerva development environment. A separate physical
                            computer may require the LAN IP address of the
                            Windows machine or the public/private address of the
                            server where Minerva is deployed.

                        </p>

                    </div>

                </div>

                {/* Footer */}

                <div className="flex items-center justify-between border-t border-slate-800 px-8 py-6">

                    <p className="text-sm text-slate-500">

                        Hosts report every 10 seconds by default.

                    </p>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-xl
                            bg-gradient-to-r
                            from-blue-600
                            to-cyan-500
                            px-6
                            py-3
                            font-semibold
                            text-white
                            transition
                            hover:scale-[1.02]
                        "
                    >

                        Done

                    </button>

                </div>

            </div>

        </div>

    );

}