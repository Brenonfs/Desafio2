import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import { jwtConfig } from '../../configs/auth';
import { UnauthorizedError } from '../../helpers/api-erros';
import { SessionRepository } from '../../repositories/session.repository';

export class SchoolSessionService {
  private sessionRepository: SessionRepository;

  constructor() {
    this.sessionRepository = new SessionRepository();
  }
  async execute(schoolCode: string, password: string) {
    const schoolExist = await this.sessionRepository.findBySchoolCode(schoolCode);

    if (!schoolExist) {
      throw new UnauthorizedError('Nome e/ou senha incorreta');
    }
    const passwordMatched = await compare(password, schoolExist.password);

    if (!passwordMatched) {
      throw new UnauthorizedError('Nome e/ou senha incorreta');
    }
    if (jwtConfig && jwtConfig.secret !== undefined) {
      const { secret, expiresIn } = jwtConfig;

      const token = sign({}, secret, {
        subject: String(schoolExist.id),
        expiresIn,
      });
      return {
        id: schoolExist.id,
        schoolCode: schoolExist.schoolCode,
        token,
      };
    }
  }
}
