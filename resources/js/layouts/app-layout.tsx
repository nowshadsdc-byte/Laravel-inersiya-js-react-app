import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    backButton?: boolean;
}

export default ({
    children,
    breadcrumbs,
    backButton,
    ...props
}: AppLayoutProps) => (
    <AppLayoutTemplate
        breadcrumbs={breadcrumbs}
        backButton={backButton}
        {...props}
    >
        {children}
    </AppLayoutTemplate>
);
