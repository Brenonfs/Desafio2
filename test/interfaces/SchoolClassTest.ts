/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ISchoolClassTest {
  id: number | null;
  discipline: string;
  year: number;
  numberClass: number;
  dayOfWeek: string;
  time: string;
  schoolId: string | null;
  teacherId: string | null;
  response: any | null;
}
