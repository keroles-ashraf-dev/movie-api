import dotenv from 'dotenv';
import { singleton } from 'tsyringe';

@singleton()
export default class AppConfig {
  constructor() {
    dotenv.config({ path: '.env' });
  }

  // server
  env = process.env.ENV;
  port = Number(process.env.API_PORT);
  
  // request
  client_origin_url = process.env.CLIENT_ORIGIN_URL;
  request_body_size = Number(process.env.REQUEST_BODY_SIZE_IN_KB);
  file_upload_timeout = Number(process.env.FILE_UPLOAD_TIMEOUT);
  file_upload_size_limit = Number(process.env.FILE_UPLOAD_SIZE_LIMIT);

  // jwt
  jwt_secret_key = process.env.JWT_SECRET_KEY;
  jwt_expires_in_minutes = Number(process.env.JWT_EXPIRES_IN_MINUTES);
  jwt_refresh_expires_in_minutes = Number(process.env.JWT_REFRESH_EXPIRES_IN_MINUTES);

  // rate limiting
  window_size_in_hours = Number(process.env.WINDOW_SIZE_IN_HOURS);
  max_window_request_count = Number(process.env.MAX_WINDOW_REQUEST_COUNT);
  window_log_interval_in_hours = Number(process.env.WINDOW_LOG_INTERVAL_IN_HOURS);
  
  // cache
  cache_ttl_in_seconds = Number(process.env.CACHE_TTL_IN_SECONDS);

  // path
  log_file_path = process.env.LOG_FILE_PATH;
}