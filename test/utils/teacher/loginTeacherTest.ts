import { app } from '../../../src/app';
import request from 'supertest';
import { createTeachers } from './createTeacherTest';

export async function loginTeacher() {
  const teacher = await createTeachers(1);
  if (!teacher) {
    throw new Error('Teacher ERROR: ');
  }
  const response = await request(app).post('/session/teacher').send({
    teacherCode: teacher.teachers[0].teacherCode,
    password: teacher.teachers[0].password,
  });
  teacher.teachers[0].token = response.body.result.token;
  return teacher.teachers[0];
}
