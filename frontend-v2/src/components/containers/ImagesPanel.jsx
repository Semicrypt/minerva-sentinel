import {
    Package,
    Circle
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| Helper: Split Repository Tag
|--------------------------------------------------------------------------
|
| Docker image tags normally look like:
|
| nginx:latest
| postgres:17-alpine
|
| Registry images may look like:
|
| 878451097402.dkr.ecr.eu-north-1.amazonaws.com/mongo-demo:1.1
|
*/

function splitRepoTag(repoTag) {

    if (!repoTag) {

        return {
            name: "untagged",
            tag: "none"
        };

    }

    const lastColon =
        repoTag.lastIndexOf(":");

    const lastSlash =
        repoTag.lastIndexOf("/");

    /*
    |--------------------------------------------------------------------------
    | No Tag Found
    |--------------------------------------------------------------------------
    */

    if (
        lastColon === -1 ||
        lastColon < lastSlash
    ) {

        return {
            name: repoTag,
            tag: "latest"
        };

    }

    return {

        name:
            repoTag.substring(
                0,
                lastColon
            ),

        tag:
            repoTag.substring(
                lastColon + 1
            )

    };

}

/*
|--------------------------------------------------------------------------
| Helper: Format Image Size
|--------------------------------------------------------------------------
*/

function formatSize(sizeMB) {

    const size =
        Number(
            sizeMB || 0
        );

    if (size >= 1024) {

        return `${(
            size / 1024
        ).toFixed(2)} GB`;

    }

    return `${size.toFixed(2)} MB`;

}

/*
|--------------------------------------------------------------------------
| Images Panel
|--------------------------------------------------------------------------
*/

export default function ImagesPanel({

    images = [],

    loading = false

}) {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        Docker Images

                    </h2>

                    <p className="mt-2 text-slate-400">

                        Images available on the Docker host.

                    </p>

                </div>

                <span className="rounded-full bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-400">

                    {
                        loading
                            ? "Loading..."
                            : `${images.length} Images`
                    }

                </span>

            </div>

            <div className="mt-8 overflow-x-auto">

                <table className="min-w-full">

                    <thead>

                        <tr className="border-b border-slate-800">

                            <th className="pb-4 text-left text-sm text-slate-400">

                                Image

                            </th>

                            <th className="pb-4 text-left text-sm text-slate-400">

                                Tag

                            </th>

                            <th className="pb-4 text-left text-sm text-slate-400">

                                Size

                            </th>

                            <th className="pb-4 text-left text-sm text-slate-400">

                                Containers

                            </th>

                            <th className="pb-4 text-left text-sm text-slate-400">

                                Status

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            images.map(
                                image => {

                                    const primaryTag =
                                        image.repoTags?.[0] ||
                                        null;

                                    const {
                                        name,
                                        tag
                                    } =
                                        splitRepoTag(
                                            primaryTag
                                        );

                                    return (

                                        <tr
                                            key={image.id}
                                            className="border-b border-slate-800/60 transition hover:bg-slate-900/40"
                                        >

                                            <td className="py-5">

                                                <div className="flex items-center gap-4">

                                                    <div className="rounded-xl bg-violet-500/10 p-3">

                                                        <Package
                                                            size={18}
                                                            className="text-violet-400"
                                                        />

                                                    </div>

                                                    <div>

                                                        <span className="font-semibold text-white">

                                                            {name}

                                                        </span>

                                                        <p className="mt-1 font-mono text-xs text-slate-600">

                                                            {image.shortId}

                                                        </p>

                                                    </div>

                                                </div>

                                            </td>

                                            <td className="py-5">

                                                <span className="rounded-lg bg-slate-800 px-3 py-1 font-mono text-sm text-cyan-400">

                                                    {tag}

                                                </span>

                                            </td>

                                            <td className="py-5 text-white">

                                                {
                                                    formatSize(
                                                        image.sizeMB
                                                    )
                                                }

                                            </td>

                                            <td className="py-5 text-slate-300">

                                                {
                                                    Number(
                                                        image.containers ||
                                                        0
                                                    )
                                                }

                                            </td>

                                            <td className="py-5">

                                                {
                                                    image.inUse
                                                        ? (

                                                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400">

                                                                <Circle
                                                                    size={8}
                                                                    fill="#22c55e"
                                                                />

                                                                In Use

                                                            </span>

                                                        )
                                                        : (

                                                            <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-sm font-semibold text-amber-400">

                                                                <Circle
                                                                    size={8}
                                                                    fill="#f59e0b"
                                                                />

                                                                Available

                                                            </span>

                                                        )
                                                }

                                            </td>

                                        </tr>

                                    );

                                }
                            )

                        }

                        {
                            !loading &&
                            images.length === 0 && (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="py-12 text-center text-slate-500"
                                    >

                                        No Docker images were found.

                                    </td>

                                </tr>

                            )
                        }

                    </tbody>

                </table>

            </div>

        </section>

    );

}