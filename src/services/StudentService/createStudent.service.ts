import { NotFoundError, UnauthorizedError } from '../../helpers/api-erros';
import { StudentRepository } from '../../repositories/student.repository';

class CreateStudentService {
  private studentRepository: StudentRepository;

  constructor() {
    this.studentRepository = new StudentRepository();
  }

  async execute(registration: string, password: string, profileName: string, schoolId: number) {
    const studentExists = await this.studentRepository.findByRegistration(registration, schoolId);
    if (studentExists) {
      throw new UnauthorizedError(`Este nome já está cadastrado.`);
    }
    const createStudent = await this.studentRepository.saveStudent(registration, password, profileName, schoolId);
    if (!createStudent) {
      throw new NotFoundError(`Não foi possível criar aluno com essas especificações.`);
    }
    return createStudent;
  }
}

export { CreateStudentService };
