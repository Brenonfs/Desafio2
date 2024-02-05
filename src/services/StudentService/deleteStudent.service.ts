import { BadRequestError } from '../../helpers/api-erros';
import { StudentRepository } from '../../repositories/student.repository';

class DeleteStudentService {
  private studentRepository: StudentRepository;

  constructor() {
    this.studentRepository = new StudentRepository();
  }

  async execute(name: string, schoolId: number) {
    const deleteStudent = await this.studentRepository.deleteStudent(name, schoolId);

    if (!deleteStudent) {
      throw new BadRequestError(`Aluno(a) com o nome '${name}' não encontrada.`);
    }
    return {
      message: `Aluno(a) com o nome '${name}' foi deletada com sucesso.`,
    };
  }
}

export { DeleteStudentService };
