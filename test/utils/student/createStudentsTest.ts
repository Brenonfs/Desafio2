import faker from 'faker';
import { app } from '../../../src/app';
import request from 'supertest';
import { loginSchools } from '../school/loginSchoolsTest';
import { IStudentlTest } from '../../interfaces/StudentTest';

export async function createStudents(numberOfStudents: number) {
  const schoolTest = await loginSchools();
  if (schoolTest.token === null) {
    return null;
  }
  const students = [];
  for (let i = 0; i < numberOfStudents; i++) {
    const registration = faker.internet.userName();
    const profileName = faker.name.findName();
    const password = faker.random.number({ min: 100, max: 500 }).toString();
    const schoolId = null;
    const token = null;
    const response = null;

    const studentTest: IStudentlTest = {
      registration,
      password,
      profileName,
      schoolId,
      token,
      response,
    };
    const result = await request(app).post('/student').set('Authorization', `Bearer ${schoolTest.token}`).send({
      registration,
      password,
      profileName,
    });
    studentTest.schoolId = result.body.result.schoolId;
    studentTest.response = result;
    students.push(studentTest);
  }
  return { students, school: schoolTest };
}
