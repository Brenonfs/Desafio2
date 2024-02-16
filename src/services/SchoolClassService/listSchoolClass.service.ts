import { NotFoundError } from '../../helpers/api-erros';
import { SchoolClassRepository } from '../../repositories/schoolClass.repository';

class ListSchoolClassService {
  private schoolClassRepository: SchoolClassRepository;

  constructor() {
    this.schoolClassRepository = new SchoolClassRepository();
  }

  async execute(schoolId: number) {
    const classExists = await this.schoolClassRepository.listSchoolClass(schoolId);
    if (!classExists) {
      throw new NotFoundError(`Não há turma com essas especificações.`);
    }

    return classExists;
  }
}
export { ListSchoolClassService };
