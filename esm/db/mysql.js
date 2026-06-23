import mysql from 'mysql2/promise';

let pool;

export const connectMySQL =
  async config => {
    pool = mysql.createPool({
      host: config.MYSQL_HOST,
      port: config.MYSQL_PORT,
      user: config.MYSQL_USER,
      password:
        config.MYSQL_PASSWORD,
      database:
        config.MYSQL_DATABASE
    });

    return pool;
  };

export const getPool = () =>
  pool;