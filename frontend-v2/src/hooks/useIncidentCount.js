import {
    useCallback,
    useEffect,
    useState
} from "react";

import { getIncidents } from "../services/incident.service";

export default function useIncidentCount() {
    const [count, setCount] = useState(0);

    const loadCount = useCallback(async () => {
        try {
            const incidents = await getIncidents();

            const openIncidents = incidents.filter(
                (incident) =>
                    String(
                        incident?.status || "OPEN"
                    ).toUpperCase() === "OPEN"
            );

            setCount(openIncidents.length);
        } catch (error) {
            console.error(
                "Unable to load incident count:",
                error
            );
        }
    }, []);

    useEffect(() => {
        loadCount();

        const interval = window.setInterval(
            loadCount,
            30000
        );

        return () => {
            window.clearInterval(interval);
        };
    }, [loadCount]);

    return count;
}
