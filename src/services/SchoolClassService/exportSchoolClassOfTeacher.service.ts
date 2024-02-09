import { BadRequestError, NotFoundError } from '../../helpers/api-erros';
import { TeacherRepository } from '../../repositories/teacher.repository';
import ExcelJS from 'exceljs';
import S3Storage from '../../utils/S3Storage';

class ExportSchoolClassOfTeacherService {
  private teacherRepository: TeacherRepository;

  constructor() {
    this.teacherRepository = new TeacherRepository();
  }

  async execute(teacherId: number) {
    if (teacherId !== undefined) {
      const teacherExists = await this.teacherRepository.findById(teacherId);
      if (teacherExists && teacherExists.schoolClass.length > 0) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Turmas');

        // Adiciona a linha com os dias da semana válidos
        worksheet.addRow(['Horários', ...['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']]);
        const diasDaSemanaValidos = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
        // Adiciona as colunas com os horários válidos
        const horariosvalidos = [
          '7:00 - 7:55',
          '7:55 - 8:50',
          '8:50 - 9:45',
          '9:45 - 10:40',
          '10:40 - 11:35',
          '11:35 - 12:30',
        ];
        horariosvalidos.forEach((horario) => {
          const row = [horario];
          // Aloca a turma com base no dia da semana e horário
          teacherExists.schoolClass.forEach((schoolClass) => {
            if (horario === schoolClass.time && diasDaSemanaValidos.includes(schoolClass.dayOfWeek)) {
              const columnIndex = diasDaSemanaValidos.indexOf(schoolClass.dayOfWeek) + 1; // +1 para compensar o cabeçalho
              row[columnIndex] = schoolClass.discipline;
            }
          });
          worksheet.addRow(row);
        });

        const excelBuffer = Buffer.from(await workbook.xlsx.writeBuffer());
        try {
          const s3Storage = new S3Storage();
          const key = `turmas/${teacherExists.schoolId}/${teacherExists.id}.xlsx`;
          await s3Storage.saveFileBuffer(excelBuffer, key);
          return key;
        } catch (error) {
          console.error('Erro ao exportar arquivo para o S3:', error);
        }
      } else {
        throw new NotFoundError('Não foram encontradas turmas para o aluno.');
      }
    } else {
      // Caso ambos ou nenhum dos parâmetros seja fornecido
      throw new BadRequestError('É necessário fornecer apenas um dos seguintes parâmetros: teacherId ou schoolId.');
    }
  }
}

export { ExportSchoolClassOfTeacherService };
