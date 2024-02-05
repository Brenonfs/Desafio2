import { BadRequestError } from '../../helpers/api-erros';
import { SchoolClassRepository } from '../../repositories/schoolClass.repository';

class ViewSchoolClassService {
  private classRepository: SchoolClassRepository;

  constructor() {
    this.classRepository = new SchoolClassRepository();
  }

  async execute(schoolClassCode: string, schoolId: number) {
    const classExists = await this.classRepository.findByName(schoolClassCode, schoolId);
    if (!classExists) {
      throw new BadRequestError(`Não há turma(a) com o nome '${schoolClassCode}'.`);
    }
    return {
      id: classExists.id,
      schoolClassCode: classExists.schoolClassCode,
      discipline: classExists.discipline,
      year: classExists.year,
      dayOfWeek: classExists.dayOfWeek,
      Time: classExists.Time,
      schoolId: classExists.schoolId,
      teacherId: classExists.teacherId,
    };
  }
}
export { ViewSchoolClassService };
