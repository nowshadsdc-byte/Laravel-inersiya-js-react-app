import { useForm } from "@inertiajs/react";
import { Button } from "./ui/button";

export default function AddLead() {

    const {data ,setData , post ,processing ,errors ,reset} = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company: '',
    });
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/leads/create', {
            onSuccess: () => reset(),
        });
    };

   
    return (
        <>
        <h1>Lead Add Component</h1>
        <form method="post" onSubmit={submit}>
            <div>
                <label>First Name:</label>
            </div>

            <Button type="submit">
                {processing ? 'Submitting...' : 'Submit'}
            </Button>
        </form>

           
        </>
    );
}
