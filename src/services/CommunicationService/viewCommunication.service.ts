import { NotFoundError } from '../../helpers/api-erros';
import { CommunicationRepository } from '../../repositories/communication.repository';

class ViewCommunicationService {
  private communicationRepository: CommunicationRepository;

  constructor() {
    this.communicationRepository = new CommunicationRepository();
  }

  async execute(communicationId: number, schoolId: number) {
    const communication = await this.communicationRepository.findByIdAndCommunicationId(communicationId, schoolId);
    if (!communication) {
      throw new NotFoundError(`Não foi possível criar escola com essas especificações.`);
    }
    return communication;
  }
}

export { ViewCommunicationService };
