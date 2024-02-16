/* eslint-disable import/no-extraneous-dependencies */

import { hash } from 'bcryptjs';
import { prisma } from '../database';

export class TeacherRepository {
  async saveTeacher(teacherCode: string, password: string, profileName: string, discipline: string, schoolId: number) {
    const hashedPassword = await hash(password, 8);
    const teacher = await prisma.teacher.create({
      data: { teacherCode, password: hashedPassword, discipline, profileName, schoolId },
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
  async findByTeacherCode(teacherCode: string, schoolId: number) {
    const teacherExists = await prisma.teacher.findUnique({
      where: { teacherCode, schoolId },
      select: {
        id: true,
        discipline: true,
        profileName: true,
        schoolId: true,
        schoolClass: true,
      },
    });
    return teacherExists;
  }
  async findById(teacherId: number) {
    const teacherExists = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: {
        id: true,
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
  async updateTeacher(teacherCode: string, idSchoolClass: number, schoolId: number) {
    const updateTeacher = await prisma.teacher.update({
      where: { teacherCode, schoolId },
      data: {
        schoolClass: {
          connect: [{ id: idSchoolClass }],
        },
      },
      select: {
        id: true,
        teacherCode: true,
        discipline: true,
        profileName: true,
        schoolId: true,
        schoolClass: true,
      },
    });
    return updateTeacher;
  }
}
