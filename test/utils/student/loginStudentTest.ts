import { createStudents } from './createStudentsTest';
import { app } from '../../../src/app';
import request from 'supertest';

export async function loginStudent() {
  const student = await createStudents(1);
  if (!student) {
    throw new Error('student ERROR: ');
  }
  const response = await request(app).post('/session/student').send({
    registration: student.students[0].registration,
    password: student.students[0].password,
  });
  student.students[0].token = response.body.result.token;
  student.students[0].response = response;
  return student.students[0];
}
