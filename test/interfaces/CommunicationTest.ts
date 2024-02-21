/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ICommunicationTest {
  id: number | null;
  messageType: string;
  message: string;
  timestamp: Date | null;
  schoolId: string | null;
  response: any | null;
}
