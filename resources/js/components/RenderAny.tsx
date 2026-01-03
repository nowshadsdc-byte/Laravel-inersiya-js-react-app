import React from 'react';

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
    level?: number;
}

const RenderAny: React.FC<RenderAnyProps> = ({ data, level = 0 }) => {
    if (data === null || data === undefined) {
        return <span className="text-gray-500">null</span>;
    }

    // Array
    if (Array.isArray(data)) {
        return (
            <div className="ml-4 space-y-2">
                {data.map((item, index) => (
                    <div key={index}>
                        <span className="font-semibold">[{index}]</span>
                        <RenderAny data={item} level={level + 1} />
                    </div>
                ))}
            </div>
        );
    }

    // Object
    if (typeof data === 'object') {
        return (
            <div className="ml-4 space-y-1 border-l pl-3">
                {Object.entries(data).map(([key, value]) => (
                    <div key={key}>
                        <div className="font-semibold text-sm">{key}:</div>
                        <RenderAny data={value} level={level + 1} />
                    </div>
                ))}
            </div>
        );
    }

    // Primitive
    return <div className="ml-4">{String(data)}</div>;
};

export default RenderAny;
