import { z } from 'zod';
const diasDaSemanaValidos = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const horariosvalidos = ['7:00 - 7:55', '7:55 - 8:50', '8:50 - 9:45', '9:45 - 10:40', '10:40 - 11:35', '11:35 - 12:30'];

export const schoolClassCreateSchema = z.object({
  discipline: z
    .string({
      required_error: 'O  campo "discipline" está vazio',
      invalid_type_error: 'O  campo "discipline" tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "address" está muito pequeno' }),

  year: z
    .number({
      required_error: 'O  campo "year" está vazio',
      invalid_type_error: 'O  campo "year" tem caracteres inválidos',
    })
    .min(4, { message: 'O campo "year" está muito pequeno' }),

  numberClass: z.number({
    required_error: 'O  campo "numberClass" está vazio',
    invalid_type_error: 'O  campo "numberClass" tem caracteres inválidos',
  }),

  dayOfWeek: z
    .string({
      required_error: 'O campo "dayOfWeek" está vazio',
      invalid_type_error: 'O campo "dayOfWeek" tem caracteres inválidos',
    })
    .refine((value) => diasDaSemanaValidos.includes(value.toLowerCase()), {
      message:
        'O campo "dayOfWeek" deve ser um dia válido da semana, como por exemplo: domingo, segunda, terça, quarta, quinta, sexta, sábado',
    }),

  time: z
    .string({
      required_error: 'O campo "time" está vazio',
      invalid_type_error: 'O campo "time" tem caracteres inválidos',
    })
    .refine((value) => horariosvalidos.includes(value.toLowerCase()), {
      message:
        'O campo "time" deve ser um horário válido, como por exemplo: 7:00 - 7:55, 7:55 - 8:50, 8:50 - 9:45, 9:45 - 10:40, 10:40 - 11:35, 11:35 - 12:30',
    }),

  teacherId: z
    .number({
      invalid_type_error: 'O campo "teacherId" tem caracteres inválidos',
    })
    .nullable(),
});

export const schoolClassViewSchema = z.object({
  discipline: z
    .string({
      required_error: 'O  campo "discipline " está vazio',
      invalid_type_error: 'O  campo "discipline " tem caracteres inválidos',
    })
    .min(3, { message: 'O campo "discipline " está muito pequeno' }),
  year: z
    .number({
      required_error: 'O  campo "year " está vazio',
      invalid_type_error: 'O  campo "year " tem caracteres inválidos',
    })
    .min(4, { message: 'O campo "year " está muito pequeno' }),
});
export const schoolClassViewIDSchema = z.object({
  id: z.number({
    required_error: 'O  campo "id " está vazio',
    invalid_type_error: 'O  campo "id " tem caracteres inválidos',
  }),
});

export const schoolClassUpdateSchema = z.object({
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
