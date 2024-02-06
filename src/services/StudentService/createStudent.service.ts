/* eslint-disable prettier/prettier */
import { UnauthorizedError } from '../../helpers/api-erros';
import { StudentRepository } from '../../repositories/student.repository';

class CreateStudentService {
  private studentRepository: StudentRepository;

  constructor() {
    this.studentRepository = new StudentRepository();
  }

  async execute(registration: string, password: string, profileName: string, schoolId: number) {
    const studentExists = await this.studentRepository.findByName(registration,schoolId);
    if (studentExists) {
      throw new UnauthorizedError(`Este nome já está cadastrado.`);
    }
    const student = await this.studentRepository.saveStudent(registration, password, profileName, schoolId);
    return student;
  }
}

export { CreateStudentService };