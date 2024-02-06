import { BadRequestError } from '../../helpers/api-erros';
import { StudentRepository } from '../../repositories/student.repository';

class DeleteStudentService {
  private studentRepository: StudentRepository;

  constructor() {
    this.studentRepository = new StudentRepository();
  }

  async execute(registration: string, schoolId: number) {
    const deleteStudent = await this.studentRepository.deleteStudent(registration, schoolId);

    if (!deleteStudent) {
      throw new BadRequestError(`Aluno(a) com o nome '${registration}' não encontrada.`);
    }
    return {
      message: `Aluno(a) com o nome '${registration}' foi deletada com sucesso.`,
    };
  }
}

export { DeleteStudentService };
