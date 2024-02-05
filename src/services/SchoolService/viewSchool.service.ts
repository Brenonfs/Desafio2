import { BadRequestError } from '../../helpers/api-erros';
import { SchoolRepository } from '../../repositories/school.repository';

class ViewSchoolService {
  private schoolRepository: SchoolRepository;

  constructor() {
    this.schoolRepository = new SchoolRepository();
  }

  async execute(profileName: string) {
    const schoolExists = await this.schoolRepository.findByProfile(profileName);
    if (!schoolExists || schoolExists.length === 0) {
      throw new BadRequestError(`Não há escolas com o nome '${profileName}'.`);
    }

    return schoolExists;
  }
}
export { ViewSchoolService };
