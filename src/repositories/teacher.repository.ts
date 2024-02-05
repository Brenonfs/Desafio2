/* eslint-disable import/no-extraneous-dependencies */

import { prisma } from '../database';

export class TeacherRepository {
  async saveTeacher(name: string, password: string, profileName: string, discipline: string, schoolId: number) {
    const teacher = await prisma.teacher.create({
      data: { name, password, discipline, profileName, schoolId },
      select: {
        id: true,
        name: true,
        discipline: true,
        profileName: true,
        schoolId: true,
      },
    });
    return teacher;
  }
  async findByName(name: string) {
    const teacherExists = await prisma.teacher.findUnique({
      where: { name },
      select: {
        id: true,
        name: true,
        discipline: true,
        profileName: true,
        schoolId: true,
      },
    });
    return teacherExists;
  }
  async listTeacher(schoolId: number) {
    const teacherExists = await prisma.teacher.findMany({
      where: { schoolId },
      select: {
        id: true,
        name: true,
        discipline: true,
        profileName: true,
        schoolId: true,
      },
    });
    return teacherExists;
  }
  async findByProfile(profileName: string, schoolId: number) {
    const teacherExists = await prisma.teacher.findMany({
      where: { schoolId, profileName },
    });
    return teacherExists;
  }
  async deleteTeacher(name: string, schoolId: number) {
    const deletedTeacher = await prisma.teacher.delete({
      where: { schoolId, name },
    });
    return !!deletedTeacher;
  }
}
