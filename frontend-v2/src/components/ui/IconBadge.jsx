const colors = {
    blue: "bg-blue-500/10 text-blue-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
    cyan: "bg-cyan-500/10 text-cyan-400",
    purple: "bg-purple-500/10 text-purple-400",
    orange: "bg-orange-500/10 text-orange-400",
    red: "bg-red-500/10 text-red-400"
};

export default function IconBadge({
    icon: Icon,
    color = "blue",
    size = 48
}) {
    return (
        <div
            className={`flex items-center justify-center rounded-2xl ${colors[color]}`}
            style={{
                width: size,
                height: size
            }}
        >
            <Icon size={22} />
        </div>
    );
}