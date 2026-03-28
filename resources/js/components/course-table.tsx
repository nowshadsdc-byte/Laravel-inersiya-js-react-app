import { Course } from '@/types/Course';

interface CourseTableProps {
    course: Course;
}
function isDateString(value: string) {
    // matches: 2025-01-01 or 2025-01-01 10:30:00 or ISO
    return /^\d{4}-\d{2}-\d{2}/.test(value);
}

function formatDate(value: string) {
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;

    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yy = String(date.getFullYear()).slice(-2);

    return `${dd}-${mm}-${yy}`;
}

function renderValue(value: unknown) {
    if (typeof value === 'string') {
        return isDateString(value) ? formatDate(value) : value;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
    }

    // object (nested loop)
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        return (
            <table className="mt-2 w-full border border-gray-200">
                <tbody>
                    {Object.entries(value).map(([k, v]) => (
                        <tr key={k}>
                            <td className="border px-3 py-1 font-medium">
                                {k.replace(/_/g, ' ')}
                            </td>
                            <td className="border px-3 py-1">
                                {renderValue(v)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    // fallback
    return String(value);
}

export function CourseTable({ course }: CourseTableProps) {
    const entries = Object.entries(course).filter(
        ([key, value]) =>
            key !== 'students' &&
            value !== null &&
            value !== undefined &&
            value !== '' &&
            key !== 'batch',
    );

    if (entries.length === 0) {
        return <p className="m-6 text-gray-500">No batch data available</p>;
    }

    return (
        <div className="m-2 rounded-xl bg-white shadow">
            <table className="w-full border border-gray-200">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="border px-4 py-2">Key</th>
                        <th className="border px-4 py-2">Value</th>
                    </tr>
                </thead>

                <tbody>
                    {entries.map(([key, value]) => (
                        <tr key={key} className="align-top hover:bg-gray-50">
                            <td className="border px-4 py-2 font-medium">
                                {key.replace(/_/g, ' ')}
                            </td>
                            <td className="border px-4 py-2">
                                {renderValue(value)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
