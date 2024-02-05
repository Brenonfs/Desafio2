import { z } from 'zod';

export const studentCreateSchema = z.object({
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

  profileName: z
    .string({
      required_error: 'O  campo "profileName" está vazio',
      invalid_type_error: 'O  campo "profileName" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "profileName" está muito pequeno' }),
});
export const studentDeleteSchema = z.object({
  name: z
    .string({
      required_error: 'O  campo "name" está vazio',
      invalid_type_error: 'O  campo "name" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "password" está muito pequeno' }),
});
export const studentViewSchema = z.object({
  profileName: z
    .string({
      required_error: 'O  campo "profileName" está vazio',
      invalid_type_error: 'O  campo "profileName" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "profileName" está muito pequeno' }),
});
export const listclassStudentSchema = z.object({
  nameClass: z
    .string({
      required_error: 'O  campo "nameClass" está vazio',
      invalid_type_error: 'O  campo "nameClass" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "nameClass" está muito pequeno' }),
});
