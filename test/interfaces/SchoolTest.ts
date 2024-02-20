/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ISchoolTest {
  schoolCode: string;
  street: string | null;
  city: string | null;
  state: string | null;
  cep: string;
  neighborhood: string | null;
  password: string;
  profileName: string;
  token: string | null;
  status: number | null;
  response: any | null;
}
