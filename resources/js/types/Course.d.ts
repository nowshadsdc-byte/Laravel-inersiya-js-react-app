export interface Course {
    id: string | number | null;
    name: string;
    course_code: string;
    description: string;
    batch?: Array;
}
