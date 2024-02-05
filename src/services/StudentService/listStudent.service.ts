import { StudentRepository } from '../../repositories/student.repository';

class ListStudentService {
  private studentRepository: StudentRepository;

  constructor() {
    this.studentRepository = new StudentRepository();
  }

  async execute(schoolId: number) {
    const student = await this.studentRepository.listStudent(schoolId);
    return student;
  }
}
export { ListStudentService };
