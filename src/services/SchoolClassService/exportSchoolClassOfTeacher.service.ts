import { BadRequestError } from '../../helpers/api-erros';
import { TeacherRepository } from '../../repositories/teacher.repository';
import ExcelJS from 'exceljs';
import S3Storage from '../../utils/S3Storage';

class ExportSchoolClassOfTeacherService {
  private teacherRepository: TeacherRepository;

  constructor() {
    this.teacherRepository = new TeacherRepository();
  }

  async execute(teacherId: number) {
    const teacherExists = await this.teacherRepository.findById(teacherId);
    if (!teacherExists) {
      throw new BadRequestError('Não foi encontrado o Professor.');
    }
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Turmas');

    worksheet.addRow(['Horários', ...['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']]);
    const diasDaSemanaValidos = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

    const horariosValidos = [
      '7:00 - 7:55',
      '7:55 - 8:50',
      '8:50 - 9:45',
      '9:45 - 10:40',
      '10:40 - 11:35',
      '11:35 - 12:30',
    ];
    horariosValidos.forEach((horario) => {
      const row = [horario];
      teacherExists.schoolClass.forEach((schoolClass) => {
        if (horario === schoolClass.time && diasDaSemanaValidos.includes(schoolClass.dayOfWeek)) {
          const columnIndex = diasDaSemanaValidos.indexOf(schoolClass.dayOfWeek) + 1;
          row[columnIndex] = schoolClass.discipline;
        }
      });
      worksheet.addRow(row);
    });

    if (teacherExists.schoolClass.length === 0) {
      horariosValidos.forEach((horario) => {
        const row = [horario];
        diasDaSemanaValidos.forEach(() => {
          row.push('');
        });
        worksheet.addRow(row);
      });
    }

    const excelBuffer = Buffer.from(await workbook.xlsx.writeBuffer());
    try {
      const s3Storage = new S3Storage();
      const key = `turmas/${teacherExists.schoolId}/${teacherExists.id}.xlsx`;
      await s3Storage.saveFileBuffer(excelBuffer, key);
      return key;
    } catch (error) {
      console.error('Erro ao exportar arquivo para o S3:', error);
      throw new BadRequestError('Erro ao exportar arquivo para o S3');
    }
  }
}

export { ExportSchoolClassOfTeacherService };
