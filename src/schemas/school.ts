import { z } from 'zod';

export const schoolCreateSchema = z.object({
  schoolCode: z
    .string({
      required_error: 'O  campo "schoolCode" está vazio',
      invalid_type_error: 'O  campo "schoolCode" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "schoolCode" está muito pequeno' }),

  password: z
    .string({
      required_error: 'O  campo "password" está vazio',
      invalid_type_error: 'O  campo "password" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "password" está muito pequeno' }),
  cep: z
    .string({
      required_error: 'O campo "cep" está vazio',
      invalid_type_error: 'O campo "cep" tem caracteres inválidos',
    })
    .length(8, { message: 'O campo "cep" deve ter exatamente 8 dígitos' }),

  profileName: z
    .string({
      required_error: 'O  campo "profileName" está vazio',
      invalid_type_error: 'O  campo "profileName" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "profileName" está muito pequeno' }),
});
export const schoolDeleteSchema = z.object({
  schoolCode: z
    .string({
      required_error: 'O  campo "schoolCode" está vazio',
      invalid_type_error: 'O  campo "schoolCode" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "schoolCode" está muito pequeno' }),
});
export const schoolViewSchema = z.object({
  profileName: z
    .string({
      required_error: 'O  campo "profileName" está vazio',
      invalid_type_error: 'O  campo "profileName" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "profileName" está muito pequeno' }),
});
