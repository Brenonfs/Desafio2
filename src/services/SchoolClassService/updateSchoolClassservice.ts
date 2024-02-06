import { BadRequestError } from '../../helpers/api-erros';
import { SchoolClassRepository } from '../../repositories/schoolClass.repository';
import { StudentRepository } from '../../repositories/student.repository';

class UpdateSchoolClassService {
  private schoolClassRepository: SchoolClassRepository;
  private studentRepository: StudentRepository;

  constructor() {
    this.schoolClassRepository = new SchoolClassRepository();
    this.studentRepository = new StudentRepository();
  }

  async execute(registration: string, schoolClassCode: string, schoolId: number) {
    const studentExists = await this.studentRepository.findByName(registration, schoolId);
    if (!studentExists) {
      throw new BadRequestError(`Este aluno não foi encontrado.`);
    }

    const classExists = await this.schoolClassRepository.findByName(schoolClassCode, schoolId);
    if (!classExists) {
      throw new BadRequestError(`Esta turma não foi encontrado.`);
    }

    const isStudentInSchoolClass = classExists.students.some((student) => student.registration === registration);
    if (isStudentInSchoolClass) {
      throw new BadRequestError(`Este aluno já está cadastrado nessa turma.`);
    }

    const isStudentInOtherSchoolClass = studentExists.schoolClass.some((studentSchoolClass) => {
      return (
        studentSchoolClass.dayOfWeek === classExists.dayOfWeek &&
        studentSchoolClass.time === classExists.time &&
        studentSchoolClass.schoolClassCode !== classExists.schoolClassCode
      );
    });

    if (isStudentInOtherSchoolClass) {
      throw new BadRequestError(`Este aluno já está cadastrado em outra turma no mesmo dia e horário.`);
    }

    const idStudent = studentExists.id;

    const updatedSchoolClass = await this.schoolClassRepository.updateSchoolClass(idStudent, schoolClassCode, schoolId);

    return updatedSchoolClass;
  }
}

export { UpdateSchoolClassService };
