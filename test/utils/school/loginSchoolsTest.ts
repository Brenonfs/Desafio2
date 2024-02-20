import { app } from '../../../src/app';
import request from 'supertest';
import { createSchools } from './createSchoolTest';

export async function loginSchools() {
  const schoolTest = await createSchools(1);
  const loginResponse = await request(app).post('/session/school').send({
    schoolCode: schoolTest.schools[0].schoolCode,
    password: schoolTest.schools[0].password,
  });
  schoolTest.schools[0].token = loginResponse.body.result.token;
  return schoolTest.schools[0];
}
