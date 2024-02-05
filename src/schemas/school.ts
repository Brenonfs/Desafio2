import { z } from 'zod';

export const schoolCreateSchema = z.object({
  name: z
    .string({
      required_error: 'O  campo "name" está vazio',
      invalid_type_error: 'O  campo "name" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "password" está muito pequeno' }),

  password: z
    .string({
      required_error: 'O  campo "password" está vazio',
      invalid_type_error: 'O  campo "password" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "password" está muito pequeno' }),

  address: z
    .string({
      required_error: 'O  campo "address" está vazio',
      invalid_type_error: 'O  campo "address" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "address" está muito pequeno' }),

  profileName: z
    .string({
      required_error: 'O  campo "profileName" está vazio',
      invalid_type_error: 'O  campo "profileName" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "profileName" está muito pequeno' }),
});
export const schoolDeleteSchema = z.object({
  name: z
    .string({
      required_error: 'O  campo "name" está vazio',
      invalid_type_error: 'O  campo "name" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "password" está muito pequeno' }),
});
export const schoolViewSchema = z.object({
  profileName: z
    .string({
      required_error: 'O  campo "profileName" está vazio',
      invalid_type_error: 'O  campo "profileName" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "profileName" está muito pequeno' }),
});
