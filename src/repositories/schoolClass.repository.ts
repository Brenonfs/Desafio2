import { prisma } from '../database';

export class SchoolClassRepository {
  async saveSchoolClass(
    schoolClassCode: string,
    discipline: string,
    year: number,
    numberClass: number,
    dayOfWeek: string,
    time: string,
    schoolId: number,
    teacherId: number | null,
  ) {
    const classes = await prisma.schoolClass.create({
      data: { schoolClassCode, discipline, year, numberClass, dayOfWeek, time, schoolId, teacherId },
    });
    return classes;
  }

  async findByName(schoolClassCode: string, schoolId: number) {
    const classExists = await prisma.schoolClass.findUnique({
      where: { schoolId, schoolClassCode },
      select: {
        id: true,
        schoolClassCode: true,
        discipline: true,
        year: true,
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
  async findBySchoolClassCode(schoolClassCode: string, schoolId: number) {
    const classExists = await prisma.schoolClass.findUnique({
      where: { schoolId, schoolClassCode },
      select: {
        id: true,
        schoolClassCode: true,
        discipline: true,
        year: true,
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
  async listStudentClass(schoolClassCode: string, schoolId: number) {
    const classExists = await prisma.schoolClass.findUnique({
      where: { schoolClassCode, schoolId },
      select: {
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

  // async findByProfile(profileName: string, schoolId: number) {
  //   const teacherExists = await prisma.teacher.findMany({
  //     where: { schoolId, profileName },
  //   });
  //   return teacherExists;
  // }

  async updateSchoolClass(idStudent: number, schoolClassCode: string, schoolId: number) {
    const updateSchoolClass = await prisma.schoolClass.update({
      where: { schoolClassCode, schoolId },
      data: {
        students: {
          connect: [{ id: idStudent }],
        },
      },
    });
    return updateSchoolClass;
  }
  async updateTeacher(teacherId: number, schoolClassCode: string, schoolId: number) {
    const updateTeacher = await prisma.schoolClass.update({
      where: { schoolClassCode, schoolId },
      data: { teacherId },
    });
    return updateTeacher;
  }
}
