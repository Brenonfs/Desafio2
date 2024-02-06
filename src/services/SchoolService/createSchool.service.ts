/* eslint-disable prettier/prettier */
import { UnauthorizedError } from '../../helpers/api-erros';
import { SchoolRepository } from '../../repositories/school.repository';
import cepPromise  from 'cep-promise';

class CreateSchoolService {
  private schoolRepository: SchoolRepository;

  constructor() {
    this.schoolRepository = new SchoolRepository();
  }

  async execute(schoolCode: string, password: string,cep: string, profileName: string) {
    const schoolExists = await this.schoolRepository.findByCep(cep);
    const cepResult = await cepPromise(cep);

    if (schoolExists) {
      throw new UnauthorizedError(`Este endereco ja está cadastrado.`);
    }

    const school = await this.schoolRepository.saveSchool(schoolCode, password, cepResult.city, cepResult.state, cepResult.street, cepResult.cep,cepResult.neighborhood, profileName);
    return {
      id: school.id,
      schoolCode: school.schoolCode,
      city: school.city,
      state: school.state,
      street: school.street,
      cep: school.cep,
      profileName:school.profileName,
    };
  }
}
export { CreateSchoolService };
