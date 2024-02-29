/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import faker from 'faker';
import request from 'supertest';
import { app } from '../src/app';
import { ExportSchoolClassOfStudentService } from '../src/services/SchoolClassService/exportSchoolClassOfStudent.service';
import { ExportSchoolClassOfTeacherService } from '../src/services/SchoolClassService/exportSchoolClassOfTeacher.service';
import { ImportFileService } from '../src/services/FileService/importFile.service';
import AWS from 'aws-sdk-mock';
import { createSchools } from './utils/school/createSchoolTest';
import { loginSchools } from './utils/school/loginSchoolsTest';
import { createStudents } from './utils/student/createStudentsTest';
import { loginStudent } from './utils/student/loginStudentTest';
import {
  createSchoolClasses,
  createSchoolClassesSameTimeAndSameDay,
} from './utils/schoolClass/createSchoolClassesTest';
import { updateStudents } from './utils/student/updateStudentTest';
import { createTeachers } from './utils/teacher/createTeacherTest';
import { loginTeacher } from './utils/teacher/loginTeacherTest';
import { createCommunication } from './utils/communication/createCommunication';

jest.mock('../src/services/SchoolClassService/exportSchoolClassOfStudent.service');
jest.mock('../src/services/SchoolClassService/exportSchoolClassOfTeacher.service');
jest.mock('../src/services/FileService/importFile.service');
faker.locale = 'pt_BR';

const secretToken = process.env.SECRET_TOKEN;
if (!secretToken) {
  throw new Error('A variável de ambiente SECRET_TOKEN não está definida.');
}

describe('Test School', () => {
  it('Create School  ', async () => {
    const result = await createSchools(1);
    if (!result) {
      throw new Error('Erro na criação da escola.');
    }
    const firstSchool = result.schools[0];
    expect(firstSchool.response.schoolCode).toEqual(firstSchool.schoolCode);
    expect(firstSchool.response.city).toEqual(firstSchool.city);
    expect(firstSchool.response.state).toEqual(firstSchool.state);
    expect(firstSchool.response.street).toEqual(firstSchool.street);
    expect(firstSchool.response.cep).toEqual(firstSchool.cep);
    expect(firstSchool.response.profileName).toEqual(firstSchool.profileName);
    expect(firstSchool.status).toEqual(200);
  }, 10000);
  it('School login', async () => {
    const schoolTest = await createSchools(1);
    const loginResponse = await request(app).post('/session/school').send({
      schoolCode: schoolTest.schools[0].schoolCode,
      password: schoolTest.schools[0].password,
    });
    const firstSchool = schoolTest.schools[0];
    expect(loginResponse.body.result.schoolCode).toEqual(firstSchool.schoolCode);
    expect(loginResponse.statusCode).toEqual(200);
  }, 10000);
  it('View school ', async () => {
    const schoolTest = await loginSchools();
    const response = await request(app).get('/school/view').set('Authorization', `Bearer ${schoolTest.token}`);
    expect(response.body.result.schoolCode).toEqual(schoolTest.schoolCode);
    expect(response.body.result.city).toEqual(schoolTest.city);
    expect(response.body.result.state).toEqual(schoolTest.state);
    expect(response.body.result.street).toEqual(schoolTest.street);
    expect(response.body.result.cep).toEqual(schoolTest.cep);
    expect(response.body.result.profileName).toEqual(schoolTest.profileName);
    expect(response.statusCode).toEqual(200);
  }, 10000);
  it('View School Public ', async () => {
    const result = await createSchools(3);
    if (!result) {
      return null;
    }
    const schoolList = await request(app).get('/school/viewPublic').send({
      profileName: result.schools[0].profileName,
    });
    expect(schoolList.statusCode).toEqual(200);
    expect(schoolList.body.result).toBeTruthy();
    result.schools.forEach((schoolTest) => {
      const isSchoolInList = schoolList.body.result.some((school: any) => {
        return school.profileName === result.schools[0].profileName;
      });
      expect(isSchoolInList).toBeTruthy();
    });
  }, 10000);
  it('List School Admin', async () => {
    const result = await createSchools(3);
    if (!result) {
      return null;
    }
    const schoolList = await request(app).get('/school/listAdmin').set('secret', secretToken);
    expect(schoolList.statusCode).toEqual(200);
    expect(schoolList.body.result).toBeTruthy();
    result.schools.forEach((schoolTest) => {
      const isSchoolInList = schoolList.body.result.some((school: any) => {
        return (
          school.schoolCode === schoolTest.schoolCode &&
          school.city === schoolTest.city &&
          school.state === schoolTest.state &&
          school.street === schoolTest.street &&
          school.cep === schoolTest.cep &&
          school.profileName === schoolTest.profileName
        );
      });
      expect(isSchoolInList).toBeTruthy();
    });
  }, 10000);
  it('List School Public ', async () => {
    const result = await createSchools(3);
    if (!result) {
      return null;
    }
    const schoolList = await request(app).get('/school/list').send({});
    expect(schoolList.statusCode).toEqual(200);
    expect(schoolList.body.result).toBeTruthy();
    result.schools.forEach((schoolTest) => {
      const isSchoolInList = schoolList.body.result.some((school: any) => {
        return (
          school.city === schoolTest.city &&
          school.state === schoolTest.state &&
          school.street === schoolTest.street &&
          school.cep === schoolTest.cep &&
          school.profileName === schoolTest.profileName
        );
      });
      expect(isSchoolInList).toBeTruthy();
    });
  }, 10000);
});
describe('Test Student', () => {
  it('Create Student ', async () => {
    const student = await createStudents(1);
    if (!student) {
      throw new Error('student Create ERROR: ');
    }
    const firstStudent = student.students[0];
    expect(firstStudent.response.body.result.registration).toEqual(firstStudent.registration);
    expect(firstStudent.response.body.result.profileName).toEqual(firstStudent.profileName);
    expect(firstStudent.response.body.result.schoolId).toEqual(firstStudent.schoolId);
    expect(firstStudent.response.statusCode).toEqual(200);
  }, 10000);
  it('Login Student ', async () => {
    const student = await createStudents(1);
    if (!student) {
      throw new Error('student Login ERROR: ');
    }
    const firstStudent = student.students[0];
    const loginResponse = await request(app).post('/session/student').send({
      registration: firstStudent.registration,
      password: firstStudent.password,
    });
    expect(loginResponse.body.result.registration).toEqual(firstStudent.registration);
    expect(loginResponse.body.result.schoolId).toEqual(firstStudent.schoolId);
    expect(loginResponse.statusCode).toEqual(200);
  }, 10000);
  it('View Student by Student ', async () => {
    const studentTest = await loginStudent();
    const loginResponse = await request(app)
      .get('/student/viewStudent')
      .set('Authorization', `Bearer ${studentTest.token}`);
    expect(loginResponse.body.result.schoolId).toEqual(studentTest.schoolId);
    expect(loginResponse.body.result.profileName).toEqual(studentTest.profileName);
    expect(loginResponse.statusCode).toEqual(200);
  }, 10000);
  it('View Student by School ', async () => {
    const school = await createStudents(1);
    if (!school) {
      throw new Error('View Student by School ERROR: ');
    }
    const loginResponse = await request(app)
      .get('/student/viewSchool')
      .set('Authorization', `Bearer ${school.school.token}`)
      .send({
        registration: school.students[0].registration,
      });
    expect(loginResponse.body.result.schoolId).toEqual(school.students[0].schoolId);
    expect(loginResponse.body.result.profileName).toEqual(school.students[0].profileName);
    expect(loginResponse.statusCode).toEqual(200);
  }, 10000);
  it('Update Student ', async () => {
    const school = await createStudents(1);
    if (!school) {
      throw new Error('student Create ERROR: ');
    }
    const schoolClass = await createSchoolClasses(1);
    if (!schoolClass) {
      throw new Error('schoolClass Create ERROR: ');
    }
    const response = await request(app)
      .put(`/student/class/${schoolClass.schoolClasses[0].id}`)
      .set('Authorization', `Bearer ${school.school.token}`)
      .send({
        registration: school.students[0].registration,
      });
    expect(response.body.result.schoolId).toEqual(school.students[0].schoolId);
    expect(response.body.result.registration).toEqual(school.students[0].registration);
    expect(response.body.result.profileName).toEqual(school.students[0].profileName);
    expect(response.body.result.schoolClass[0].discipline).toEqual(schoolClass.schoolClasses[0].discipline);
    expect(response.body.result.schoolClass[0].year).toEqual(schoolClass.schoolClasses[0].year);
    expect(response.body.result.schoolClass[0].numberClass).toEqual(schoolClass.schoolClasses[0].numberClass);
    expect(response.body.result.schoolClass[0].time).toEqual(schoolClass.schoolClasses[0].time);
    expect(response.body.result.schoolClass[0].dayOfWeek).toEqual(schoolClass.schoolClasses[0].dayOfWeek);
    expect(response.statusCode).toEqual(200);
  }, 10000);
  it('List Student', async () => {
    const result = await createStudents(3);
    if (!result || !result.school || !result.school.token) {
      return null;
    }
    const studentList = await request(app)
      .get('/student/list')
      .set('Authorization', `Bearer ${result.school.token}`)
      .send({});
    expect(studentList.statusCode).toEqual(200);
    expect(studentList.body.result).toBeTruthy();
    result.students.forEach((studentTest) => {
      const isStudentInList = studentList.body.result.some((student: any) => {
        return (
          student.schoolId === studentTest.schoolId &&
          student.registration === studentTest.registration &&
          student.profileName === studentTest.profileName
        );
      });
      expect(isStudentInList).toBeTruthy();
    });
  }, 10000);
  it('Error Update Student para uma turma no mesmo horário ', async () => {
    const school = await createStudents(1);
    if (!school) {
      throw new Error('student Create ERROR: ');
    }
    const schoolClass = await createSchoolClassesSameTimeAndSameDay(2);
    if (!schoolClass) {
      throw new Error('schoolClass Create ERROR: ');
    }
    const firstResponse = await request(app)
      .put(`/student/class/${schoolClass.schoolClasses[0].id}`)
      .set('Authorization', `Bearer ${school.school.token}`)
      .send({
        registration: school.students[0].registration,
      });
    const secondResponse = await request(app)
      .put(`/student/class/${schoolClass.schoolClasses[1].id}`)
      .set('Authorization', `Bearer ${school.school.token}`)
      .send({
        registration: school.students[0].registration,
      });
    expect(secondResponse.body.message).toEqual('Este aluno já está cadastrado em outra turma no mesmo dia e horário.');
    expect(secondResponse.statusCode).toEqual(400);
  }, 10000);
  it('Error Update Student para a mesma turma ', async () => {
    const school = await createStudents(1);
    if (!school) {
      throw new Error('student Create ERROR: ');
    }
    const schoolClass = await createSchoolClasses(1);
    if (!schoolClass) {
      throw new Error('schoolClass Create ERROR: ');
    }
    const firstResponse = await request(app)
      .put(`/student/class/${schoolClass.schoolClasses[0].id}`)
      .set('Authorization', `Bearer ${school.school.token}`)
      .send({
        registration: school.students[0].registration,
      });
    const secondResponse = await request(app)
      .put(`/student/class/${schoolClass.schoolClasses[0].id}`)
      .set('Authorization', `Bearer ${school.school.token}`)
      .send({
        registration: school.students[0].registration,
      });
    expect(secondResponse.body.message).toEqual('Este aluno já está cadastrado nesta turma.');
    expect(secondResponse.statusCode).toEqual(400);
  }, 10000);
  it('Error Update Student limite de vagas ', async () => {
    const school = await createStudents(1);
    if (!school) {
      throw new Error('student Create ERROR: ');
    }
    const schoolClass = await updateStudents(41);
    if (!schoolClass) {
      throw new Error('schoolClass Create ERROR: ');
    }
    const response = await request(app)
      .put(`/student/class/${schoolClass.schoolClasses[0].id}`)
      .set('Authorization', `Bearer ${school.school.token}`)
      .send({
        registration: school.students[0].registration,
      });
    expect(response.body.message).toEqual('Esta turma não foi encontrada ou já está lotada.');
    expect(response.statusCode).toEqual(400);
  }, 10000);
});
describe('Test Teacher', () => {
  it('Create Teacher ', async () => {
    const teacher = await createTeachers(1);
    if (!teacher) {
      throw new Error('Teacher Create ERROR: ');
    }
    const firstTeacher = teacher.teachers[0];
    expect(firstTeacher.response.body.result.teacherCode).toEqual(firstTeacher.teacherCode);
    expect(firstTeacher.response.body.result.discipline).toEqual(firstTeacher.discipline);
    expect(firstTeacher.response.body.result.profileName).toEqual(firstTeacher.profileName);
    expect(firstTeacher.response.body.result.schoolId).toEqual(firstTeacher.schoolId);
    expect(firstTeacher.response.statusCode).toEqual(200);
  }, 10000);
  it('Login Teacher ', async () => {
    const teacher = await createTeachers(1);
    if (!teacher) {
      throw new Error('Teacher Login ERROR: ');
    }
    const firstTeacher = teacher.teachers[0];
    const loginResponse = await request(app).post('/session/teacher').send({
      teacherCode: firstTeacher.teacherCode,
      password: firstTeacher.password,
    });
    expect(loginResponse.body.result.teacherCode).toEqual(firstTeacher.teacherCode);
    expect(loginResponse.body.result.schoolId).toEqual(firstTeacher.schoolId);
    expect(loginResponse.statusCode).toEqual(200);
  }, 10000);
  it('View Teacher by Teacher ', async () => {
    const teacher = await loginTeacher();
    if (!teacher) {
      throw new Error('teacher Login ERROR: ');
    }
    const response = await request(app).get('/teacher/viewTeacher').set('Authorization', `Bearer ${teacher.token}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.result.schoolId).toEqual(teacher.schoolId);
    expect(response.body.result.discipline).toEqual(teacher.discipline);
    expect(response.body.result.profileName).toEqual(teacher.profileName);
  }, 10000);
  it('View Teacher by School ', async () => {
    const school = await createTeachers(1);
    if (!school) {
      throw new Error('school ERROR: ');
    }
    const response = await request(app)
      .get('/teacher/viewSchool')
      .set('Authorization', `Bearer ${school.school.token}`)
      .send({
        teacherCode: school.teachers[0].teacherCode,
      });
    expect(response.statusCode).toEqual(200);
    expect(response.body.result.schoolId).toEqual(school.teachers[0].schoolId);
    expect(response.body.result.discipline).toEqual(school.teachers[0].discipline);
    expect(response.body.result.profileName).toEqual(school.teachers[0].profileName);
  }, 10000);
  it('Update Teacher ', async () => {
    const school = await createTeachers(1);
    if (!school) {
      throw new Error('student Create ERROR: ');
    }
    const schoolClass = await createSchoolClasses(1);
    if (!schoolClass) {
      throw new Error('schoolClass Create ERROR: ');
    }
    const response = await request(app)
      .put(`/teacher/class/${schoolClass.schoolClasses[0].id}`)
      .set('Authorization', `Bearer ${school.school.token}`)
      .send({
        teacherCode: school.teachers[0].teacherCode,
      });
    expect(response.body.result.schoolId).toEqual(school.teachers[0].schoolId);
    expect(response.body.result.teacherCode).toEqual(school.teachers[0].teacherCode);
    expect(response.body.result.profileName).toEqual(school.teachers[0].profileName);
    expect(response.body.result.schoolClass[0].discipline).toEqual(schoolClass.schoolClasses[0].discipline);
    expect(response.body.result.schoolClass[0].year).toEqual(schoolClass.schoolClasses[0].year);
    expect(response.body.result.schoolClass[0].numberClass).toEqual(schoolClass.schoolClasses[0].numberClass);
    expect(response.body.result.schoolClass[0].time).toEqual(schoolClass.schoolClasses[0].time);
    expect(response.body.result.schoolClass[0].dayOfWeek).toEqual(schoolClass.schoolClasses[0].dayOfWeek);
    expect(response.statusCode).toEqual(200);
  }, 10000);
  it('Error Update Teacher para uma turma no mesmo horário ', async () => {
    const school = await createTeachers(1);
    if (!school) {
      throw new Error('student Create ERROR: ');
    }
    const schoolClass = await createSchoolClassesSameTimeAndSameDay(2);
    if (!schoolClass) {
      throw new Error('schoolClass Create ERROR: ');
    }
    const firstResponse = await request(app)
      .put(`/teacher/class/${schoolClass.schoolClasses[0].id}`)
      .set('Authorization', `Bearer ${school.school.token}`)
      .send({
        teacherCode: school.teachers[0].teacherCode,
      });
    const secondResponse = await request(app)
      .put(`/teacher/class/${schoolClass.schoolClasses[1].id}`)
      .set('Authorization', `Bearer ${school.school.token}`)
      .send({
        teacherCode: school.teachers[0].teacherCode,
      });
    expect(secondResponse.body.message).toEqual(
      'Este professor já está cadastrado em outra turma no mesmo dia e horário.',
    );
    expect(secondResponse.statusCode).toEqual(400);
  }, 10000);
  it('Error Update Teacher para a mesma turma', async () => {
    const school = await createTeachers(1);
    if (!school) {
      throw new Error('student Create ERROR: ');
    }
    const schoolClass = await createSchoolClassesSameTimeAndSameDay(1);
    if (!schoolClass) {
      throw new Error('schoolClass Create ERROR: ');
    }
    const firstResponse = await request(app)
      .put(`/teacher/class/${schoolClass.schoolClasses[0].id}`)
      .set('Authorization', `Bearer ${school.school.token}`)
      .send({
        teacherCode: school.teachers[0].teacherCode,
      });
    const secondResponse = await request(app)
      .put(`/teacher/class/${schoolClass.schoolClasses[0].id}`)
      .set('Authorization', `Bearer ${school.school.token}`)
      .send({
        teacherCode: school.teachers[0].teacherCode,
      });
    expect(secondResponse.body.message).toEqual('Professor(a) já está cadastrado nesta turma.');
    expect(secondResponse.statusCode).toEqual(400);
  }, 10000);
  it('List Teacher', async () => {
    const result = await createTeachers(3);
    if (!result || !result.school || !result.school.token) {
      return null;
    }
    const teacherList = await request(app)
      .get('/teacher/list')
      .set('Authorization', `Bearer ${result.school.token}`)
      .send({});
    expect(teacherList.statusCode).toEqual(200);
    expect(teacherList.body.result).toBeTruthy();
    result.teachers.forEach((teacherTest) => {
      const isTeacherInList = teacherList.body.result.some((teacher: any) => {
        return (
          teacher.schoolId === teacherTest.schoolId &&
          teacher.teacherCode === teacherTest.teacherCode &&
          teacher.discipline === teacherTest.discipline &&
          teacher.profileName === teacherTest.profileName
        );
      });
      expect(isTeacherInList).toBeTruthy();
    });
  }, 10000);
});
describe('Test SchoolClass', () => {
  it('Create SchoolClass ', async () => {
    const schoolClass = await createSchoolClasses(1);
    if (!schoolClass) {
      throw new Error('schoolClass Create ERROR: ');
    }
    const firstSchoolClass = schoolClass.schoolClasses[0];
    expect(firstSchoolClass.response.body.result.discipline).toEqual(firstSchoolClass.discipline);
    expect(firstSchoolClass.response.body.result.year).toEqual(firstSchoolClass.year);
    expect(firstSchoolClass.response.body.result.time).toEqual(firstSchoolClass.time);
    expect(firstSchoolClass.response.body.result.schoolId).toEqual(firstSchoolClass.schoolId);
    expect(firstSchoolClass.response.body.result.numberClass).toEqual(firstSchoolClass.numberClass);
    expect(firstSchoolClass.response.body.result.teacherId).toEqual(firstSchoolClass.teacherId);
    expect(firstSchoolClass.response.statusCode).toEqual(200);
  }, 10000);
  it('View SchoolClass', async () => {
    const schoolClass = await createSchoolClasses(1);
    if (!schoolClass) {
      return null;
    }
    const schoolClassList = await request(app)
      .get('/schoolClass/view')
      .set('Authorization', `Bearer ${schoolClass.school.token}`)
      .send({
        discipline: schoolClass.schoolClasses[0].discipline,
        year: schoolClass.schoolClasses[0].year,
      });
    expect(schoolClassList.statusCode).toEqual(200);
    expect(schoolClassList.body.result).toBeTruthy();
    schoolClass.schoolClasses.forEach((schoolClassTest) => {
      const isSchoolClassInList = schoolClassList.body.result.some((schoolClassResult: any) => {
        return (
          schoolClassResult.discipline === schoolClass.schoolClasses[0].discipline &&
          schoolClassResult.year === schoolClass.schoolClasses[0].year
        );
      });
      expect(isSchoolClassInList).toBeTruthy();
    });
  }, 10000);
  it('View Details SchoolClass ', async () => {
    const schoolClass = await createSchoolClasses(1);
    if (!schoolClass) {
      throw new Error('schoolClass Create ERROR: ');
    }
    const response = await request(app)
      .get(`/schoolClass/class/${schoolClass.schoolClasses[0].id}`)
      .set('Authorization', `Bearer ${schoolClass.school.token}`)
      .send({});
    expect(response.body.result.discipline).toEqual(schoolClass.schoolClasses[0].discipline);
    expect(response.body.result.year).toEqual(schoolClass.schoolClasses[0].year);
    expect(response.body.result.numberClass).toEqual(schoolClass.schoolClasses[0].numberClass);
    expect(response.body.result.time).toEqual(schoolClass.schoolClasses[0].time);
    expect(response.body.result.schoolId).toEqual(schoolClass.schoolClasses[0].schoolId);
    expect(response.body.result.teacherId).toEqual(schoolClass.schoolClasses[0].teacherId);
    expect(response.statusCode).toEqual(200);
  }, 10000);

  it('Export Student SchoolClass', async () => {
    const student = await loginStudent();
    const mockExport = ExportSchoolClassOfStudentService.prototype.execute as jest.Mock;
    mockExport.mockResolvedValue('key-aleatoria');
    const mockImport = ImportFileService.prototype.execute as jest.Mock;
    mockImport.mockResolvedValue('http://url-aleatoria.com');
    AWS.restore();
    const response = await request(app)
      .get('/schoolClass/exportStudent')
      .set('Authorization', `Bearer ${student.token}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.excelUrl).toEqual('http://url-aleatoria.com');
  });

  it('Export Teacher SchoolClass', async () => {
    const teacher = await loginTeacher();
    const mockExport = ExportSchoolClassOfTeacherService.prototype.execute as jest.Mock;
    mockExport.mockResolvedValue('key-aleatoria');
    const mockImport = ImportFileService.prototype.execute as jest.Mock;
    mockImport.mockResolvedValue('http://url-aleatoria.com');
    AWS.restore();
    const response = await request(app)
      .get('/schoolClass/exportTeacher')
      .set('Authorization', `Bearer ${teacher.token}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.excelUrl).toEqual('http://url-aleatoria.com');
  });
});
describe('Test Communication', () => {
  it('Create Communication ', async () => {
    const communication = await createCommunication(1);
    if (!communication) {
      throw new Error('Communication Create ERROR: ');
    }
    const firstCommunication = communication.communications[0];
    expect(firstCommunication.response.body.result.messageType).toEqual(firstCommunication.messageType);
    expect(firstCommunication.response.body.result.message).toEqual(firstCommunication.message);
    expect(firstCommunication.response.body.result.timestamp).toEqual(firstCommunication.timestamp);
    expect(firstCommunication.response.body.result.schoolId).toEqual(firstCommunication.schoolId);
    expect(firstCommunication.response.statusCode).toEqual(200);
  }, 15000);
  it('View Communication', async () => {
    const communication = await createCommunication(1);
    if (!communication) {
      throw new Error('Communication View ERROR: ');
    }
    const response = await request(app).get(
      `/communication/view/${communication.communications[0].schoolId}/${communication.communications[0].id}`,
    );
    expect(response.statusCode).toEqual(200);
    expect(response.body.result.messageType).toEqual(communication.communications[0].messageType);
    expect(response.body.result.message).toEqual(communication.communications[0].message);
    expect(response.body.result.timestamp).toEqual(communication.communications[0].timestamp);
    expect(response.body.result.schoolId).toEqual(communication.communications[0].schoolId);
  }, 10000);

  it('List Communication ', async () => {
    const communication = await createCommunication(3);
    if (!communication) {
      throw new Error('Communication View ERROR: ');
    }
    const communicationList = await request(app).get(`/communication/list/${communication.communications[0].schoolId}`);
    expect(communicationList.statusCode).toEqual(200);
    expect(communicationList.body.result).toBeTruthy();
    communication.communications.forEach((communicationTest) => {
      const isCommunicationInList = communicationList.body.result.some((communication: any) => {
        return (
          communication.messageType === communicationTest.messageType &&
          communication.message === communicationTest.message &&
          communication.timestamp === communicationTest.timestamp
        );
      });
      expect(isCommunicationInList).toBeTruthy();
    });
  }, 10000);
});
