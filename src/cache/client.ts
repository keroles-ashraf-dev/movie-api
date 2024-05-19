import "reflect-metadata";
import { container } from "tsyringe";
import * as redis from 'redis';
import DBConfig from 'config/db.config';
import { Logger } from "helpers/logger";

const logger: Logger = container.resolve('CacheLogger');
const dBConfig: DBConfig = container.resolve(DBConfig);

const client = redis.createClient({
    url: `redis://:${dBConfig.redis_password}@${dBConfig.redis_host}:${dBConfig.redis_port}`,
});

client.on('error', err => logger.error('redis server error', err));
client.on('connect', () => logger.info('redis server connecting'));
client.on('ready', () => logger.info('redis server ready'));
client.on('end', () => logger.info('redis server end'));

export default client;