interface DashboardCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
}
export default function DashboardCard({
    title,
    value,
    icon,
}: DashboardCardProps) {
    return (
        <div className="m-2 max-w-[40%] rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <h3 className="mt-1 text-2xl font-semibold text-gray-900">
                        {value}
                    </h3>
                </div>

                {icon && (
                    <div className="m-2 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}
