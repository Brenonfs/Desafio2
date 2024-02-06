import { prisma } from '../database';

export class SessionRepository {
  users = [];
  async findBySchoolCode(schoolCode: string) {
    const schoolExists = await prisma.school.findFirst({
      where: { schoolCode },
    });
    return schoolExists;
  }
  async findByRegistration(registration: string) {
    const studentExists = await prisma.student.findFirst({
      where: { registration },
    });
    return studentExists;
  }
}
