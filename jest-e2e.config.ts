/* eslint-disable import/extensions */
import jestConfig from './jest.config';
export default {
  ...jestConfig,
  testEnvironment: './prisma/prisma-test-environment.ts',
  // testRegex: '.spec.ts',
};
