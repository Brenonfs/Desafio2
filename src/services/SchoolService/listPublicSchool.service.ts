import { NotFoundError } from '../../helpers/api-erros';
import { SchoolRepository } from '../../repositories/school.repository';

class ListPublicSchoolService {
  private schoolRepository: SchoolRepository;

  constructor() {
    this.schoolRepository = new SchoolRepository();
  }

  async execute() {
    const schoolExists = await this.schoolRepository.listSchool();
    if (!schoolExists) {
      throw new NotFoundError(`Não há escolas.`);
    }

    return schoolExists;
  }
}
export { ListPublicSchoolService };
