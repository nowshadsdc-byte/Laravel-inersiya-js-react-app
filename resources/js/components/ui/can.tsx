import { usePage } from '@inertiajs/react';

type CanProps = {
    permission: string;
    children: React.ReactNode;
};

type Auth = {
    permissions?: string[];
    [key: string]: any;
};

export default function Can({ permission, children }: CanProps) {

    const auth = usePage().props.auth as Auth;
    const hasPermission = auth?.permissions?.includes(permission);

    // If they have it, render the children; otherwise, render nothing
    if (hasPermission) {
        return <>{children}</>;
    }

    return null;
}