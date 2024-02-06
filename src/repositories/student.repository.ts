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

  async findByProfileName(profileName: string, schoolId: number) {
    const studentExists = await prisma.student.findMany({
      where: { schoolId, profileName },
    });
    return studentExists;
  }
  async findByName(registration: string, schoolId: number) {
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
  async listStudentClass(schoolId: number, registration: string) {
    const studentExists = await prisma.student.findMany({
      where: { registration, schoolId },
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

  async deleteStudent(registration: string, schoolId: number) {
    const deleteStudent = await prisma.student.delete({
      where: { schoolId, registration },
    });
    return !!deleteStudent;
  }

  async updateStudante(registration: string, idSchoolClass: number, schoolId: number) {
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
