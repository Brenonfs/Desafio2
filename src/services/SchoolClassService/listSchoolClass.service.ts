import { SchoolClassRepository } from '../../repositories/schoolClass.repository';

class ListSchoolClassService {
  private classRepository: SchoolClassRepository;

  constructor() {
    this.classRepository = new SchoolClassRepository();
  }

  async execute(schoolId: number) {
    const classes = await this.classRepository.listSchoolClass(schoolId);
    return classes;
  }
}
export { ListSchoolClassService };
