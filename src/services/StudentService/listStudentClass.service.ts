import { SchoolClassRepository } from '../../repositories/schoolClass.repository';

class ListStudentClassService {
  private schoolClassRepository: SchoolClassRepository;

  constructor() {
    this.schoolClassRepository = new SchoolClassRepository();
  }

  async execute(schoolClassCode: string, schoolId: number) {
    // const student = await this.schoolClassRepository.listStudentClass(id);
    // return student;
  }
}
export { ListStudentClassService };
