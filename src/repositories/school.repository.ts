/* eslint-disable import/no-extraneous-dependencies */

import { hash } from 'bcryptjs';
import { prisma } from '../database';

export class SchoolRepository {
  async saveSchool(schoolCode: string, password: string, address: string, profileName: string) {
    const hashedPassword = await hash(password, 8);
    const school = await prisma.school.create({
      data: { schoolCode, password: hashedPassword, address, profileName },
    });
    return school;
  }
  async findByAddres(address: string) {
    const schoolExists = await prisma.school.findUnique({
      where: { address },
    });
    return schoolExists;
  }
  async listSchool() {
    const schoolExists = await prisma.school.findMany({
      select: {
        id: true,
        address: true,
        profileName: true,
      },
    });

    return schoolExists;
  }
  async listSchooAdmin() {
    const schoolExists = await prisma.school.findMany({
      select: {
        id: true,
        schoolCode: true,
        address: true,
        profileName: true,
      },
    });

    return schoolExists;
  }

  async findByProfile(profileName: string) {
    const schoolExists = await prisma.school.findMany({
      where: { profileName },
      select: {
        id: true,
        address: true,
        profileName: true,
      },
    });
    return schoolExists;
  }
  async deleteSchool(schoolCode: string) {
    const deletedSchool = await prisma.school.delete({
      where: { schoolCode },
    });
    return !!deletedSchool;
  }
}
