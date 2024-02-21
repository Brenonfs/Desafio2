import faker from 'faker';
import { app } from '../../../src/app';
import request from 'supertest';
import { loginSchools } from '../school/loginSchoolsTest';
import { ICommunicationTest } from '../../interfaces/CommunicationTest';

export async function createCommunication(numberOfCommunication: number) {
  const schoolTest = await loginSchools();
  if (schoolTest.token === null) {
    return null;
  }
  const communications = [];
  for (let i = 0; i < numberOfCommunication; i++) {
    const messageType = faker.internet.userName();
    const message = faker.name.findName();
    const id = null;
    const schoolId = null;
    const timestamp = null;
    const response = null;

    const communicationTest: ICommunicationTest = {
      id,
      messageType,
      message,
      timestamp,
      schoolId,
      response,
    };
    const result = await request(app).post('/communication').set('Authorization', `Bearer ${schoolTest.token}`).send({
      messageType,
      message,
    });
    communicationTest.id = result.body.result.id;
    communicationTest.timestamp = result.body.result.timestamp;
    communicationTest.schoolId = result.body.result.schoolId;
    communicationTest.response = result;
    communications.push(communicationTest);
  }
  return { communications, school: schoolTest };
}
