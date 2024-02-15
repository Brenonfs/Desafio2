import { BadRequestError } from '../../helpers/api-erros';
import { SchoolClassRepository } from '../../repositories/schoolClass.repository';

class ViewSchoolClassService {
  private classRepository: SchoolClassRepository;

  constructor() {
    this.classRepository = new SchoolClassRepository();
  }

  async execute(discipline: string, year: number, schoolId: number) {
    const classExists = await this.classRepository.findByDisciplineAndYear(discipline, year, schoolId);
    if (!classExists) {
      throw new BadRequestError(`Não há turma(a) com essas especificações.`);
    }

    return classExists;
  }
}
export { ViewSchoolClassService };
