import {
  describe,
  it,
  expect
} from 'vitest';

import {
  hashPassword,
  verifyPassword
} from '../services/auth.service.js';

describe(
  'auth.service',
  () => {

    it(
      'should hash password',
      async () => {
        const hash =
          await hashPassword(
            '123456'
          );

        expect(hash)
          .not
          .toBe('123456');
      }
    );

    it(
      'should verify valid password',
      async () => {
        const hash =
          await hashPassword(
            '123456'
          );

        const result =
          await verifyPassword(
            '123456',
            hash
          );

        expect(result)
          .toBe(true);
      }
    );

    it(
      'should reject invalid password',
      async () => {
        const hash =
          await hashPassword(
            '123456'
          );

        const result =
          await verifyPassword(
            'wrong',
            hash
          );

        expect(result)
          .toBe(false);
      }
    );
  }
);