import { StudentRepository } from '../../repositories/student.repository';

class ListStudentClassService {
  private studentRepository: StudentRepository;

  constructor() {
    this.studentRepository = new StudentRepository();
  }

  async execute(schoolId: number, name: string) {
    const student = await this.studentRepository.listStudentClass(schoolId, name);
    return student;
  }
}
export { ListStudentClassService };
