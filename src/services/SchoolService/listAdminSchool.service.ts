import { NotFoundError } from '../../helpers/api-erros';
import { SchoolRepository } from '../../repositories/school.repository';

class ListAdminSchoolService {
  private schoolRepository: SchoolRepository;

  constructor() {
    this.schoolRepository = new SchoolRepository();
  }

  async execute() {
    const schoolExists = await this.schoolRepository.listSchoolAdmin();
    if (!schoolExists) {
      throw new NotFoundError(`Não há escolas.`);
    }

    return schoolExists;
  }
}
export { ListAdminSchoolService };
