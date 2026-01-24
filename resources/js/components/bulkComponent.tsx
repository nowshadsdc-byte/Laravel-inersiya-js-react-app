import { useForm } from "@inertiajs/react";
import { Button } from '@/components/ui/button';
import { usePage } from '@inertiajs/react';

export default function BulkComponent() {
    const { flash, errors } = usePage().props as any;
    const { data, setData, post, processing, reset } = useForm<{ file: File | null }>({
        file: null,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!data.file) {
            return;
        }
        post('/leads/import', {
            forceFormData: true,
            onSuccess: () => {
                reset();
            },
        });
    }

    return (
        <>
            <div className="w-full max-w-md p-4 border rounded-lg">
                <div className="">
                    {flash?.success && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {flash.error}
                        </div>
                    )}
                    <form onSubmit={submit} className="">
                        <div className='mb-4'>
                            <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                                Upload File
                            </label>

                            <input 
                                className='border-2 border-gray-300 p-2 w-full'
                                type="file"
                                accept=".csv,.txt"
                                onChange={e => setData('file', e.target.files?.[0] || null)}
                            />
                        </div>
                        {errors.file && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {errors.file}
                            </div>
                        )}
                        <Button type="submit" disabled={processing || !data.file}>
                            {processing ? 'Uploading...' : 'Upload'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}