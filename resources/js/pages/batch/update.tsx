import AppLayout from '@/layouts/app-layout'
import { dashboard } from '@/routes'
import { Head, useForm } from '@inertiajs/react'
import { type BreadcrumbItem } from '@/types'

type Batch = Record<string, any>

interface Props {
  batch: Batch
  courses: { id: number; name: string }[]
  error?: string
}

export default function Update({ batch, courses, error }: Props) {
  const { data, setData, put, processing, errors } = useForm<Record<string, any>>({
    ...batch,
  })

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Batches / Update', href: dashboard().url },
  ]

  const formFields = ['name', 'start_date', 'end_date', 'TotalClass', 'batch_code']

  function submit(e: React.FormEvent) {
    e.preventDefault()
    put(`/batch/edit/${batch.id}`)
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Update Batch" />

      {error && <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">{error}</div>}

      <div className="p-6 max-w-lg">
        <h1 className="text-2xl font-bold mb-6">Update Batch: {batch.name}</h1>

        <form onSubmit={submit} className="space-y-4">
          <input type="hidden" name="_method" value="PUT" />

          {formFields.map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 capitalize">
                {field.replace('_', ' ')}
              </label>

              <input
                type={field.includes('date') ? 'date' : field === 'TotalClass' ? 'number' : 'text'}
                value={data[field] ?? ''}
                onChange={(e) => {
                  const value = field === 'TotalClass' ? Number(e.target.value) : e.target.value
                  setData((prev: Record<string, any>) => ({ ...prev, [field]: value }))
                }}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />

              {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700">Course</label>
            <select
              value={data.course_id ?? ''}
              onChange={(e) =>
                setData((prev: Record<string, any>) => ({
                  ...prev,
                  course_id: Number(e.target.value),
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>

            {errors.course_id && (
              <p className="text-red-500 text-sm">{errors.course_id}</p>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {processing ? 'Updating...' : 'Update Batch'}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
