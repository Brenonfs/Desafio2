import { BadRequestError } from '../../helpers/api-erros';
import { SchoolClassRepository } from '../../repositories/schoolClass.repository';
import { StudentRepository } from '../../repositories/student.repository';

class UpdateStudentService {
  private schoolClassRepository: SchoolClassRepository;
  private studentRepository: StudentRepository;

  constructor() {
    this.schoolClassRepository = new SchoolClassRepository();
    this.studentRepository = new StudentRepository();
  }

  async execute(registration: string, classId: number, schoolId: number) {
    const studentExists = await this.studentRepository.findByRegistration(registration, schoolId);
    if (!studentExists) {
      throw new BadRequestError(`Este aluno não foi encontrado.`);
    }
    if (!classId) {
      throw new BadRequestError(`Este id não foi encontrado.`);
    }
    const classExists = await this.schoolClassRepository.findByID(classId);
    if (!classExists) {
      throw new BadRequestError(`Esta turma não foi encontrado.`);
    }
    const isStudentInSchoolClass = studentExists.schoolClass.some((classItem) => classItem.id === classId);
    if (isStudentInSchoolClass) {
      throw new BadRequestError(`Este aluno já está cadastrado nesta turma.`);
    }
    if (classExists.students.length >= 40) {
      throw new BadRequestError(`Esta turma já está lotada.`);
    }
    const isStudentInOtherSchoolClass = studentExists.schoolClass.some((studentSchoolClass) => {
      return (
        studentSchoolClass.dayOfWeek === classExists.dayOfWeek &&
        studentSchoolClass.time === classExists.time &&
        studentSchoolClass.id !== classExists.id
      );
    });
    if (isStudentInOtherSchoolClass) {
      throw new BadRequestError(`Este aluno já está cadastrado em outra turma no mesmo dia e horário.`);
    }
    const idSchoolClass = classExists.id;
    const updatedStudent = await this.studentRepository.updateStudante(registration, idSchoolClass, schoolId);
    return updatedStudent;
  }
}

export { UpdateStudentService };
