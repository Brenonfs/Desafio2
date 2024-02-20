/* eslint-disable @typescript-eslint/no-unused-vars */
import { app } from '../../../src/app';
import request from 'supertest';
import { createStudents } from './createStudentsTest';
import { createSchoolClasses } from '../schoolClass/createSchoolClassesTest';
export async function updateStudents(numberOfStudentsUpdate: number) {
  const students = await createStudents(numberOfStudentsUpdate);
  if (students == null || students.school.token === null) {
    return null;
  }
  const schoolClass = await createSchoolClasses(1);
  if (schoolClass === null) {
    return null;
  }
  for (let i = 0; i < numberOfStudentsUpdate; i++) {
    const firstResponse = await request(app)
      .put(`/student/class/${schoolClass.schoolClasses[0].id}`)
      .set('Authorization', `Bearer ${students.school.token}`)
      .send({
        registration: students.students[i].registration,
      });
  }
  return schoolClass;
}
