import { BadRequestError } from '../../helpers/api-erros';
import { SchoolRepository } from '../../repositories/school.repository';

class DeleteSchoolService {
  private schoolRepository: SchoolRepository;

  constructor() {
    this.schoolRepository = new SchoolRepository();
  }

  async execute(name: string) {
    const deletedSchool = await this.schoolRepository.deleteSchool(name);

    if (!deletedSchool) {
      throw new BadRequestError(`Escola com o nome '${name}' não encontrada.`);
    }
    return {
      message: `A escola com o nome '${name}' foi deletada com sucesso.`,
    };
  }
}

export { DeleteSchoolService };
