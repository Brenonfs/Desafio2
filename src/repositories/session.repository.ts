import { prisma } from '../database';

export class SessionRepository {
  users = [];
  async findBySchoolCode(schoolCode: string) {
    const schoolExists = await prisma.school.findUnique({
      where: { schoolCode },
    });
    return schoolExists;
  }
  async findByRegistration(registration: string) {
    const studentExists = await prisma.student.findUnique({
      where: { registration },
    });
    return studentExists;
  }
  async findByTeacherCode(teacherCode: string) {
    const teacherExists = await prisma.teacher.findUnique({
      where: { teacherCode },
    });
    return teacherExists;
  }
}
