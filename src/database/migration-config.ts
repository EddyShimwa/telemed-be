import 'dotenv/config';
import { join } from 'path';
import { cwd } from 'process';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

export const typeOrmMigrationsConfig: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [join(cwd(), 'dist/**/*.entity.js')],
  migrations: [join(cwd(), 'dist/migrations/*.js')],
  seeds: [join(cwd(), 'dist/seeds/**/*.js')],
};

const dataSource = new DataSource(typeOrmMigrationsConfig);

export default dataSource;
