import { SchoolRepository } from '../../repositories/school.repository';

class ListPublicSchoolService {
  private schoolRepository: SchoolRepository;

  constructor() {
    this.schoolRepository = new SchoolRepository();
  }

  async execute() {
    const school = await this.schoolRepository.listSchool();
    return school;
  }
}
export { ListPublicSchoolService };
