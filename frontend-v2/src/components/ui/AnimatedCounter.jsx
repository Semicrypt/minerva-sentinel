import { useEffect, useState } from "react";

export default function AnimatedCounter({

    value,

    suffix = ""

}) {

    const [display, setDisplay] = useState(0);

    useEffect(() => {

        let current = 0;

        const target = Number(value);

        const increment = target / 30;

        const timer = setInterval(() => {

            current += increment;

            if (current >= target) {

                current = target;

                clearInterval(timer);

            }

            setDisplay(Math.round(current));

        }, 20);

        return () => clearInterval(timer);

    }, [value]);

    return (
        <span>

            {display}

            {suffix}

        </span>
    );

}