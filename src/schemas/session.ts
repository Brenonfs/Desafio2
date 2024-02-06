import { z } from 'zod';

export const sessionSchoolSchema = z.object({
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
});
export const sessionTeacherSchema = z.object({
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
});
export const sessionStudentSchema = z.object({
  registration: z
    .string({
      required_error: 'O  campo "registration" está vazio',
      invalid_type_error: 'O  campo "registration" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "registration" está muito pequeno' }),
  password: z
    .string({
      required_error: 'O  campo "password" está vazio',
      invalid_type_error: 'O  campo "password" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "password" está muito pequeno' }),
});
