import { NotFoundError } from '../../helpers/api-erros';
import { SchoolClassRepository } from '../../repositories/schoolClass.repository';

class ViewByIDSchoolClassService {
  private schoolClassRepository: SchoolClassRepository;

  constructor() {
    this.schoolClassRepository = new SchoolClassRepository();
  }

  async execute(id: number) {
    const classExists = await this.schoolClassRepository.findByID(id);
    if (!classExists) {
      throw new NotFoundError(`Não há turma com essas especificações.`);
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
