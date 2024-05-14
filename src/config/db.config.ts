import dotenv from 'dotenv';
import { singleton } from 'tsyringe';

@singleton()
export default class DBConfig {
  constructor() {
    dotenv.config({ path: '.env' });
  }

  // db
  db_host = String(process.env.DB_HOST);
  db_port = Number(process.env.DB_PORT);
  db_name = String(process.env.DB_NAME);
  db_user = String(process.env.DB_USER);
  db_password = String(process.env.DB_PASSWORD);

  // redis
  redis_host = String(process.env.REDIS_HOST);
  redis_port = String(process.env.REDIS_PORT);
  redis_username = String(process.env.REDIS_USERNAME);
  redis_password = String(process.env.REDIS_PASSWORD);
}