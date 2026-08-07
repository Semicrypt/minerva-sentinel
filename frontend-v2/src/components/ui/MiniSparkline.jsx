export default function MiniSparkline({
    color = "#3B82F6",
    data = [24, 32, 28, 36, 31, 43, 39, 47, 42, 56]
}) {

    const width = 220;
    const height = 55;
    const padding = 6;

    const max = Math.max(...data);
    const min = Math.min(...data);

    const points = data
        .map((value, index) => {

            const x =
                (index / (data.length - 1)) *
                    (width - padding * 2) +
                padding;

            const y =
                height -
                ((value - min) / (max - min || 1)) *
                    (height - padding * 2) -
                padding;

            return `${x},${y}`;

        })
        .join(" ");

    return (

        <svg
            viewBox={`0 0 ${width} ${height}`}
            className="h-14 w-full"
        >

            <polyline
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
            />

        </svg>

    );

}