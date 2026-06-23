import {
  describe,
  it,
  expect,
  vi
} from 'vitest';

vi.mock(
  '../repositories/user.repository.js',
  () => ({
    findAll: vi.fn().mockResolvedValue([
  {
    id: 1,
    name: 'admin'
  },
  {
    id: 3,
    name: 'guest'
  }
])
  })
);

import {
  getPublicUsers
} from '../services/user.service.js';

describe(
  'user.service',
  () => {

    it(
      'should return formatted users',
      async () => {
        const users =
          await getPublicUsers();

        expect(users).toEqual([
  {
    id: 1,
    name: 'ADMIN',
    roleName: 'Super Admin'
  },
  {
    id: 3,
    name: 'GUEST',
    roleName: 'Unknown'
  }
]);
      }
    );

  }
);