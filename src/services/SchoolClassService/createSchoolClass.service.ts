/* eslint-disable prettier/prettier */
import { SchoolClassRepository } from '../../repositories/schoolClass.repository';

class CreateSchoolClassService {
  private schoolclassRepository: SchoolClassRepository;

  constructor() {
    this.schoolclassRepository = new SchoolClassRepository();
  }

  async execute(discipline: string, year: number, numberClass:number, dayOfWeek: string, Time:string , schoolId: number , teacherId: number | null) {


    const classes = await this.schoolclassRepository.saveSchoolClass( discipline, year, numberClass, dayOfWeek,Time, schoolId, teacherId);
    return {
      id: classes.id,
      discipline: classes.discipline,
      numberClass: classes.numberClass,
      year: classes.year,
      dayOfWeek: classes.dayOfWeek,
      time: classes.time,
      schoolId: classes.schoolId,
      teacherId: classes.teacherId
    };
  }
}

export { CreateSchoolClassService };
