import { prisma } from '../database';

export class SessionRepository {
  users = [];
  async findByName(name: string) {
    const schoolExists = await prisma.school.findFirst({
      where: { name },
    });
    return schoolExists;
  }
}
