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
    if (!studentExist) {
      throw new UnauthorizedError('Nome e/ou senha incorreta');
    }
    const passwordMatched = await compare(password, studentExist.password);

    if (!passwordMatched) {
      throw new UnauthorizedError('Nome e/ou senha incorreta');
    }
    if (jwtConfig && jwtConfig.secret !== undefined) {
      const { secret, expiresIn } = jwtConfig;
      const token = sign({}, secret, {
        subject: String(studentExist.id),
        expiresIn,
      });

      return {
        id: studentExist.id,
        registration: studentExist.registration,
        schoolId: studentExist.schoolId,
        token,
      };
    }
  }
}
