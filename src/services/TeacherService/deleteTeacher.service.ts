import { BadRequestError } from '../../helpers/api-erros';
import { TeacherRepository } from '../../repositories/teacher.repository';

class DeleteTeacherService {
  private teacherRepository: TeacherRepository;

  constructor() {
    this.teacherRepository = new TeacherRepository();
  }

  async execute(teacherCode: string, schoolId: number) {
    const deletedTeacher = await this.teacherRepository.deleteTeacher(teacherCode, schoolId);

    if (!deletedTeacher) {
      throw new BadRequestError(`Professor(a) com o nome '${teacherCode}' não encontrada.`);
    }
    return {
      message: `Professor(a) com o nome '${teacherCode}' foi deletada com sucesso.`,
    };
  }
}

export { DeleteTeacherService };
