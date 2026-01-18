import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}
export interface uploadProfile{
    name:string
}
export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    roles?: Role[];
    [key: string]: unknown; // This allows for additional properties...
}

export interface Role{
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}
export interface Permission{
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}
export interface AssignRole{
    roles: Role[];
    user_roles: string[];
}

export interface AssignPermission{
    permissions: Permission[];
    role_permissions: string[];
}