import { Button } from '@/components/ui/button';
import { useForm, usePage } from '@inertiajs/react';

export default function BulkComponent() {
    const { flash, errors } = usePage().props as any;
    const { data, setData, post, processing, reset } = useForm<{
        file: File | null;
    }>({
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
            <div className="w-full max-w-md rounded-lg border p-4">
                <div className="">
                    {flash?.success && (
                        <div className="mb-4 rounded border border-green-400 bg-green-100 p-3 text-green-700">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">
                            {flash.error}
                        </div>
                    )}
                    <form onSubmit={submit} className="">
                        <div className="mb-4">
                            <label
                                htmlFor="file"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Upload File
                            </label>

                            <input
                                className="w-full border-2 border-gray-300 p-2"
                                type="file"
                                accept=".csv,.txt"
                                onChange={(e) =>
                                    setData('file', e.target.files?.[0] || null)
                                }
                            />
                        </div>
                        {errors.file && (
                            <div className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">
                                {errors.file}
                            </div>
                        )}
                        <Button
                            type="submit"
                            disabled={processing || !data.file}
                        >
                            {processing ? 'Uploading...' : 'Upload'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}
