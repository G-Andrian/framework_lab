import {
  describe,
  it,
  expect
} from 'vitest';

import {
  increment,
  getStats
} from '../state/request-counter.js';

describe(
  'request-counter',
  () => {

    it(
      'should increment counter',
      () => {
        const before =
          getStats().totalRequests;

        increment();

        const after =
          getStats().totalRequests;

        expect(after)
          .toBe(before + 1);
      }
    );

  }
);