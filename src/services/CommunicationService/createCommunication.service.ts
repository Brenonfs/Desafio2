import { NotFoundError } from '../../helpers/api-erros';
import { CommunicationRepository } from '../../repositories/communication.repository';

class CreateCommunicationService {
  private communicationRepository: CommunicationRepository;

  constructor() {
    this.communicationRepository = new CommunicationRepository();
  }

  async execute(messageType: string, message: string, schoolId: number) {
    const timestamp = new Date();
    const createCommunication = await this.communicationRepository.saveCommunication(
      messageType,
      message,
      timestamp,
      schoolId,
    );
    if (!createCommunication) {
      throw new NotFoundError(`Não foi possível criar escola com essas especificações.`);
    }
    return createCommunication;
  }
}

export { CreateCommunicationService };
