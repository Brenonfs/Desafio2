import { NotFoundError } from '../../helpers/api-erros';
import { TeacherRepository } from '../../repositories/teacher.repository';

class ListTeacherService {
  private teacherRepository: TeacherRepository;

  constructor() {
    this.teacherRepository = new TeacherRepository();
  }

  async execute(schoolId: number) {
    const teacherExists = await this.teacherRepository.listTeacher(schoolId);
    if (!teacherExists) {
      throw new NotFoundError(`Não há professor para a escolas com o id '${schoolId}'.`);
    }
    return teacherExists;
  }
}
export { ListTeacherService };
