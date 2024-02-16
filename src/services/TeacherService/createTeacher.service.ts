import { NotFoundError, UnauthorizedError } from '../../helpers/api-erros';
import { TeacherRepository } from '../../repositories/teacher.repository';

class CreateTeacherService {
  private teacherRepository: TeacherRepository;

  constructor() {
    this.teacherRepository = new TeacherRepository();
  }

  async execute(teacherCode: string, password: string, discipline: string, profileName: string, schoolId: number) {
    const teacherExists = await this.teacherRepository.findByTeacherCode(teacherCode, schoolId);
    if (teacherExists) {
      throw new UnauthorizedError(`Este nome já está cadastrado.`);
    }
    const createTeacher = await this.teacherRepository.saveTeacher(
      teacherCode,
      password,
      profileName,
      discipline,
      schoolId,
    );
    if (!createTeacher) {
      throw new NotFoundError(`Não foi possível criar professor com essas especificações.`);
    }
    return createTeacher;
  }
}

export { CreateTeacherService };
