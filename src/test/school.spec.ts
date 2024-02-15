/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import faker from 'faker';
import request from 'supertest';
import { app } from '../app';
import { getRandomCep } from '../utils/generateCep';
import { ExportSchoolClassOfStudentService } from '../services/SchoolClassService/exportSchoolClassOfStudent.service';
import { ExportSchoolClassOfTeacherService } from '../services/SchoolClassService/exportSchoolClassOfTeacher.service';
import { ImportFileService } from '../services/FileService/importFile.service';
import AWS from 'aws-sdk-mock';

jest.mock('../services/SchoolClassService/exportSchoolClassOfStudent.service');
jest.mock('../services/SchoolClassService/exportSchoolClassOfTeacher.service');
jest.mock('../services/FileService/importFile.service');
faker.locale = 'pt_BR';
const secretToken = process.env.SECRET_TOKEN;
if (!secretToken) {
  throw new Error('A variável de ambiente SECRET_TOKEN não está definida.');
}

interface ISchoolTest {
  schoolCode: string;
  street: string | null;
  city: string | null;
  state: string | null;
  cep: string;
  neighborhood: string | null;
  password: string;
  profileName: string;
  token: string | null;
}
async function createSchool(): Promise<{ schoolTest: ISchoolTest; response: any }> {
  const schoolCode = faker.internet.userName();
  const cep = (await getRandomCep()) || '';
  const profileName = faker.company.companyName();
  const password = faker.random.number({ min: 100, max: 500 }).toString();
  const token = null;
  const street = null;
  const state = null;
  const city = null;
  const neighborhood = null;

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
  };

  const response = await request(app).post('/school').send({
    schoolCode,
    cep,
    password,
    profileName,
  });
  if (response) {
    schoolTest.street = response.body.result.street;
    schoolTest.city = response.body.result.city;
    schoolTest.state = response.body.result.state;
    schoolTest.neighborhood = response.body.result.neighborhood;
  } else {
    throw new Error('Deu erro ao criar usuário, pegou o mesmo cep provavelmente.');
  }
  return { schoolTest, response };
}
async function createSchoolMoreTime() {
  const schoolFind = await createSchool();
  const schools = [];
  schools.push(schoolFind);
  for (let i = 0; i < 3; i++) {
    const schoolResult = await createSchool();
    schools.push(schoolResult);
  }
  return { schools, schoolFind };
}
async function loginSchool() {
  const { schoolTest } = await createSchool();
  const loginResponse = await request(app).post('/session/school').send({
    schoolCode: schoolTest.schoolCode,
    password: schoolTest.password,
  });
  schoolTest.token = loginResponse.body.result.token;
  return schoolTest;
}
/// ///////////////// ///////////////// ///////////////// ///////////////// //////////////
interface IStudentlTest {
  registration: string;
  password: string;
  profileName: string;
  schoolId: number | null;
  token: string | null;
}
async function student(token: string) {
  if (!token) {
    throw new Error('Token de usuário nulo.');
  }
  const registration = faker.internet.userName();
  const profileName = faker.name.findName();
  const password = faker.random.number({ min: 100, max: 500 }).toString();
  const schoolId = null;

  const studentTest: IStudentlTest = {
    registration,
    password,
    profileName,
    schoolId,
    token,
  };
  const response = await request(app).post('/student').set('Authorization', `Bearer ${token}`).send({
    registration,
    password,
    profileName,
  });
  studentTest.schoolId = response.body.result.schoolId;
  return { studentTest, response };
}
async function createStudent() {
  const schoolTest = await loginSchool();
  if (!schoolTest || schoolTest.token === null) {
    return null;
  }
  const { response, studentTest } = await student(schoolTest.token);
  return { response, studentTest, schoolTest };
}
async function createStudentMoreTime() {
  const school = await loginSchool();
  if (school.token === null) {
    return null;
  }
  const students = [];
  for (let i = 0; i < 3; i++) {
    const studentResult = await student(school.token);
    students.push(studentResult);
  }
  return { students, school };
}
async function loginStudent() {
  const student = await createStudent();
  if (!student) {
    throw new Error('student ERROR: '); // Retornar null ou lançar um erro, dependendo do que deseja.
  }
  const response = await request(app).post('/session/student').send({
    registration: student.studentTest.registration,
    password: student.studentTest.password,
  });
  student.studentTest.token = response.body.result.token;
  return student.studentTest;
}
/// ///////////////// ///////////////// ///////////////// ///////////////// //////////////
interface ITeacherTest {
  teacherCode: string;
  password: string;
  profileName: string;
  discipline: string;
  schoolId: string | null;
  token: string | null;
}
async function Teacher(token: string) {
  if (!token) {
    throw new Error('Token de usuário nulo.');
  }
  const teacherCode = faker.internet.userName();
  const profileName = faker.name.findName();
  const password = faker.random.number({ min: 100, max: 500 }).toString();
  const discipline = faker.random.word();
  const schoolId = null;

  const teacherTest: ITeacherTest = {
    teacherCode,
    password,
    profileName,
    discipline,
    schoolId,
    token,
  };
  const response = await request(app).post('/teacher').set('Authorization', `Bearer ${token}`).send({
    teacherCode,
    password,
    discipline,
    profileName,
  });

  teacherTest.schoolId = response.body.result.schoolId;
  return { teacherTest, response };
}
async function createTeacher() {
  const schoolTest = await loginSchool();
  if (!schoolTest || schoolTest.token === null) {
    return null;
  }
  const { response, teacherTest } = await Teacher(schoolTest.token);
  return { response, teacherTest, schoolTest };
}
async function createTeacherMoreTime() {
  const school = await loginSchool();
  if (school.token === null) {
    return null;
  }

  const teachers = [];
  for (let i = 0; i < 3; i++) {
    const teacherResult = await Teacher(school.token);
    teachers.push(teacherResult);
  }
  return { teachers, school };
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function loginTeacher() {
  const teacher = await createTeacher();
  if (!teacher) {
    throw new Error('Teacher ERROR: '); // Retornar null ou lançar um erro, dependendo do que deseja.
  }
  const response = await request(app).post('/session/teacher').send({
    teacherCode: teacher.teacherTest.teacherCode,
    password: teacher.teacherTest.password,
  });
  teacher.teacherTest.token = response.body.result.token;
  return teacher.teacherTest;
}
const diasDaSemanaValidos = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const horariosvalidos = ['7:00 - 7:55', '7:55 - 8:50', '8:50 - 9:45', '9:45 - 10:40', '10:40 - 11:35', '11:35 - 12:30'];
interface ISchoolClassTest {
  id: number | null;
  discipline: string;
  year: number;
  numberClass: number;
  dayOfWeek: string;
  time: string;
  schoolId: string | null;
  teacherId: string | null;
}
async function schoolClass(token: string) {
  if (!token) {
    throw new Error('Token de usuário nulo.');
  }
  const discipline = faker.random.word();
  const year = faker.random.number({ min: 2000, max: 2024 });
  const numberClass = faker.random.number({ min: 1, max: 12 });
  const dayOfWeek = faker.random.arrayElement(diasDaSemanaValidos);
  const time = faker.random.arrayElement(horariosvalidos);
  const schoolId = null;
  const teacherId = null;
  const id = null;

  const schoolClassTest: ISchoolClassTest = {
    id,
    discipline,
    year,
    numberClass,
    schoolId,
    teacherId,
    dayOfWeek,
    time,
  };
  const response = await request(app).post('/schoolClass').set('Authorization', `Bearer ${token}`).send({
    discipline,
    year,
    numberClass,
    dayOfWeek,
    time,
    teacherId,
  });
  schoolClassTest.schoolId = response.body.result.schoolId;
  schoolClassTest.id = response.body.result.id;
  return { schoolClassTest, response };
}
async function createSchoolClass() {
  const schoolTest = await loginSchool();
  if (!schoolTest || schoolTest.token === null) {
    return null;
  }
  const { response, schoolClassTest } = await schoolClass(schoolTest.token);
  return { response, schoolClassTest, schoolTest };
}
async function createSchoolClassMoreTime() {
  const school = await loginSchool();
  if (school.token === null) {
    return null;
  }
  const schoolClassFind = await schoolClass(school.token);
  const schoolClasses = [];
  schoolClasses.push(schoolClassFind);
  for (let i = 0; i < 3; i++) {
    const schoolClassResult = await schoolClass(school.token);
    schoolClasses.push(schoolClassResult);
  }
  return { schoolClasses, school, schoolClassFind };
}
describe('Test all', () => {
  it('Create School ', async () => {
    const school = await createSchool();
    expect(school.response.body.result.schoolCode).toEqual(school.schoolTest.schoolCode);
    expect(school.response.body.result.city).toEqual(school.schoolTest.city);
    expect(school.response.body.result.state).toEqual(school.schoolTest.state);
    expect(school.response.body.result.street).toEqual(school.schoolTest.street);
    expect(school.response.body.result.cep).toEqual(school.schoolTest.cep);
    expect(school.response.body.result.profileName).toEqual(school.schoolTest.profileName);
    expect(school.response.statusCode).toEqual(200);
  }, 10000);
  it('School login', async () => {
    const { schoolTest } = await createSchool();
    const loginResponse = await request(app).post('/session/school').send({
      schoolCode: schoolTest.schoolCode,
      password: schoolTest.password,
    });
    expect(loginResponse.body.result.schoolCode).toEqual(schoolTest.schoolCode);
    expect(loginResponse.statusCode).toEqual(200);
  }, 10000);
  it('View school ', async () => {
    const schoolTest = await loginSchool();
    const response = await request(app).get('/school/view').set('Authorization', `Bearer ${schoolTest.token}`);
    expect(response.body.result.schoolCode).toEqual(schoolTest.schoolCode);
    expect(response.body.result.city).toEqual(schoolTest.city);
    expect(response.body.result.state).toEqual(schoolTest.state);
    expect(response.body.result.street).toEqual(schoolTest.street);
    expect(response.body.result.cep).toEqual(schoolTest.cep);
    expect(response.body.result.profileName).toEqual(schoolTest.profileName);
    expect(response.statusCode).toEqual(200);
  }, 10000);
  it('View School Public', async () => {
    const result = await createSchoolMoreTime();
    if (!result) {
      return null;
    }

    const schoolList = await request(app).get('/school/viewPublic').send({
      profileName: result.schoolFind.schoolTest.profileName,
    });

    expect(schoolList.statusCode).toEqual(200);
    expect(schoolList.body.result).toBeTruthy();

    result.schools.forEach((schoolTest) => {
      const isSchoolInList = schoolList.body.result.some((school: any) => {
        return school.profileName === result.schoolFind.schoolTest.profileName;
      });

      expect(isSchoolInList).toBeTruthy();
    });
  }, 10000);
  it('List School Admin', async () => {
    const result = await createSchoolMoreTime();
    if (!result) {
      return null;
    }
    const schoolList = await request(app).get('/school/listAdmin').set('secret', secretToken);
    expect(schoolList.statusCode).toEqual(200);
    expect(schoolList.body.result).toBeTruthy();

    result.schools.forEach((schoolTest) => {
      const isSchoolInList = schoolList.body.result.some((school: any) => {
        return (
          school.schoolCode === schoolTest.schoolTest.schoolCode &&
          school.city === schoolTest.schoolTest.city &&
          school.state === schoolTest.schoolTest.state &&
          school.street === schoolTest.schoolTest.street &&
          school.cep === schoolTest.schoolTest.cep &&
          school.profileName === schoolTest.schoolTest.profileName
        );
      });
      expect(isSchoolInList).toBeTruthy();
    });
  }, 10000);
  it('List School Public', async () => {
    const result = await createSchoolMoreTime();
    if (!result) {
      return null;
    }
    const schoolList = await request(app).get('/school/list').send({});
    expect(schoolList.statusCode).toEqual(200);
    expect(schoolList.body.result).toBeTruthy();

    result.schools.forEach((schoolTest) => {
      const isSchoolInList = schoolList.body.result.some((school: any) => {
        return (
          school.city === schoolTest.schoolTest.city &&
          school.state === schoolTest.schoolTest.state &&
          school.street === schoolTest.schoolTest.street &&
          school.cep === schoolTest.schoolTest.cep &&
          school.profileName === schoolTest.schoolTest.profileName
        );
      });
      expect(isSchoolInList).toBeTruthy();
    });
  }, 10000);

  /// ///////////////// ///////////////// ///////////////// ///////////////// //////////////
  /// ///////////////// ///////////////// ///////////////// ///////////////// //////////////
  /// ///////////////// ///////////////// ///////////////// ///////////////// //////////////
  it('Create Student ', async () => {
    const student = await createStudent();
    if (!student) {
      throw new Error('student Create ERROR: '); // Retornar null ou lançar um erro, dependendo do que deseja.
    }
    expect(student.response.body.result.registration).toEqual(student.studentTest.registration);
    expect(student.response.body.result.profileName).toEqual(student.studentTest.profileName);
    expect(student.response.body.result.schoolId).toEqual(student.studentTest.schoolId);
    expect(student.response.statusCode).toEqual(200);
  }, 10000);
  it('Login Student ', async () => {
    const student = await createStudent();
    if (!student) {
      throw new Error('student Login ERROR: '); // Retornar null ou lançar um erro, dependendo do que deseja.
    }
    const loginResponse = await request(app).post('/session/student').send({
      registration: student.studentTest.registration,
      password: student.studentTest.password,
    });
    expect(loginResponse.body.result.registration).toEqual(student.studentTest.registration);
    expect(loginResponse.body.result.schoolId).toEqual(student.studentTest.schoolId);
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
    const school = await createStudent();
    const loginResponse = await request(app)
      .get('/student/viewSchool')
      .set('Authorization', `Bearer ${school?.schoolTest.token}`)
      .send({
        registration: school?.studentTest.registration,
      });
    expect(loginResponse.body.result.schoolId).toEqual(school?.studentTest.schoolId);
    expect(loginResponse.body.result.profileName).toEqual(school?.studentTest.profileName);
    expect(loginResponse.statusCode).toEqual(200);
  }, 10000);
  it('Update Student ', async () => {
    const school = await createStudent();
    if (!school) {
      throw new Error('student Create ERROR: '); // Retornar null ou lançar um erro, dependendo do que deseja.
    }
    const schoolClass = await createSchoolClass();
    if (!schoolClass) {
      throw new Error('schoolClass Create ERROR: '); // Retornar null ou lançar um erro, dependendo do que deseja.
    }
    const response = await request(app)
      .put('/student/update')
      .set('Authorization', `Bearer ${school.schoolTest.token}`)
      .send({
        registration: school.studentTest.registration,
        id: schoolClass.schoolClassTest.id,
      });
    expect(response.body.result.schoolId).toEqual(school.studentTest.schoolId);
    expect(response.body.result.registration).toEqual(school.studentTest.registration);
    expect(response.body.result.profileName).toEqual(school.studentTest.profileName);
    expect(response.body.result.schoolClass[0].discipline).toEqual(schoolClass.schoolClassTest.discipline);
    expect(response.body.result.schoolClass[0].year).toEqual(schoolClass.schoolClassTest.year);
    expect(response.body.result.schoolClass[0].numberClass).toEqual(schoolClass.schoolClassTest.numberClass);
    expect(response.body.result.schoolClass[0].time).toEqual(schoolClass.schoolClassTest.time);
    expect(response.body.result.schoolClass[0].dayOfWeek).toEqual(schoolClass.schoolClassTest.dayOfWeek);

    expect(response.statusCode).toEqual(200);
  }, 10000);
  it('List Student', async () => {
    const result = await createStudentMoreTime();
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
      const isTeacherInList = studentList.body.result.some((student: any) => {
        return (
          student.schoolId === studentTest.studentTest.schoolId &&
          student.registration === studentTest.studentTest.registration &&
          student.profileName === studentTest.studentTest.profileName
        );
      });
      expect(isTeacherInList).toBeTruthy();
    });
  }, 10000);
  /// ///////////////// ///////////////// ///////////////// ///////////////// //////////////
  /// ///////////////// ///////////////// ///////////////// ///////////////// //////////////
  /// ///////////////// ///////////////// ///////////////// ///////////////// //////////////
  it('Create Teacher ', async () => {
    const teacher = await createTeacher();
    if (!teacher) {
      throw new Error('Teacher Create ERROR: ');
    }
    expect(teacher.response.body.result.teacherCode).toEqual(teacher.teacherTest.teacherCode);
    expect(teacher.response.body.result.discipline).toEqual(teacher.teacherTest.discipline);
    expect(teacher.response.body.result.profileName).toEqual(teacher.teacherTest.profileName);
    expect(teacher.response.body.result.schoolId).toEqual(teacher.teacherTest.schoolId);
    expect(teacher.response.statusCode).toEqual(200);
  }, 10000);
  it('Login Teacher ', async () => {
    const teacher = await createTeacher();
    if (!teacher) {
      throw new Error('Teacher Login ERROR: ');
    }
    const loginResponse = await request(app).post('/session/teacher').send({
      teacherCode: teacher.teacherTest.teacherCode,
      password: teacher.teacherTest.password,
    });
    expect(loginResponse.body.result.teacherCode).toEqual(teacher.teacherTest.teacherCode);
    expect(loginResponse.body.result.schoolId).toEqual(teacher.teacherTest.schoolId);
    expect(loginResponse.statusCode).toEqual(200);
  }, 10000);
  it('View Teacher by Teacher ', async () => {
    const teacher = await loginTeacher();
    if (!teacher) {
      throw new Error('teacher Login ERROR: '); // Retornar null ou lançar um erro, dependendo do que deseja.
    }
    const response = await request(app).get('/teacher/viewTeacher').set('Authorization', `Bearer ${teacher.token}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.result.schoolId).toEqual(teacher.schoolId);
    expect(response.body.result.discipline).toEqual(teacher.discipline);
    expect(response.body.result.profileName).toEqual(teacher.profileName);
  }, 10000);
  it('View Teacher by School ', async () => {
    const school = await createTeacher();
    if (!school) {
      throw new Error('school ERROR: '); // Retornar null ou lançar um erro, dependendo do que deseja.
    }
    const response = await request(app)
      .get('/teacher/viewSchool')
      .set('Authorization', `Bearer ${school.schoolTest.token}`)
      .send({
        teacherCode: school.teacherTest.teacherCode,
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body.result.schoolId).toEqual(school.teacherTest.schoolId);
    expect(response.body.result.discipline).toEqual(school.teacherTest.discipline);
    expect(response.body.result.profileName).toEqual(school.teacherTest.profileName);
  }, 10000);
  it('Update Teacher ', async () => {
    const school = await createTeacher();
    if (!school) {
      throw new Error('student Create ERROR: '); // Retornar null ou lançar um erro, dependendo do que deseja.
    }
    const schoolClass = await createSchoolClass();
    if (!schoolClass) {
      throw new Error('schoolClass Create ERROR: '); // Retornar null ou lançar um erro, dependendo do que deseja.
    }
    const response = await request(app)
      .put('/teacher/')
      .set('Authorization', `Bearer ${school.schoolTest.token}`)
      .send({
        teacherCode: school.teacherTest.teacherCode,
        id: schoolClass.schoolClassTest.id,
      });
    expect(response.body.result.schoolId).toEqual(school.teacherTest.schoolId);
    expect(response.body.result.teacherCode).toEqual(school.teacherTest.teacherCode);
    expect(response.body.result.profileName).toEqual(school.teacherTest.profileName);
    expect(response.body.result.schoolClass[0].discipline).toEqual(schoolClass.schoolClassTest.discipline);
    expect(response.body.result.schoolClass[0].year).toEqual(schoolClass.schoolClassTest.year);
    expect(response.body.result.schoolClass[0].numberClass).toEqual(schoolClass.schoolClassTest.numberClass);
    expect(response.body.result.schoolClass[0].time).toEqual(schoolClass.schoolClassTest.time);
    expect(response.body.result.schoolClass[0].dayOfWeek).toEqual(schoolClass.schoolClassTest.dayOfWeek);
    expect(response.statusCode).toEqual(200);
  }, 10000);
  it('List Teacher', async () => {
    const result = await createTeacherMoreTime();
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
          teacher.schoolId === teacherTest.teacherTest.schoolId &&
          teacher.teacherCode === teacherTest.teacherTest.teacherCode &&
          teacher.discipline === teacherTest.teacherTest.discipline &&
          teacher.profileName === teacherTest.teacherTest.profileName
        );
      });
      expect(isTeacherInList).toBeTruthy();
    });
  }, 10000);
  /// ///////////////// ///////////////// ///////////////// ///////////////// //////////////
  /// ///////////////// ///////////////// ///////////////// ///////////////// //////////////
  /// ///////////////// ///////////////// ///////////////// ///////////////// //////////////
  it('Create SchoolClass ', async () => {
    const schoolClass = await createSchoolClass();
    if (!schoolClass) {
      throw new Error('schoolClass Create ERROR: ');
    }

    expect(schoolClass.response.body.result.discipline).toEqual(schoolClass.schoolClassTest.discipline);
    expect(schoolClass.response.body.result.year).toEqual(schoolClass.schoolClassTest.year);
    expect(schoolClass.response.body.result.time).toEqual(schoolClass.schoolClassTest.time);
    expect(schoolClass.response.body.result.schoolId).toEqual(schoolClass.schoolClassTest.schoolId);
    expect(schoolClass.response.body.result.numberClass).toEqual(schoolClass.schoolClassTest.numberClass);
    expect(schoolClass.response.body.result.teacherId).toEqual(schoolClass.schoolClassTest.teacherId);
    expect(schoolClass.response.statusCode).toEqual(200);
  }, 10000);
  it('View SchoolClass', async () => {
    const schoolClass = await createSchoolClassMoreTime();
    if (!schoolClass) {
      return null;
    }

    const schoolClassList = await request(app)
      .get('/schoolClass/view')
      .set('Authorization', `Bearer ${schoolClass.school.token}`)
      .send({
        discipline: schoolClass.schoolClassFind.schoolClassTest.discipline,
        year: schoolClass.schoolClassFind.schoolClassTest.year,
      });

    expect(schoolClassList.statusCode).toEqual(200);
    expect(schoolClassList.body.result).toBeTruthy();

    schoolClass.schoolClasses.forEach((schoolClassTest) => {
      const isSchoolClassInList = schoolClassList.body.result.some((schoolClassResult: any) => {
        return (
          schoolClassResult.discipline === schoolClass.schoolClassFind.schoolClassTest.discipline &&
          schoolClassResult.year === schoolClass.schoolClassFind.schoolClassTest.year
        );
      });

      expect(isSchoolClassInList).toBeTruthy();
    });
  }, 10000);
  it('View Details SchoolClass ', async () => {
    const schoolClass = await createSchoolClass();
    if (!schoolClass) {
      throw new Error('schoolClass Create ERROR: ');
    }
    const response = await request(app)
      .get('/schoolClass/viewDetails')
      .set('Authorization', `Bearer ${schoolClass.schoolTest.token}`)
      .send({
        id: schoolClass.schoolClassTest.id,
      });

    expect(response.body.result.discipline).toEqual(schoolClass.schoolClassTest.discipline);
    expect(response.body.result.year).toEqual(schoolClass.schoolClassTest.year);
    expect(response.body.result.numberClass).toEqual(schoolClass.schoolClassTest.numberClass);
    expect(response.body.result.time).toEqual(schoolClass.schoolClassTest.time);
    expect(response.body.result.schoolId).toEqual(schoolClass.schoolClassTest.schoolId);
    expect(response.body.result.teacherId).toEqual(schoolClass.schoolClassTest.teacherId);
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
    expect(response.body.excelUrl).toEqual('http://url-aleatoria.com');
    expect(response.statusCode).toEqual(200);
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
    expect(response.body.excelUrl).toEqual('http://url-aleatoria.com');
    expect(response.statusCode).toEqual(200);
  });
});
