import "reflect-metadata";
import dotenv from 'dotenv';
import { singleton } from 'tsyringe';

dotenv.config({ path: '.env' });

@singleton()
export default class DBConfig {
  // admin account
  admin_initial_username = String(process.env.ADMIN_INITIAL_USERNAME);
  admin_initial_password = String(process.env.ADMIN_INITIAL_PASSWORD);

  // db
  db_host = String(process.env.DB_HOST);
  db_port = Number(process.env.DB_PORT);
  db_name = String(process.env.DB_NAME);
  db_user = String(process.env.DB_USER);
  db_password = String(process.env.DB_PASSWORD);

  // redis
  redis_host = String(process.env.REDIS_HOST);
  redis_port = String(process.env.REDIS_PORT);
  redis_password = String(process.env.REDIS_PASSWORD);
}