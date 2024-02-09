import { BadRequestError } from '../../helpers/api-erros';
import { SchoolRepository } from '../../repositories/school.repository';

class ViewSchoolService {
  private schoolRepository: SchoolRepository;

  constructor() {
    this.schoolRepository = new SchoolRepository();
  }

  async execute(schoolId: number) {
    const schoolExists = await this.schoolRepository.findById(schoolId);
    if (!schoolExists) {
      throw new BadRequestError(`Não há escolas com o nome '${schoolId}'.`);
    }

    return schoolExists;
  }
}
export { ViewSchoolService };
