import { BadRequestError } from '../../helpers/api-erros';
import { SchoolClassRepository } from '../../repositories/schoolClass.repository';

class ViewByIDSchoolClassService {
  private classRepository: SchoolClassRepository;

  constructor() {
    this.classRepository = new SchoolClassRepository();
  }

  async execute(id: number) {
    const classExists = await this.classRepository.findByID(id);
    if (!classExists) {
      throw new BadRequestError(`Não há turma(a) com essas especificações.`);
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
export { ViewByIDSchoolClassService };
