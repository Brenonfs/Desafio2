import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import { jwtConfig } from '../../configs/auth';
import { UnauthorizedError } from '../../helpers/api-erros';
import { SessionRepository } from '../../repositories/session.repository';

export class TeacherSessionService {
  private sessionRepository: SessionRepository;

  constructor() {
    this.sessionRepository = new SessionRepository();
  }
  async execute(teacherCode: string, password: string) {
    const teacherExist = await this.sessionRepository.findByTeacherCode(teacherCode);
    if (!teacherExist) {
      throw new UnauthorizedError('Nome e/ou senha incorreta');
    }
    const passwordMatched = await compare(password, teacherExist.password);

    if (!passwordMatched) {
      throw new UnauthorizedError('Nome e/ou senha incorreta');
    }
    if (jwtConfig && jwtConfig.secret !== undefined) {
      const { secret, expiresIn } = jwtConfig;
      const token = sign({}, secret, {
        subject: String(teacherExist.id),
        expiresIn,
      });

      return {
        id: teacherExist.id,
        teacherCode: teacherExist.teacherCode,
        schoolId: teacherExist.schoolId,
        token,
      };
    }
  }
}
