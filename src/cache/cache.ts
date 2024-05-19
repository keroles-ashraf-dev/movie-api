import "reflect-metadata";
import { RedisClientType } from "redis";
import { inject, injectable, singleton } from "tsyringe";
import AppConfig from "config/app.config";
import { Logger } from "helpers/logger";

export interface BaseCache {
  set(key: any, value: any): Promise<void>;

  get(key: any): Promise<string | null>;

  exists(key: any): Promise<boolean>;
}

@singleton()
@injectable()
export class Cache implements BaseCache {
  constructor(
    @inject(AppConfig) private appConfig: AppConfig,
    @inject('CacheLogger') private logger: Logger,
    @inject('Redis') private client: RedisClientType,
  ) { }

  set = async (key: any, value: any): Promise<void> => {
    this.logger.info('cache set args', {key: key, value: value});

    const res = await this.client.setEx(key, this.appConfig.cache_ttl_in_seconds, value);

    this.logger.info('cache set res', {res: res});
  }
  
  get = async (key: any): Promise<string | null> => {
    this.logger.info('cache get args', {key: key});

    const exists = await this.exists(key);

    let data = null;

    if(exists){
      data = await this.client.get(key);

      this.logger.info('cache get res', {data: data}); 
    }

    return data;
  }
  
  exists = async (key: any): Promise<boolean> => {
    this.logger.info('cache exists args', {key: key});

    const exists = await this.client.exists(key);

    this.logger.info('cache exists res', { exists: exists });

    return exists == 1;
  }
}