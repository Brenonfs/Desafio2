import { z } from 'zod';

export const studentCreateSchema = z.object({
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

  profileName: z
    .string({
      required_error: 'O  campo "profileName" está vazio',
      invalid_type_error: 'O  campo "profileName" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "profileName" está muito pequeno' }),
});

export const studentViewSchema = z.object({
  registration: z
    .string({
      required_error: 'O  campo "registration" está vazio',
      invalid_type_error: 'O  campo "registration" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "registration" está muito pequeno' }),
});
export const listclassStudentSchema = z.object({
  schoolClassCode: z
    .string({
      required_error: 'O  campo "schoolClassCode" está vazio',
      invalid_type_error: 'O  campo "schoolClassCode" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "schoolClassCode" está muito pequeno' }),
});
export const studentUpdateSchema = z.object({
  registration: z
    .string({
      required_error: 'O  campo "registration" está vazio',
      invalid_type_error: 'O  campo "registration" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "schoolClassCode Student" está muito pequeno' }),
  schoolClassCode: z
    .string({
      required_error: 'O  campo "schoolClassCode" está vazio',
      invalid_type_error: 'O  campo "schoolClassCode" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "schoolClassCode" está muito pequeno' }),
});
