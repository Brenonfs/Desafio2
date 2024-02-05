import { BadRequestError } from '../../helpers/api-erros';
import { TeacherRepository } from '../../repositories/teacher.repository';

class DeleteTeacherService {
  private teacherRepository: TeacherRepository;

  constructor() {
    this.teacherRepository = new TeacherRepository();
  }

  async execute(name: string, schoolId: number) {
    const deletedTeacher = await this.teacherRepository.deleteTeacher(name, schoolId);

    if (!deletedTeacher) {
      throw new BadRequestError(`Professor(a) com o nome '${name}' não encontrada.`);
    }
    return {
      message: `Professor(a) com o nome '${name}' foi deletada com sucesso.`,
    };
  }
}

export { DeleteTeacherService };
