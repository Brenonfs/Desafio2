import { BadRequestError } from '../../helpers/api-erros';
import { TeacherRepository } from '../../repositories/teacher.repository';

class ViewTeacherByTeacherService {
  private teacherRepository: TeacherRepository;

  constructor() {
    this.teacherRepository = new TeacherRepository();
  }

  async execute(teacherId: number) {
    const teacherExists = await this.teacherRepository.findById(teacherId);

    if (!teacherExists) {
      throw new BadRequestError(`Não há professor(a) com o id '${teacherId}'.`);
    }
    return teacherExists;
  }
}
export { ViewTeacherByTeacherService };
