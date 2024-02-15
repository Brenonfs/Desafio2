/* eslint-disable import/no-extraneous-dependencies */

import { hash } from 'bcryptjs';
import { prisma } from '../database';

export class SchoolRepository {
  async saveSchool(
    schoolCode: string,
    password: string,
    city: string,
    state: string,
    street: string | null,
    cep: string,
    neighborhood: string | null,
    profileName: string,
  ) {
    const hashedPassword = await hash(password, 8);
    const school = await prisma.school.create({
      data: { schoolCode, password: hashedPassword, city, state, street, cep, neighborhood, profileName },
    });
    return school;
  }
  async findByCep(cep: string) {
    const schoolExists = await prisma.school.findUnique({
      where: { cep },
    });
    return schoolExists;
  }
  async listSchool() {
    const schoolExists = await prisma.school.findMany({
      select: {
        id: true,
        city: true,
        state: true,
        street: true,
        cep: true,
        profileName: true,
      },
    });

    return schoolExists;
  }
  async listSchoolAdmin() {
    const schoolExists = await prisma.school.findMany({
      select: {
        id: true,
        schoolCode: true,
        city: true,
        state: true,
        street: true,
        cep: true,
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
        city: true,
        state: true,
        street: true,
        cep: true,
        profileName: true,
      },
    });
    return schoolExists;
  }
  async findById(schoolId: number) {
    const schoolExists = await prisma.school.findUnique({
      where: { id: schoolId },
      select: {
        id: true,
        city: true,
        state: true,
        street: true,
        cep: true,
        profileName: true,
        schoolCode: true,
      },
    });
    return schoolExists;
  }
}
