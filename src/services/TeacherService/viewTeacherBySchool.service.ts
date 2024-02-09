import { BadRequestError } from '../../helpers/api-erros';
import { TeacherRepository } from '../../repositories/teacher.repository';

class ViewTeacherBySchoolService {
  private teacherRepository: TeacherRepository;

  constructor() {
    this.teacherRepository = new TeacherRepository();
  }

  async execute(teacherCode: string, schoolId: number) {
    const teacherExists = await this.teacherRepository.findByTeacherCode(teacherCode, schoolId);

    if (!teacherExists) {
      throw new BadRequestError(`Não há professor(a) com o codigo '${teacherCode}'.`);
    }
    return teacherExists;
  }
}
export { ViewTeacherBySchoolService };
