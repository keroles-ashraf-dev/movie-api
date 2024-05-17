import { container } from "tsyringe";
import redis from 'redis';
import DBConfig from 'config/db.config';
import { Logger } from "helpers/logger";

const logger: Logger = container.resolve('RedisLogger');
const dBConfig: DBConfig = container.resolve(DBConfig);

const createClient = async () => {
    return await redis.createClient({
        url: `redis://${dBConfig.redis_username}:${dBConfig.redis_password}@${dBConfig.redis_host}:${dBConfig.redis_port}`
    })
        .on('error', err => logger.error('redis server error', err))
        .on('connect', () => logger.info('redis server connecting'))
        .on('ready', () => logger.info('redis server ready'))
        .on('end', () => logger.info('redis server end'))
        .connect();
}

const client = await createClient();

export default client;