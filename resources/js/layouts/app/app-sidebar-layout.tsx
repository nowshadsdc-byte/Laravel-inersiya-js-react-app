import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
    backButton,
}: PropsWithChildren<{
    breadcrumbs?: BreadcrumbItem[];
    backButton?: boolean;
}>) {
    const flash = (usePage().props as any)?.flash;
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader
                    breadcrumbs={breadcrumbs}
                    backButton={backButton}
                />
                {flash?.toast && (
                    <div className="toast">{flash.toast.message}</div>
                )}
                {children}
            </AppContent>
        </AppShell>
    );
}
