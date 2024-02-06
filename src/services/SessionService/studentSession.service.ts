/* eslint-disable import/no-extraneous-dependencies */
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import { jwtConfig } from '../../configs/auth';
import { UnauthorizedError } from '../../helpers/api-erros';
import { SessionRepository } from '../../repositories/session.repository';

export class StudentSessionService {
  private sessionRepository: SessionRepository;

  constructor() {
    this.sessionRepository = new SessionRepository();
  }
  async execute(registration: string, password: string) {
    const studentExist = await this.sessionRepository.findByRegistration(registration);
    console.log('to aquire', studentExist);
    if (!studentExist) {
      throw new UnauthorizedError('Nome e/ou senha incorreta');
    }
    const passwordMatched = await compare(password, studentExist.password);

    if (!passwordMatched) {
      throw new UnauthorizedError('Nome e/ou senha incorreta');
    }
    if (jwtConfig && jwtConfig.secret !== undefined) {
      const { secret, expiresIn } = jwtConfig;

      console.log('schoolId:', studentExist.schoolId); // Adicione este log para verificar o valor de schoolId
      const token = sign(
        {
          sub: String(studentExist.id),
          schoolId: studentExist.schoolId, // Incluindo schoolId como chave separada no payload
        },
        secret,
        {
          expiresIn,
        },
      );

      console.log('Generated token:', token);

      return {
        id: studentExist.id,
        registration: studentExist.registration,
        schoolId: studentExist.schoolId,
        token,
      };
    }
  }
}
