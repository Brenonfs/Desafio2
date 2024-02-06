import { StudentRepository } from '../../repositories/student.repository';

class ListStudentClassService {
  private studentRepository: StudentRepository;

  constructor() {
    this.studentRepository = new StudentRepository();
  }

  async execute(registration: string, schoolId: number) {
    const student = await this.studentRepository.listStudentClass(schoolId, registration);
    return student;
  }
}
export { ListStudentClassService };
