import { z } from 'zod';

export const communcationCreateSchema = z.object({
  messageType: z
    .string({
      required_error: 'O  campo "messageType" está vazio',
      invalid_type_error: 'O  campo "messageType" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "messageType" está muito pequeno' }),

  message: z
    .string({
      required_error: 'O  campo "message" está vazio',
      invalid_type_error: 'O  campo "message" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "password" está muito pequeno' }),
});
