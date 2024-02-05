/* eslint-disable prettier/prettier */
import { UnauthorizedError } from '../../helpers/api-erros';
import { SchoolClassRepository } from '../../repositories/schoolClass.repository';

class CreateSchoolClassService {
  private schoolclassRepository: SchoolClassRepository;

  constructor() {
    this.schoolclassRepository = new SchoolClassRepository();
  }

  async execute(discipline: string, year: number, numberClass:number, dayOfWeek: string, Time:string , schoolId: number , teacherId: number | null) {
    const schoolClassCode  = discipline+year+numberClass
    const classesExists = await this.schoolclassRepository.findByName(schoolClassCode ,schoolId);
    if (classesExists) {
      throw new UnauthorizedError(`Esta turma já está cadastrado.`);
    }
    const classes = await this.schoolclassRepository.saveSchoolClass(schoolClassCode , discipline, year, numberClass, dayOfWeek,Time, schoolId, teacherId);
    return {
      id: classes.id,
      schoolClassCode : classes.schoolClassCode ,
      discipline: classes.discipline,
      year: classes.year,
      dayOfWeek: classes.dayOfWeek,
      time: classes.time,
      schoolId: classes.schoolId,
      teacherId: classes.teacherId
    };
  }
}

export { CreateSchoolClassService };
