import { NotFoundError } from '../../helpers/api-erros';
import { SchoolClassRepository } from '../../repositories/schoolClass.repository';

class ViewSchoolClassService {
  private schoolClassRepository: SchoolClassRepository;

  constructor() {
    this.schoolClassRepository = new SchoolClassRepository();
  }

  async execute(discipline: string, year: number, schoolId: number) {
    const classExists = await this.schoolClassRepository.findByDisciplineAndYear(discipline, year, schoolId);
    if (!classExists) {
      throw new NotFoundError(`Não há turma com essas especificações.`);
    }

    return classExists;
  }
}
export { ViewSchoolClassService };
