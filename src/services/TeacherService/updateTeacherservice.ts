import { BadRequestError } from '../../helpers/api-erros';
import { SchoolClassRepository } from '../../repositories/schoolClass.repository';
import { TeacherRepository } from '../../repositories/teacher.repository';

class UpdateTeacherService {
  private schoolClassRepository: SchoolClassRepository;
  private teacherRepository: TeacherRepository;

  constructor() {
    this.schoolClassRepository = new SchoolClassRepository();
    this.teacherRepository = new TeacherRepository();
  }

  async execute(teacherCode: string, schoolClassCode: string, schoolId: number) {
    const teacherExists = await this.teacherRepository.findByTeacherCode(teacherCode, schoolId);
    if (!teacherExists) {
      throw new BadRequestError(`Professor(a) não foi encontrado.`);
    }

    const classExists = await this.schoolClassRepository.findBySchoolClassCode(schoolClassCode, schoolId);
    if (!classExists) {
      throw new BadRequestError(`Esta turma não foi encontrado.`);
    }

    const isTeacherInSchoolClass = teacherExists.schoolClass.some(
      (classItem) => classItem.schoolClassCode === schoolClassCode,
    );
    if (isTeacherInSchoolClass) {
      throw new BadRequestError(`Professor(a) já está cadastrado em uma turma com o código '${schoolClassCode}'.`);
    }

    const isSTeacherInOtherSchoolClass = teacherExists.schoolClass.some((teacherSchoolClass) => {
      return (
        teacherSchoolClass.dayOfWeek === classExists.dayOfWeek &&
        teacherSchoolClass.time === classExists.time &&
        teacherSchoolClass.schoolClassCode !== classExists.schoolClassCode
      );
    });

    if (isSTeacherInOtherSchoolClass) {
      throw new BadRequestError(`Este aluno já está cadastrado em outra turma no mesmo dia e horário.`);
    }

    const idSchoolClass = classExists.id;

    const updatedTeacher = await this.teacherRepository.updateTeacher(teacherCode, idSchoolClass, schoolId);
    const updatedSchoolClass = await this.schoolClassRepository.updateTeacher(
      teacherExists.id,
      schoolClassCode,
      schoolId,
    );

    return { updatedTeacher, updatedSchoolClass };
  }
}

export { UpdateTeacherService };
