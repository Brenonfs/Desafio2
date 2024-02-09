/* eslint-disable prettier/prettier */
import { UnauthorizedError } from '../../helpers/api-erros';
import { TeacherRepository } from '../../repositories/teacher.repository';

class CreateTeacherService {
  private teacherRepository: TeacherRepository;

  constructor() {
    this.teacherRepository = new TeacherRepository();
  }

  async execute(teacherCode: string, password: string,  discipline: string, profileName: string, schoolId: number) {
    const teacherExists = await this.teacherRepository.findByTeacherCode(teacherCode, schoolId);
    if (teacherExists) {
      throw new UnauthorizedError(`Este nome já está cadastrado.`);
    }
    const teacher = await this.teacherRepository.saveTeacher(teacherCode, password, profileName, discipline, schoolId);
    return teacher;
  }
}

export { CreateTeacherService };
