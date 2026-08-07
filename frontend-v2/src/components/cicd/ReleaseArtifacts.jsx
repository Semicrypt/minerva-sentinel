import {
    Package,
    Box,
    FileArchive,
    Calendar,
    Download
} from "lucide-react";

const artifacts = [

    {
        name: "minerva-frontend:v2.1.0",
        type: "Docker Image",
        size: "214 MB",
        created: "2 hours ago"
    },

    {
        name: "minerva-api:v2.1.0",
        type: "Docker Image",
        size: "186 MB",
        created: "2 hours ago"
    },

    {
        name: "build-artifacts.zip",
        type: "Release Bundle",
        size: "52 MB",
        created: "2 hours ago"
    }

];

export default function ReleaseArtifacts() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        Release Artifacts

                    </h2>

                    <p className="mt-2 text-slate-400">

                        Generated deployment packages and Docker images from the latest pipeline.

                    </p>

                </div>

                <span className="rounded-full bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400">

                    {artifacts.length} Artifacts

                </span>

            </div>

            <div className="mt-8 space-y-5">

                {

                    artifacts.map((artifact) => (

                        <div

                            key={artifact.name}

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
                                duration-300
                                hover:border-blue-500/30
                                lg:flex-row
                                lg:items-center
                                lg:justify-between
                            "

                        >

                            <div className="flex items-center gap-5">

                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">

                                    {

                                        artifact.type === "Docker Image"

                                            ? <Box className="text-blue-400" size={24} />

                                            : <FileArchive className="text-amber-400" size={24} />

                                    }

                                </div>

                                <div>

                                    <h3 className="text-lg font-semibold text-white">

                                        {artifact.name}

                                    </h3>

                                    <p className="mt-1 text-slate-400">

                                        {artifact.type}

                                    </p>

                                </div>

                            </div>

                            <div className="flex flex-wrap items-center gap-8">

                                <div>

                                    <p className="text-sm text-slate-500">

                                        Size

                                    </p>

                                    <p className="font-semibold text-white">

                                        {artifact.size}

                                    </p>

                                </div>

                                <div>

                                    <p className="text-sm text-slate-500">

                                        Created

                                    </p>

                                    <div className="flex items-center gap-2">

                                        <Calendar
                                            size={16}
                                            className="text-slate-400"
                                        />

                                        <span className="font-semibold text-white">

                                            {artifact.created}

                                        </span>

                                    </div>

                                </div>

                                <button
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        rounded-xl
                                        bg-blue-500/10
                                        px-4
                                        py-2
                                        text-blue-400
                                        transition
                                        hover:bg-blue-500/20
                                    "
                                >

                                    <Download size={16} />

                                    Download

                                </button>

                            </div>

                        </div>

                    ))

                }

            </div>

        </section>

    );

}