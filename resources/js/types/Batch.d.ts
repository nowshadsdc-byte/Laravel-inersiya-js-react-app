export interface Batch {
  id: number
  name: string
  course_id: number
  start_date: string | null
  end_date: string | null
  TotalClass: string | null
  created_at: string
  updated_at: string
  students?: Array 
}


export interface Course {
  id: number
  name: string
}

export interface BatchFormData {
  name: string
  course_id: number | ""
  batch_code: string | " "
  start_date: string
  end_date: string
  TotalClass: number | 30
}