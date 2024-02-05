import { Request, Response } from 'express';
import { BadRequestError } from '../helpers/api-erros';
import { sessionCreateSchema } from '../schemas/session';
import { CreateSessionService } from '../services/SessionService/createSession.service';

export class SessionController {
  private createSessionService: CreateSessionService;

  constructor() {
    this.createSessionService = new CreateSessionService();
  }

  create = async (req: Request, res: Response) => {
    const validatedSessionSchema = sessionCreateSchema.safeParse(req.body);
    if (!validatedSessionSchema.success) {
      throw new BadRequestError(`Não foi possível fazer o login.`);
    }

    const result = await this.createSessionService.execute(
      validatedSessionSchema.data.name,
      validatedSessionSchema.data.password,
    );

    res.json({ result });
  };
}
