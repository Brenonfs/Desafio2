import { NotFoundError } from '../../helpers/api-erros';
import { StudentRepository } from '../../repositories/student.repository';

class ListStudentService {
  private studentRepository: StudentRepository;

  constructor() {
    this.studentRepository = new StudentRepository();
  }

  async execute(schoolId: number) {
    const studentExists = await this.studentRepository.listStudent(schoolId);
    if (!studentExists) {
      throw new NotFoundError(`Não há aluno para a escolas com o id '${schoolId}'.`);
    }
    return studentExists;
  }
}
export { ListStudentService };
