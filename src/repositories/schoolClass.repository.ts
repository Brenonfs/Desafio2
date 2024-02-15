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
    const classExists = await prisma.schoolClass.findUnique({
      where: { id },
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

  // async findBySchoolClassCode(schoolId: number) {
  //   const classExists = await prisma.schoolClass.findUnique({
  //     where: { schoolId },
  //     select: {
  //       id: true,
  //       schoolClassCode: true,
  //       discipline: true,
  //       year: true,
  //       dayOfWeek: true,
  //       time: true,
  //       schoolId: true,
  //       teacherId: true,
  //       students: {
  //         select: {
  //           id: true,
  //           registration: true,
  //           profileName: true,
  //         },
  //       },
  //     },
  //   });
  //   return classExists;
  // }

  async listSchoolClass(schoolId: number) {
    const classExists = await prisma.schoolClass.findMany({
      where: { schoolId },
    });
    return classExists;
  }
  // async listStudentClass(schoolClassCode: string, schoolId: number) {
  //   const classExists = await prisma.schoolClass.findUnique({
  //     where: { schoolClassCode, schoolId },
  //     select: {
  //       students: {
  //         select: {
  //           id: true,
  //           registration: true,
  //           profileName: true,
  //         },
  //       },
  //     },
  //   });
  //   return classExists;
  // }

  // async updateSchoolClass(idStudent: number, schoolClassCode: string, schoolId: number) {
  //   const updateSchoolClass = await prisma.schoolClass.update({
  //     where: { schoolClassCode, schoolId },
  //     data: {
  //       students: {
  //         connect: [{ id: idStudent }],
  //       },
  //     },
  //   });
  //   return updateSchoolClass;
  // }
  async updateTeacher(teacherId: number, id: number, schoolId: number) {
    const updateTeacher = await prisma.schoolClass.update({
      where: { id, schoolId },
      data: { teacherId },
    });
    return updateTeacher;
  }
}
