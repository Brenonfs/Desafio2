/* eslint-disable prettier/prettier */
import { SchoolRepository } from '../../repositories/school.repository';

class ListAdminSchoolService {
  private schoolRepository: SchoolRepository;

  constructor() {
    this.schoolRepository = new SchoolRepository();
  }

  async execute() {

    const school = await this.schoolRepository.listSchooAdmin();
    return school
  }
}
export { ListAdminSchoolService };
