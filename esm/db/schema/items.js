import {
  mysqlTable,
  int,
  varchar
} from 'drizzle-orm/mysql-core';

export const items = mysqlTable('items', {
  id: int('id')
    .primaryKey()
    .autoincrement(),

  name: varchar('name', {
    length: 255
  }),

  role: varchar('role', {
    length: 255
  }),

  category: varchar('category', {
    length: 255
  }),

  image: varchar('image', {
    length: 255
  })
});

export const users = mysqlTable(
  'users',
  {
    id: int('id')
      .primaryKey()
      .autoincrement(),

    email: varchar('email', {
      length: 255
    })
      .notNull()
      .unique(),

    password: varchar(
      'password',
      {
        length: 255
      }
    ).notNull()
  }
);