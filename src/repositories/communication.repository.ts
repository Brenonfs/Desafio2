import { prisma } from '../database';

export class CommunicationRepository {
  async saveCommunication(messageType: string, message: string, timestamp: Date, schoolId: number) {
    const communication = await prisma.communication.create({
      data: { messageType, message, timestamp, schoolId },
    });
    return communication;
  }
  async findById(schoolId: number) {
    const communication = await prisma.communication.findMany({
      where: { schoolId },
    });
    return communication;
  }
  async findByIdAndCommunicationId(communicationId: number, schoolId: number) {
    const communication = await prisma.communication.findUnique({
      where: { id: communicationId, schoolId },
    });
    return communication;
  }
}
