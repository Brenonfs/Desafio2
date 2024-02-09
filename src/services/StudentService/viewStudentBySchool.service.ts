import { BadRequestError } from '../../helpers/api-erros';
import { StudentRepository } from '../../repositories/student.repository';

class ViewStudentBySchoolService {
  private studentRepository: StudentRepository;

  constructor() {
    this.studentRepository = new StudentRepository();
  }

  async execute(schoolId: number, registration: string) {
    const studentExists = await this.studentRepository.findByRegistration(registration, schoolId);
    if (!studentExists) {
      throw new BadRequestError(`Não há aluno(a) com esta matricula'${registration}'.`);
    }
    return studentExists;
  }
}
export { ViewStudentBySchoolService };
