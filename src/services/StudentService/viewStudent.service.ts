import { BadRequestError } from '../../helpers/api-erros';
import { StudentRepository } from '../../repositories/student.repository';

class ViewStudentService {
  private studentRepository: StudentRepository;

  constructor() {
    this.studentRepository = new StudentRepository();
  }

  async execute(profileName: string, schoolId: number) {
    const studentExists = await this.studentRepository.findByProfileName(profileName, schoolId);
    if (!studentExists) {
      throw new BadRequestError(`Não há aluno(a) com o nome '${profileName}'.`);
    }
    return studentExists;
  }
}
export { ViewStudentService };
