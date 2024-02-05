/* eslint-disable prettier/prettier */
import { UnauthorizedError } from '../../helpers/api-erros';
import { SchoolRepository } from '../../repositories/school.repository';

class CreateSchoolService {
  private schoolRepository: SchoolRepository;

  constructor() {
    this.schoolRepository = new SchoolRepository();
  }

  async execute(name: string, password: string , address: string, profileName: string) {
    const schoolExists = await this.schoolRepository.findByAddres(address);
    if (schoolExists) {
      throw new UnauthorizedError(`Este endereco ja está cadastrado.`);
    }

    const school = await this.schoolRepository.saveSchool(name, password, address, profileName);
    return {
      id: school.id,
      name: school.name,
      address: school.address,
      profileName:school.profileName,
    };
  }
}
export { CreateSchoolService };
