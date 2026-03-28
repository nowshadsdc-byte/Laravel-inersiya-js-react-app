export interface Batch {
    id: number;
    name: string;
}

export interface Course {
    id: number;
    name: string;
}

export interface Student {
    id: number;
    name: string;
    email: string;
    batch_id: number;
    courses: Course[];
    batch?: Batch;
}
