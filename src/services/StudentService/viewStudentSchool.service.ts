import { BadRequestError } from '../../helpers/api-erros';
import { StudentRepository } from '../../repositories/student.repository';

class ViewStudentSchoolService {
  private studentRepository: StudentRepository;

  constructor() {
    this.studentRepository = new StudentRepository();
  }

  async execute(registration: string, studentId: number | undefined, schoolId: number | undefined) {
    if (studentId !== undefined && schoolId === undefined) {
      // Caso apenas studentId seja fornecido
      const studentExists = await this.studentRepository.findById(studentId);
      return studentExists;
    } else if (schoolId !== undefined && studentId === undefined) {
      if (!registration) {
        throw new BadRequestError('É necessário fornecer um número de registro.');
      }

      const studentExists = await this.studentRepository.findByRegistration(registration, schoolId);

      return studentExists;
    } else {
      // Caso ambos ou nenhum dos parâmetros seja fornecido
      throw new BadRequestError('É necessário fornecer apenas um dos seguintes parâmetros: studentId ou schoolId.');
    }
  }
}

export { ViewStudentSchoolService };
