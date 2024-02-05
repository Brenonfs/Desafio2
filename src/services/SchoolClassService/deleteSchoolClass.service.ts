import { BadRequestError } from '../../helpers/api-erros';
import { SchoolClassRepository } from '../../repositories/schoolClass.repository';

class DeleteSchoolClassService {
  private classRepository: SchoolClassRepository;

  constructor() {
    this.classRepository = new SchoolClassRepository();
  }

  async execute(schoolClassCode: string, schoolId: number) {
    const deletedSchoolClass = await this.classRepository.deleteSchoolClass(schoolClassCode, schoolId);

    if (!deletedSchoolClass) {
      throw new BadRequestError(`Turma com o nome '${schoolClassCode}' não encontrada.`);
    }
    return {
      message: `Turma com o nome '${schoolClassCode}' foi deletada com sucesso.`,
    };
  }
}

export { DeleteSchoolClassService };
