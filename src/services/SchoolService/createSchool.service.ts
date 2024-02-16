import { NotFoundError, UnauthorizedError } from '../../helpers/api-erros';
import { SchoolRepository } from '../../repositories/school.repository';
import cepPromise from 'cep-promise';

class CreateSchoolService {
  private schoolRepository: SchoolRepository;

  constructor() {
    this.schoolRepository = new SchoolRepository();
  }

  async execute(schoolCode: string, password: string, cep: string, profileName: string) {
    const schoolExistsSchoolCode = await this.schoolRepository.findBySchoolCode(schoolCode);
    if (schoolExistsSchoolCode) {
      throw new UnauthorizedError(`Este schoolCode já está cadastrado.`);
    }
    const schoolExists = await this.schoolRepository.findByCep(cep);
    let cepResult;
    try {
      cepResult = await cepPromise(cep);
    } catch (cepError) {
      console.log('Erro ao obter o CEP:');
      throw new Error('Ocorreu um erro ao obter o CEP.');
    }
    if (schoolExists) {
      console.log('Já tem o cep');
      throw new UnauthorizedError(`Este endereco já está cadastrado.`);
    }
    console.log('não tem o cep');

    const createSchool = await this.schoolRepository.saveSchool(
      schoolCode,
      password,
      cepResult.city,
      cepResult.state,
      cepResult.street,
      cep,
      cepResult.neighborhood,
      profileName,
    );
    if (!createSchool) {
      throw new NotFoundError(`Não foi possível criar escola com essas especificações.`);
    }
    return createSchool;
  }
}

export { CreateSchoolService };
