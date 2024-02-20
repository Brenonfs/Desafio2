import { app } from '../../../src/app';
import request from 'supertest';
import { loginSchools } from '../school/loginSchoolsTest';
import faker from 'faker';
import { ITeacherTest } from '../../interfaces/TeacherTest';

export async function createTeachers(numberOfTeachers: number) {
  const teachers = [];
  const schoolTest = await loginSchools();
  if (schoolTest.token === null) {
    return null;
  }
  for (let i = 0; i < numberOfTeachers; i++) {
    const teacherCode = faker.internet.userName();
    const profileName = faker.name.findName();
    const password = faker.random.number({ min: 100, max: 500 }).toString();
    const discipline = faker.random.word();
    const schoolId = null;
    const token = null;
    const response = null;

    const teacherTest1: ITeacherTest = {
      teacherCode,
      password,
      profileName,
      discipline,
      schoolId,
      token,
      response,
    };

    const result = await request(app).post('/teacher').set('Authorization', `Bearer ${schoolTest.token}`).send({
      teacherCode,
      password,
      discipline,
      profileName,
    });

    teacherTest1.schoolId = result.body.result.schoolId;
    teacherTest1.token = result.body.result.token;
    teacherTest1.response = result;
    teachers.push(teacherTest1);
  }
  return { teachers, school: schoolTest };
}
