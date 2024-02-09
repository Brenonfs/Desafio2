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
    const studentCount = classExists.students.length;
    const availableSeats = Math.max(0, 40 - studentCount);

    const classWithStudentCount = {
      ...classExists,
      studentCount,
      availableSeats,
    };

    return classWithStudentCount;
  }
}
export { ViewSchoolClassService };
