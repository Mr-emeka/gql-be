import { gql } from "apollo-server";

const StudentSchema = gql`
  type Student {
    _id: String!
    firstName: String!
    email: String!
    hobbies: [Hobbies!]!
  }

  type Hobbies {
    _id: String!
    title: String!
    student: Student!
  }

  type Query {
    getStudent(id: String!): Student
    getAllStudents: [Student!]!
    getUserHobbies(id: String!): [Hobbies!]!
  }

  type Mutation {
    createStudent(firstName: String!, email: String!): Student!
    createHobbies(studentId: String!, title: String!): Hobbies!
  }
`;

export default StudentSchema;