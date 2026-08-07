import { useEffect, useState } from "react";

import {
    X,
    Globe,
    Save
} from "lucide-react";

export default function AddServiceModal({

    open,
    onClose,
    onSubmit

}) {

    const initialForm = {

        name: "",
        url: "",
        service_type: "website",
        check_interval: 60

    };

    const [form, setForm] = useState(initialForm);

    useEffect(() => {

        if (!open) {

            setForm(initialForm);

        }

    }, [open]);

    if (!open) return null;

    function handleChange(e) {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    }

    function handleSubmit(e) {

        e.preventDefault();

        onSubmit(form);

    }

    return (

        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/70
                backdrop-blur-sm
            "
        >

            <div
                className="
                    w-full
                    max-w-2xl
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

                            <Globe
                                size={24}
                                className="text-blue-400"
                            />

                        </div>

                        <div>

                            <h2 className="text-2xl font-semibold text-white">

                                Add New Service

                            </h2>

                            <p className="mt-1 text-sm text-slate-400">

                                Register a website, API or cloud service for monitoring.

                            </p>

                        </div>

                    </div>

                    <button
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

                {/* Form */}

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-2 gap-6 p-8"
                >

                    <div>

                        <label className="mb-2 block text-sm text-slate-400">

                            Service Name

                        </label>

                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Production Website"
                            required
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-700
                                bg-slate-900
                                px-4
                                py-3
                                text-white
                                outline-none
                                transition
                                focus:border-blue-500
                            "
                        />

                    </div>

                    <div>

                        <label className="mb-2 block text-sm text-slate-400">

                            Service Type

                        </label>

                        <select
                            name="service_type"
                            value={form.service_type}
                            onChange={handleChange}
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-700
                                bg-slate-900
                                px-4
                                py-3
                                text-white
                                outline-none
                                transition
                                focus:border-blue-500
                            "
                        >

                            <option value="website">

                                Website

                            </option>

                            <option value="api">

                                API

                            </option>

                            <option value="database">

                                Database

                            </option>

                            <option value="docker">

                                Docker

                            </option>

                        </select>

                    </div>

                    <div className="col-span-2">

                        <label className="mb-2 block text-sm text-slate-400">

                            URL / Endpoint

                        </label>

                        <input
                            name="url"
                            value={form.url}
                            onChange={handleChange}
                            placeholder="https://example.com"
                            required
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-700
                                bg-slate-900
                                px-4
                                py-3
                                text-white
                                outline-none
                                transition
                                focus:border-blue-500
                            "
                        />

                    </div>

                    <div>

                        <label className="mb-2 block text-sm text-slate-400">

                            Check Interval

                        </label>

                        <select
                            name="check_interval"
                            value={form.check_interval}
                            onChange={handleChange}
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-700
                                bg-slate-900
                                px-4
                                py-3
                                text-white
                                outline-none
                                transition
                                focus:border-blue-500
                            "
                        >

                            <option value={30}>30 Seconds</option>
                            <option value={60}>60 Seconds</option>
                            <option value={120}>120 Seconds</option>
                            <option value={300}>5 Minutes</option>

                        </select>

                    </div>

                    <div className="flex items-end">

                        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm text-slate-300">

                            Services will automatically begin monitoring after they are created.

                        </div>

                    </div>

                    {/* Footer */}

                    <div className="col-span-2 flex justify-end gap-4 border-t border-slate-800 pt-6">

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                rounded-xl
                                border
                                border-slate-700
                                px-6
                                py-3
                                text-slate-300
                                transition
                                hover:border-slate-500
                            "
                        >

                            Cancel

                        </button>

                        <button
                            type="submit"
                            className="
                                flex
                                items-center
                                gap-2
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

                            <Save size={18} />

                            Add Service

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}