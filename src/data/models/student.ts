import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
}, {timestamps: true});

export default mongoose.model('student', StudentSchema);    