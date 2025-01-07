export interface Student extends Document {
    firstName: string;
    email: string;
}

export interface Hobbies extends Document {
    title: string;
    student_id: string
}