import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { BatchFormData } from '@/types/Batch';
import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
export default function Update({batch,courses ,error}: {batch: { id: number; name: string, course_id: number, start_date: string, end_date: string, TotalClass: number }; courses: { id: number; name: string }[]; error?: string}) {

    const { data, setData, put, processing, errors } =
    useForm<BatchFormData>({
      name: batch.name,
      course_id: batch.course_id,
      start_date: batch.start_date ?? "",
      end_date: batch.end_date ?? "",
      TotalClass: batch.TotalClass,
    })


  function submit(e: React.FormEvent) {
    e.preventDefault();
    put(`/batch/edit/${batch.id}`);
  }

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Batches/Update',
      href: dashboard().url,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Batch Dashboard" />
      {error && <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">{error}</div>}
      <div className="p-6">
       <div>
        <h1 className="text-2xl font-bold mb-4">Update Batch: {batch.name}</h1>
        
        <form onSubmit={submit} className="max-w-lg space-y-4">
          <input type="hidden" name="_method" value="PUT" />
          <div className="flex flex-col">
            <div>
              <label className="block text-sm font-medium text-gray-700">Batch Name</label>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={(e)=>setData("name",e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            <div className="my-4">
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={data.start_date ?? ''}
                onChange={(e)=>setData('start_date', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.start_date && <p className="text-red-500 text-sm">{errors.start_date}</p>}
            </div>
            <div className="my-4">
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                name="end_date"
                value={data.end_date ?? ''}
                onChange={(e)=>setData('end_date', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.end_date && <p className="text-red-500 text-sm">{errors.end_date}</p>}
            </div>
            <div className="my-4">
              <label className="block text-sm font-medium text-gray-700">Total Classes</label>
              <input
                type="number"
                name="TotalClass"
                value={data.TotalClass ?? ''}
                onChange={(e)=>setData('TotalClass', e.target.value ? parseInt(e.target.value) : batch.TotalClass)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.TotalClass && <p className="text-red-500 text-sm">{errors.TotalClass}</p>}
            </div>
            <div className="my-4">
              <label className="block text-sm font-medium text-gray-700">Course</label>
              <select
                name="course_id"
                value={data.course_id ?? ''}
                onChange={(e)=>setData('course_id', e.target.value ? parseInt(e.target.value) : batch.course_id)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            {errors.course_id && <p className="text-red-500 text-sm">{errors.course_id}</p>}
            </div>
            <div className="mt-4">
              <button
                type="submit"
                disabled ={processing}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {processing ? "Updating..." : "Update Batch"}
              </button>
              
            </div>
          </div>
        </form>
       </div>
    </div>
    </AppLayout>
  );
 }
