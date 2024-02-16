import { BadRequestError, NotFoundError } from '../../helpers/api-erros';
import { SchoolClassRepository } from '../../repositories/schoolClass.repository';
import { StudentRepository } from '../../repositories/student.repository';

class UpdateStudentService {
  private schoolClassRepository: SchoolClassRepository;
  private studentRepository: StudentRepository;
  private maxStudentsPerClass: number = 40;

  constructor() {
    this.schoolClassRepository = new SchoolClassRepository();
    this.studentRepository = new StudentRepository();
  }

  async execute(registration: string, classId: number, schoolId: number) {
    const studentExists = await this.studentRepository.findByRegistration(registration, schoolId);
    if (!studentExists) {
      throw new BadRequestError(`Este aluno não foi encontrado.`);
    }
    const classExists = await this.schoolClassRepository.findByID(classId);
    if (!classExists || classExists.students.length >= this.maxStudentsPerClass) {
      throw new BadRequestError(`Esta turma não foi encontrada ou já está lotada.`);
    }
    const isStudentInSameSchoolClass = studentExists.schoolClass.some((classItem) => classItem.id === classId);
    if (isStudentInSameSchoolClass) {
      throw new BadRequestError(`Este aluno já está cadastrado nesta turma.`);
    }
    const isStudentInOtherSchoolClassSameTime = studentExists.schoolClass.some((studentSchoolClass) => {
      return (
        studentSchoolClass.dayOfWeek === classExists.dayOfWeek &&
        studentSchoolClass.time === classExists.time &&
        studentSchoolClass.id !== classExists.id
      );
    });
    if (isStudentInOtherSchoolClassSameTime) {
      throw new BadRequestError(`Este aluno já está cadastrado em outra turma no mesmo dia e horário.`);
    }
    const schoolClassId = classExists.id;
    const updatedStudent = await this.studentRepository.updateStudent(registration, schoolClassId, schoolId);
    if (!updatedStudent) {
      throw new NotFoundError(`Não foi possivel matricular o aluno.`);
    }
    return updatedStudent;
  }
}

export { UpdateStudentService };
