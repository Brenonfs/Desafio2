/* eslint-disable import/no-extraneous-dependencies */

import { prisma } from '../database';

export class TeacherRepository {
  async saveTeacher(teacherCode: string, password: string, profileName: string, discipline: string, schoolId: number) {
    const teacher = await prisma.teacher.create({
      data: { teacherCode, password, discipline, profileName, schoolId },
      select: {
        id: true,
        teacherCode: true,
        discipline: true,
        profileName: true,
        schoolId: true,
      },
    });
    return teacher;
  }
  async findByName(teacherCode: string, schoolId: number) {
    const teacherExists = await prisma.teacher.findUnique({
      where: { teacherCode, schoolId },
      select: {
        id: true,
        teacherCode: true,
        discipline: true,
        profileName: true,
        schoolId: true,
      },
    });
    return teacherExists;
  }
  async findByteacherCode(teacherCode: string, schoolId: number) {
    const teacherExists = await prisma.teacher.findUnique({
      where: { teacherCode, schoolId },
      select: {
        id: true,
        teacherCode: true,
        discipline: true,
        profileName: true,
        schoolId: true,
        schoolClass: true,
      },
    });
    return teacherExists;
  }
  async listTeacher(schoolId: number) {
    const teacherExists = await prisma.teacher.findMany({
      where: { schoolId },
      select: {
        id: true,
        teacherCode: true,
        discipline: true,
        profileName: true,
        schoolId: true,
      },
    });
    return teacherExists;
  }
  async findByProfile(profileName: string, schoolId: number) {
    const teacherExists = await prisma.teacher.findMany({
      where: { profileName, schoolId },
    });
    return teacherExists;
  }
  async deleteTeacher(teacherCode: string, schoolId: number) {
    const deletedTeacher = await prisma.teacher.delete({
      where: { schoolId, teacherCode },
    });
    return !!deletedTeacher;
  }
  async updateTeacher(teacherCode: string, idSchoolClass: number, schoolId: number) {
    const updateTeacher = await prisma.teacher.update({
      where: { teacherCode, schoolId },
      data: {
        schoolClass: {
          connect: [{ id: idSchoolClass }],
        },
      },
    });
    return updateTeacher;
  }
}
