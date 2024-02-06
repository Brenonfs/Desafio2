import { BadRequestError } from '../../helpers/api-erros';
import { SchoolRepository } from '../../repositories/school.repository';

class DeleteSchoolService {
  private schoolRepository: SchoolRepository;

  constructor() {
    this.schoolRepository = new SchoolRepository();
  }

  async execute(schoolCode: string) {
    const deletedSchool = await this.schoolRepository.deleteSchool(schoolCode);

    if (!deletedSchool) {
      throw new BadRequestError(`Escola com o nome '${schoolCode}' não encontrada.`);
    }
    return {
      message: `A escola com o nome '${schoolCode}' foi deletada com sucesso.`,
    };
  }
}

export { DeleteSchoolService };
