import { CheckCircle2Icon } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function Alerts(flash: { success?: string; error?: string }) {
    return (
        <div className="grid w-full max-w-xl items-start gap-4">
            <Alert>
                <CheckCircle2Icon />
                <AlertTitle>{flash.success}</AlertTitle>
                <AlertDescription>
                    {flash.success && `  ${flash.success}  `}
                </AlertDescription>
            </Alert>
        </div>
    );
}
