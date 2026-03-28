import React from 'react';

// Refined Type to be more TypeScript friendly
type JSONValue =
    | string
    | number
    | boolean
    | null
    | undefined
    | JSONValue[]
    | { [key: string]: JSONValue };

interface RenderAnyProps {
    data: JSONValue;
}

const RenderAny: React.FC<RenderAnyProps> = ({ data }) => {
    // 1. Blacklist
    const blacklistedKeys = [
        'errors',
        'Field',
        'Value',
        'quote',
        'flash',
        'auth',
        'sidebarOpen',
        'pivot',
        'id',
        'batch_id',
        'course_id',
    ];

    // 2. Helper to format dates
    const formatDate = (key: string, value: any): string => {
        if (typeof value !== 'string') return String(value);
        const isDateKey =
            key.toLowerCase().includes('at') ||
            key.toLowerCase().includes('date');
        const isISOString = /^\d{4}-\d{2}-\d{2}/.test(value);

        if (isDateKey && isISOString) {
            try {
                return new Date(value).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                });
            } catch {
                return value;
            }
        }
        return value;
    };

    // 3. Helper to check if a value is an image URL
    const isImageUrl = (value: any): boolean => {
        if (typeof value !== 'string') return false;
        return /\.(jpeg|jpg|gif|png|webp|svg)$/.test(value);
    };

    if (data === null || data === undefined) return null;

    // 4. Handle Arrays (e.g. Courses)
    if (Array.isArray(data)) {
        return (
            <div className="mt-2 w-full space-y-4">
                {data.map((item, index) => (
                    <div
                        key={index}
                        className="overflow-hidden rounded-r-lg border-l-4 border-indigo-600 bg-white shadow-sm"
                    >
                        <div className="bg-indigo-600 px-4 py-1 text-[10px] font-bold tracking-widest text-white uppercase">
                            Item {index + 1}
                        </div>
                        {/* Recursive call */}
                        <RenderAny data={item as JSONValue} />
                    </div>
                ))}
            </div>
        );
    }

    // 5. Handle Objects (Student info, Batch info)
    if (typeof data === 'object') {
        const sourceData = (data as Record<string, JSONValue>).studentData
            ? (data as Record<string, JSONValue>).studentData
            : data;

        const entries = Object.entries(
            sourceData as Record<string, JSONValue>,
        ).filter(([key]) => !blacklistedKeys.includes(key));

        return (
            <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <table className="min-w-full table-auto text-sm">
                    <tbody className="divide-y divide-gray-100">
                        {entries.map(([key, value]) => {
                            const isNested =
                                value !== null && typeof value === 'object';
                            const isNameField = key.toLowerCase() === 'name';

                            return (
                                <tr
                                    key={key}
                                    className="group transition-colors hover:bg-blue-50/20"
                                >
                                    <td className="w-48 border-r bg-gray-50/50 px-4 py-3 font-bold text-gray-700 capitalize">
                                        {key.replace(/_/g, ' ')}
                                    </td>
                                    <td className="px-4 py-3">
                                        {isNested ? (
                                            <div className="rounded-r-md border-l-4 border-emerald-500 bg-emerald-50/30 p-2">
                                                <div className="mb-2 text-[10px] font-bold text-emerald-700 uppercase">
                                                    {key} Details
                                                </div>
                                                <RenderAny
                                                    data={value as JSONValue}
                                                />
                                            </div>
                                        ) : isImageUrl(value) ? (
                                            <img
                                                src={`/storage/${value as string}`}
                                                alt={key}
                                                className="h-20 w-20 rounded-md border object-cover"
                                            />
                                        ) : (
                                            <span
                                                className={`break-all ${isNameField ? 'text-lg font-extrabold text-blue-700' : 'font-medium text-gray-600'}`}
                                            >
                                                {formatDate(key, value)}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }

    // 6. Primitives
    return <span className="px-2 font-medium">{String(data)}</span>;
};

export default RenderAny;
