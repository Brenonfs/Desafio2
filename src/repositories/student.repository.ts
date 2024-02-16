import { hash } from 'bcryptjs';
import { prisma } from '../database';

export class StudentRepository {
  async saveStudent(registration: string, password: string, profileName: string, schoolId: number) {
    const hashedPassword = await hash(password, 8);
    const student = await prisma.student.create({
      data: { registration, password: hashedPassword, schoolId, profileName },
      select: {
        id: true,
        registration: true,
        profileName: true,
        schoolId: true,
      },
    });
    return student;
  }
  async findById(studentId: number) {
    const studentExists = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        profileName: true,
        schoolId: true,
        schoolClass: true,
      },
    });
    return studentExists;
  }
  async findByRegistration(registration: string, schoolId: number) {
    const studentExists = await prisma.student.findUnique({
      where: { schoolId, registration },
      select: {
        id: true,
        registration: true,
        profileName: true,
        schoolId: true,
        schoolClass: true,
      },
    });
    return studentExists;
  }
  async listStudent(schoolId: number) {
    const studentExists = await prisma.student.findMany({
      where: { schoolId },
      select: {
        id: true,
        registration: true,
        profileName: true,
        schoolId: true,
      },
    });
    return studentExists;
  }
  async updateStudent(registration: string, idSchoolClass: number, schoolId: number) {
    const updateStudant = await prisma.student.update({
      where: { registration, schoolId },
      data: {
        schoolClass: {
          connect: [{ id: idSchoolClass }],
        },
      },
      select: {
        id: true,
        registration: true,
        profileName: true,
        schoolId: true,
        schoolClass: true,
      },
    });
    return updateStudant;
  }
}
