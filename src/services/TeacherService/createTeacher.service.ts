/* eslint-disable prettier/prettier */
import { UnauthorizedError } from '../../helpers/api-erros';
import { TeacherRepository } from '../../repositories/teacher.repository';

class CreateTeacherService {
  private teacherRepository: TeacherRepository;

  constructor() {
    this.teacherRepository = new TeacherRepository();
  }

  async execute(name: string, password: string, profileName: string, discipline: string, schoolId: number) {
    const teacherExists = await this.teacherRepository.findByName(name);
    if (teacherExists) {
      throw new UnauthorizedError(`Este nome já está cadastrado.`);
    }
    const teacher = await this.teacherRepository.saveTeacher(name, password, profileName, discipline, schoolId);
    return teacher;
  }
}

export { CreateTeacherService };
