import { BadRequestError, NotFoundError } from '../../helpers/api-erros';
import { SchoolClassRepository } from '../../repositories/schoolClass.repository';
import { TeacherRepository } from '../../repositories/teacher.repository';

class UpdateTeacherService {
  private schoolClassRepository: SchoolClassRepository;
  private teacherRepository: TeacherRepository;

  constructor() {
    this.schoolClassRepository = new SchoolClassRepository();
    this.teacherRepository = new TeacherRepository();
  }

  async execute(teacherCode: string, classId: number, schoolId: number) {
    const teacherExists = await this.teacherRepository.findByTeacherCode(teacherCode, schoolId);
    if (!teacherExists) {
      throw new BadRequestError(`Professor(a) não foi encontrado.`);
    }

    const classExists = await this.schoolClassRepository.findByID(classId);
    if (!classExists) {
      throw new BadRequestError(`Esta turma não foi encontrado.`);
    }
    const isTeacherInSameSchoolClass = teacherExists.schoolClass.some((classItem) => classItem.id === classId);
    if (isTeacherInSameSchoolClass) {
      throw new BadRequestError(`Professor(a) já está cadastrado nesta turma.`);
    }
    const isSTeacherInOtherSchoolClassSameTime = teacherExists.schoolClass.some((teacherSchoolClass) => {
      return (
        teacherSchoolClass.dayOfWeek === classExists.dayOfWeek &&
        teacherSchoolClass.time === classExists.time &&
        teacherSchoolClass.id !== classExists.id
      );
    });
    if (isSTeacherInOtherSchoolClassSameTime) {
      throw new BadRequestError(`Este professor já está cadastrado em outra turma no mesmo dia e horário.`);
    }
    const idSchoolClass = classExists.id;
    const updatedTeacher = await this.teacherRepository.updateTeacher(teacherCode, idSchoolClass, schoolId);
    if (!updatedTeacher) {
      throw new NotFoundError(`Não foi possivel atualizar o professor.`);
    }
    return updatedTeacher;
  }
}

export { UpdateTeacherService };
