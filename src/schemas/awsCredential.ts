import { z } from 'zod';

export const AwsCredentialsSchema = z.object({
  ACCESSKEYID: z.string(),
  SECRETACCESSKEY: z.string(),
  REGION: z.string(),
});
