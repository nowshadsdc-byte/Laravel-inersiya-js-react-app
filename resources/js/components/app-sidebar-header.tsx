import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Button } from './ui/button';

export function AppSidebarHeader({
    breadcrumbs = [],
    backButton ,
}: {
    breadcrumbs?: BreadcrumbItemType[]; 
    backButton?: boolean;
}) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <div className="ml-auto flex gap-2">
                    {backButton && (
                          <Button variant="outline" size="sm" onClick={(e)=>window.history.back()}>
                        Back
                    </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
