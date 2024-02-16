import { BadRequestError } from '../../helpers/api-erros';
import { TeacherRepository } from '../../repositories/teacher.repository';

class ViewTeacherSchoolService {
  private teacherRepository: TeacherRepository;

  constructor() {
    this.teacherRepository = new TeacherRepository();
  }

  async execute(teacherCode: string, teacherId: number | undefined, schoolId: number | undefined) {
    if (teacherId !== undefined && schoolId === undefined) {
      const teacherExists = await this.teacherRepository.findById(teacherId);
      return teacherExists;
    } else if (schoolId !== undefined && teacherId === undefined) {
      if (!teacherCode) {
        throw new BadRequestError('É necessário fornecer um número de registro.');
      }
      const teacherExists = await this.teacherRepository.findByTeacherCode(teacherCode, schoolId);
      return teacherExists;
    } else {
      throw new BadRequestError('É necessário fornecer apenas um dos seguintes parâmetros: teacherId ou schoolId.');
    }
  }
}

export { ViewTeacherSchoolService };
