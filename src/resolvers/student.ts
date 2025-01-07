import repository from "@data/repository";
import { Hobbies, Student } from "@utils/interfaces";
import { ObjectId } from "mongodb";

const StudentResolvers = {
  Query: {
    getStudent: async (_: any, { id }: { id: string }) => {
      const studentId = new ObjectId(id);
      return repository.findRecordBy<Student>("student", {
        query: { _id: studentId },
      });
    },
    getAllStudents: async () => {
      const students = await repository.aggregate<Student>("student", [
        {
          $lookup: {
            from: "hobbies",
            localField: "_id",
            foreignField: "student_id",
            as: "hobbies",
          },
        },
        {
          $unwind: {
            path: "$hobbies",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$_id",
            firstName: { $first: "$firstName" },
            email: { $first: "$email" },
            hobbies: { $push: "$hobbies" },
          },
        },
        {
          $sort: { createdAt: 1 }
        }
      ]);

      return students;
    },
    getUserHobbies: async (_: any, { id }: { id: string }) => {
      const studentId = new ObjectId(id);
      return repository.findRecordsBy<Hobbies>("hobbies", {
        query: { student_id: studentId },
      });
    },
  },
  Mutation: {
    createStudent: async (
      _: any,
      { firstName, email }: { firstName: string; email: string }
    ) => {
      const student = await repository.findRecordBy<Student>("student", {
        query: { email },
      });
      if (student) {
        throw new Error("Student already exists");
      }
      return repository.createRecord<Student>("student", { firstName, email });
    },
    createHobbies: async (
      _: any,
      { studentId, title }: { studentId: string; title: string }
    ) => {
      const id = new ObjectId(studentId);
      return repository.createRecord<Hobbies>("hobbies", {
        title,
        student_id: id as any,
      });
    },
  },
};

export default StudentResolvers;