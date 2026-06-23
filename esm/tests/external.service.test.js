import {
  describe,
  it,
  expect,
  vi
} from 'vitest';

import {
  fetchWithTimeout,
  fetchWithRetry
} from '../services/external.service.js';

describe(
  'external.service',
  () => {

    it(
      'should return response',
      async () => {
        global.fetch = vi.fn()
          .mockResolvedValue({
            ok: true,
            status: 200
          });

        const response =
          await fetchWithTimeout(
            'http://test.com'
          );

        expect(
          response.ok
        ).toBe(true);
      }
    );

    it(
      'should retry and succeed',
      async () => {
        global.fetch = vi.fn()
          .mockRejectedValueOnce(
            new Error('Network')
          )
          .mockResolvedValue({
            ok: true,
            status: 200
          });

        const response =
          await fetchWithRetry(
            'http://test.com',
            2
          );

        expect(
          response.ok
        ).toBe(true);
      }
    );

    it(
      'should fail after retries',
      async () => {
        global.fetch = vi.fn()
          .mockRejectedValue(
            new Error('Network')
          );

        await expect(
          fetchWithRetry(
            'http://test.com',
            2
          )
        ).rejects.toThrow();
      }
    );

  }
);