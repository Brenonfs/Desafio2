import faker from 'faker';
import { getRandomCep } from '../generateCep';
import { ISchoolTest } from '../../interfaces/SchoolTest';
import { app } from '../../../src/app';
import request from 'supertest';

export async function createSchools(numberOfSchools: number) {
  const schools = [];
  for (let i = 0; i < numberOfSchools; i++) {
    const schoolCode = faker.internet.userName();
    const cep = (await getRandomCep()) || '';
    const profileName = faker.company.companyName();
    const password = faker.random.number({ min: 100, max: 500 }).toString();
    const token = null;
    const street = null;
    const state = null;
    const city = null;
    const neighborhood = null;
    const status = null;
    const response = null;

    const schoolTest: ISchoolTest = {
      schoolCode,
      cep,
      street,
      state,
      city,
      neighborhood,
      password,
      profileName,
      token,
      status,
      response,
    };

    const result = await request(app).post('/school').send({
      schoolCode,
      cep,
      password,
      profileName,
    });

    schoolTest.street = result.body.result.street;
    schoolTest.city = result.body.result.city;
    schoolTest.state = result.body.result.state;
    schoolTest.neighborhood = result.body.result.neighborhood;
    schoolTest.status = result.statusCode;
    schoolTest.response = result.body.result;

    schools.push(schoolTest);
  }
  return { schools };
}
