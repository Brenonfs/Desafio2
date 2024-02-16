import { NotFoundError } from '../../helpers/api-erros';
import { SchoolRepository } from '../../repositories/school.repository';

class ViewSchoolPublicService {
  private schoolRepository: SchoolRepository;

  constructor() {
    this.schoolRepository = new SchoolRepository();
  }

  async execute(profileName: string) {
    const schoolExists = await this.schoolRepository.findByProfile(profileName);
    if (!schoolExists) {
      throw new NotFoundError(`Não há escolas com o nome '${profileName}'.`);
    }

    return schoolExists;
  }
}
export { ViewSchoolPublicService };
