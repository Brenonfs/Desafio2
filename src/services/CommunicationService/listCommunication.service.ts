import { NotFoundError } from '../../helpers/api-erros';
import { CommunicationRepository } from '../../repositories/communication.repository';

class ListCommunicationService {
  private communicationRepository: CommunicationRepository;

  constructor() {
    this.communicationRepository = new CommunicationRepository();
  }

  async execute(schoolId: number) {
    const communication = await this.communicationRepository.findById(schoolId);
    if (!communication) {
      throw new NotFoundError(`Não foi possível criar escola com essas especificações.`);
    }
    return communication;
  }
}

export { ListCommunicationService };
