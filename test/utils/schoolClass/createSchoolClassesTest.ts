import { app } from '../../../src/app';
import request from 'supertest';
import { loginSchools } from '../school/loginSchoolsTest';
import faker from 'faker';
import { ISchoolClassTest } from '../../interfaces/SchoolClassTest';

const diasDaSemanaValidos = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const horariosvalidos = ['7:00 - 7:55', '7:55 - 8:50', '8:50 - 9:45', '9:45 - 10:40', '10:40 - 11:35', '11:35 - 12:30'];

export async function createSchoolClasses(numberOfSchoolClasses: number) {
  const schoolTest = await loginSchools();
  if (schoolTest.token === null) {
    return null;
  }
  const schoolClasses = [];
  for (let i = 0; i < numberOfSchoolClasses; i++) {
    const discipline = faker.random.word();
    const year = faker.random.number({ min: 2000, max: 2024 });
    const numberClass = faker.random.number({ min: 1, max: 12 });
    const dayOfWeek = faker.random.arrayElement(diasDaSemanaValidos);
    const time = faker.random.arrayElement(horariosvalidos);
    const schoolId = null;
    const teacherId = null;
    const id = null;
    const response = null;

    const schoolClassTest: ISchoolClassTest = {
      id,
      discipline,
      year,
      numberClass,
      schoolId,
      teacherId,
      dayOfWeek,
      time,
      response,
    };
    const result = await request(app).post('/schoolClass').set('Authorization', `Bearer ${schoolTest.token}`).send({
      discipline,
      year,
      numberClass,
      dayOfWeek,
      time,
      teacherId,
    });
    schoolClassTest.schoolId = result.body.result.schoolId;
    schoolClassTest.id = result.body.result.id;
    schoolClassTest.response = result;
    schoolClasses.push(schoolClassTest);
  }
  return { schoolClasses, school: schoolTest };
}

export async function createSchoolClassesSameTimeAndSameDay(numberOfSchoolClasses: number) {
  const schoolTest = await loginSchools();
  if (schoolTest.token === null) {
    return null;
  }
  const schoolClasses = [];
  const dayOfWeek = faker.random.arrayElement(diasDaSemanaValidos);
  const time = faker.random.arrayElement(horariosvalidos);
  for (let i = 0; i < numberOfSchoolClasses; i++) {
    const discipline = faker.random.word();
    const year = faker.random.number({ min: 2000, max: 2024 });
    const numberClass = faker.random.number({ min: 1, max: 12 });
    const schoolId = null;
    const teacherId = null;
    const id = null;
    const response = null;

    const schoolClassTest: ISchoolClassTest = {
      id,
      discipline,
      year,
      numberClass,
      schoolId,
      teacherId,
      dayOfWeek,
      time,
      response,
    };
    const result = await request(app).post('/schoolClass').set('Authorization', `Bearer ${schoolTest.token}`).send({
      discipline,
      year,
      numberClass,
      dayOfWeek,
      time,
      teacherId,
    });
    schoolClassTest.schoolId = result.body.result.schoolId;
    schoolClassTest.id = result.body.result.id;
    schoolClassTest.response = result;
    schoolClasses.push(schoolClassTest);
  }
  return { schoolClasses, school: schoolTest };
}
