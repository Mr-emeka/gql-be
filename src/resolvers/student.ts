import repository from "@data/repository";
import { Hobbies, Student } from "@utils/interfaces";
import { ObjectId } from "mongodb";

const StudentResolvers = {
  Query: {
    getStudent: async (_: any, { id }: { id: string }) => {
      return repository.findRecordBy<Student>("student", {
        query: { _id: id },
      });
    },
    getAllStudents: async () => {
      return repository.findRecordsBy<Student>("student", {});
    },
    getHobbies: async (_: any, { id }: { id: string }) => {
      return repository.findRecordBy<Hobbies>("hobbies", {
        query: { _id: id },
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
  Student: {
    async hobbies() {
      return repository.findRecordsBy<Hobbies>("hobbies", {});
    },
  },
  Hobbies: {
    async student() {
      return repository.findRecordsBy<Student>("student", {});
    },
  },
};

export default StudentResolvers;
