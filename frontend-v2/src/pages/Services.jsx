import {
    useEffect,
    useMemo,
    useState
} from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import ServiceCard from "../components/services/ServiceCard";
import ServicesToolbar from "../components/services/ServicesToolbar";
import AddServiceModal from "../components/services/AddServiceModal";

import {
    getServices,
    createService,
    deleteService
} from "../services/serviceService";

import socket from "../services/socketService";

export default function Services() {

    const [services, setServices] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [showModal, setShowModal] =
        useState(false);

    const [searchQuery, setSearchQuery] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [typeFilter, setTypeFilter] =
        useState("All");

    const [error, setError] =
        useState(null);

    /*
    |--------------------------------------------------------------------------
    | Load Services
    |--------------------------------------------------------------------------
    */

    async function loadServices() {

        try {

            setError(
                null
            );

            const data =
                await getServices();

            setServices(
                Array.isArray(data)
                    ? data
                    : []
            );

        }

        catch (requestError) {

            console.error(
                "Unable to load services:",
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

    }

    /*
    |--------------------------------------------------------------------------
    | Initial Load + Socket Updates
    |--------------------------------------------------------------------------
    */

    useEffect(
        () => {

            loadServices();

            function handleMonitorUpdate() {

                console.log(
                    "📡 Live monitoring update received"
                );

                loadServices();

            }

            socket.on(
                "monitor:update",
                handleMonitorUpdate
            );

            return () => {

                socket.off(
                    "monitor:update",
                    handleMonitorUpdate
                );

            };

        },
        []
    );

    /*
    |--------------------------------------------------------------------------
    | Add Service
    |--------------------------------------------------------------------------
    */

    async function handleAddService(
        form
    ) {

        try {

            await createService(
                form
            );

            await loadServices();

            setShowModal(
                false
            );

        }

        catch (requestError) {

            console.error(
                "Unable to create service:",
                requestError
            );

            alert(
                "Unable to create service."
            );

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Delete Service
    |--------------------------------------------------------------------------
    */

    async function handleDeleteService(
        service
    ) {

        try {

            await deleteService(
                service.id
            );

            setServices(
                currentServices =>
                    currentServices.filter(
                        item =>
                            item.id !==
                            service.id
                    )
            );

        }

        catch (requestError) {

            console.error(
                "Unable to delete service:",
                requestError
            );

            alert(
                "Unable to delete service."
            );

            throw requestError;

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Filter Services
    |--------------------------------------------------------------------------
    */

    const filteredServices =
        useMemo(
            () => {

                const search =
                    searchQuery
                        .trim()
                        .toLowerCase();

                return services.filter(
                    service => {

                        const name =
                            String(
                                service.name || ""
                            )
                                .toLowerCase();

                        const url =
                            String(
                                service.url || ""
                            )
                                .toLowerCase();

                        const status =
                            String(
                                service.status || ""
                            )
                                .toUpperCase();

                        const type =
                            String(
                                service.service_type || ""
                            )
                                .toLowerCase();

                        const matchesSearch =

                            !search ||

                            name.includes(
                                search
                            ) ||

                            url.includes(
                                search
                            );

                        const matchesStatus =

                            statusFilter === "All" ||

                            status ===
                                statusFilter.toUpperCase();

                        const matchesType =

                            typeFilter === "All" ||

                            type ===
                                typeFilter.toLowerCase();

                        return (
                            matchesSearch &&
                            matchesStatus &&
                            matchesType
                        );

                    }
                );

            },
            [
                services,
                searchQuery,
                statusFilter,
                typeFilter
            ]
        );

    /*
    |--------------------------------------------------------------------------
    | Page
    |--------------------------------------------------------------------------
    */

    return (

        <DashboardLayout>

            <section className="mt-8 mb-10">

                <ServicesToolbar
                    searchQuery={
                        searchQuery
                    }
                    setSearchQuery={
                        setSearchQuery
                    }
                    statusFilter={
                        statusFilter
                    }
                    setStatusFilter={
                        setStatusFilter
                    }
                    typeFilter={
                        typeFilter
                    }
                    setTypeFilter={
                        setTypeFilter
                    }
                    onAddServiceClick={
                        () =>
                            setShowModal(
                                true
                            )
                    }
                />

            </section>

            {
                error && (

                    <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-300">

                        {error}

                    </div>

                )
            }

            <section className="pb-8">

                {
                    loading && (

                        <div className="rounded-3xl border border-slate-800 bg-[#111827] py-20 text-center">

                            <p className="text-slate-400">

                                Loading services...

                            </p>

                        </div>

                    )
                }

                {
                    !loading &&
                    services.length === 0 && (

                        <div className="rounded-3xl border border-slate-800 bg-[#111827] py-24 text-center">

                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/10">

                                <span className="text-4xl">

                                    🌐

                                </span>

                            </div>

                            <h3 className="text-2xl font-semibold text-white">

                                No Services Found

                            </h3>

                            <p className="mt-3 text-slate-400">

                                Register your first website, API or cloud service to begin monitoring.

                            </p>

                        </div>

                    )
                }

                {
                    !loading &&
                    services.length > 0 &&
                    filteredServices.length === 0 && (

                        <div className="rounded-3xl border border-slate-800 bg-[#111827] py-20 text-center">

                            <h3 className="text-xl font-semibold text-white">

                                No Matching Services

                            </h3>

                            <p className="mt-3 text-slate-400">

                                Try changing your search or filters.

                            </p>

                        </div>

                    )
                }

                {
                    !loading &&
                    filteredServices.length > 0 && (

                        <div className="grid grid-cols-12 gap-8">

                            {
                                filteredServices.map(
                                    service => (

                                        <div
                                            key={
                                                service.id
                                            }
                                            className="col-span-12"
                                        >

                                            <ServiceCard
                                                service={
                                                    service
                                                }
                                                onDelete={
                                                    handleDeleteService
                                                }
                                            />

                                        </div>

                                    )
                                )
                            }

                        </div>

                    )
                }

            </section>

            <AddServiceModal
                open={
                    showModal
                }
                onClose={
                    () =>
                        setShowModal(
                            false
                        )
                }
                onSubmit={
                    handleAddService
                }
            />

        </DashboardLayout>

    );

}