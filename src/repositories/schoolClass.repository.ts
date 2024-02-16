import { prisma } from '../database';

export class SchoolClassRepository {
  async saveSchoolClass(
    discipline: string,
    year: number,
    numberClass: number,
    dayOfWeek: string,
    time: string,
    schoolId: number,
    teacherId: number | null,
  ) {
    const classes = await prisma.schoolClass.create({
      data: { discipline, year, numberClass, dayOfWeek, time, schoolId, teacherId },
    });
    return classes;
  }

  async findByID(id: number) {
    if (id === undefined || id === null) {
      throw new Error('ID não fornecido para findByID');
    }
    const classExists = await prisma.schoolClass.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        discipline: true,
        year: true,
        numberClass: true,
        dayOfWeek: true,
        time: true,
        schoolId: true,
        teacherId: true,
        students: {
          select: {
            id: true,
            registration: true,
            profileName: true,
          },
        },
      },
    });
    return classExists;
  }
  async findByDisciplineAndYear(discipline: string, year: number, schoolId: number) {
    const classExists = await prisma.schoolClass.findMany({
      where: { schoolId, discipline, year },
      select: {
        id: true,
        discipline: true,
        year: true,
        numberClass: true,
        dayOfWeek: true,
        time: true,
        schoolId: true,
        teacherId: true,
        students: {
          select: {
            id: true,
            registration: true,
            profileName: true,
          },
        },
      },
    });
    return classExists;
  }
  async listSchoolClass(schoolId: number) {
    const classExists = await prisma.schoolClass.findMany({
      where: { schoolId },
    });
    return classExists;
  }
}
