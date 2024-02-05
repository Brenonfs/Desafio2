import { BadRequestError } from '../../helpers/api-erros';
import { TeacherRepository } from '../../repositories/teacher.repository';

class ViewTeacherService {
  private teacherRepository: TeacherRepository;

  constructor() {
    this.teacherRepository = new TeacherRepository();
  }

  async execute(profileName: string, schoolId: number) {
    const teacherExists = await this.teacherRepository.findByProfile(profileName, schoolId);
    if (!teacherExists) {
      throw new BadRequestError(`Não há professor(a) com o nome '${profileName}'.`);
    }
    return teacherExists;
  }
}
export { ViewTeacherService };
