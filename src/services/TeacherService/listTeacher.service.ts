import { TeacherRepository } from '../../repositories/teacher.repository';

class ListTeacherService {
  private teacherRepository: TeacherRepository;

  constructor() {
    this.teacherRepository = new TeacherRepository();
  }

  async execute(schoolId: number) {
    const teacher = await this.teacherRepository.listTeacher(schoolId);
    return teacher;
  }
}
export { ListTeacherService };
