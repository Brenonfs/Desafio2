import { BadRequestError } from '../../helpers/api-erros';
import { StudentRepository } from '../../repositories/student.repository';

class ViewStudentByStudentSerivce {
  private studentRepository: StudentRepository;

  constructor() {
    this.studentRepository = new StudentRepository();
  }

  async execute(studentId: number) {
    const studentExists = await this.studentRepository.findById(studentId);
    if (!studentExists) {
      throw new BadRequestError(`Não há aluno(a) com o nome '${studentId}'.`);
    }
    return studentExists;
  }
}
export { ViewStudentByStudentSerivce };
