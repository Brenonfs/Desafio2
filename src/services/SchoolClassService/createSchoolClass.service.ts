import { NotFoundError } from '../../helpers/api-erros';
import { SchoolClassRepository } from '../../repositories/schoolClass.repository';

class CreateSchoolClassService {
  private schoolClassRepository: SchoolClassRepository;

  constructor() {
    this.schoolClassRepository = new SchoolClassRepository();
  }

  async execute(
    discipline: string,
    year: number,
    numberClass: number,
    dayOfWeek: string,
    time: string,
    schoolId: number,
    teacherId: number | null,
  ) {
    const createdClass = await this.schoolClassRepository.saveSchoolClass(
      discipline,
      year,
      numberClass,
      dayOfWeek,
      time,
      schoolId,
      teacherId,
    );
    if (!createdClass) {
      throw new NotFoundError(`Não foi possível criar turma com essas especificações.`);
    }
    return createdClass;
  }
}

export { CreateSchoolClassService };
