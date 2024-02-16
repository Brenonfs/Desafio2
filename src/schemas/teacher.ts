import { z } from 'zod';

export const teacherCreateSchema = z.object({
  teacherCode: z
    .string({
      required_error: 'O  campo "teacherCode" está vazio',
      invalid_type_error: 'O  campo "teacherCode" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "teacherCode" está muito pequeno' }),

  password: z
    .string({
      required_error: 'O  campo "password" está vazio',
      invalid_type_error: 'O  campo "password" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "password" está muito pequeno' }),

  discipline: z
    .string({
      required_error: 'O  campo "discipline" está vazio',
      invalid_type_error: 'O  campo "discipline" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "discipline" está muito pequeno' }),

  profileName: z
    .string({
      required_error: 'O  campo "profileName" está vazio',
      invalid_type_error: 'O  campo "profileName" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "profileName" está muito pequeno' }),
});
export const teacherViewSchema = z.object({
  teacherCode: z
    .string({
      required_error: 'O  campo "teacherCode" está vazio',
      invalid_type_error: 'O  campo "teacherCode" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "teacherCode" está muito pequeno' }),
});
export const teacherUpdateSchema = z.object({
  teacherCode: z
    .string({
      required_error: 'O  campo "teacherCode" está vazio',
      invalid_type_error: 'O  campo "teacherCode" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "teacherCode" está muito pequeno' }),
});
