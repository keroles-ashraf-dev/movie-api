import "reflect-metadata";
import { RedisClientType } from "redis";
import { inject, injectable, singleton } from "tsyringe";
import AppConfig from "config/app.config";

export interface BaseCache {
  set(key: string, value: any): Promise<void>;

  get(key: string): Promise<string | null>;
}

@injectable()
@singleton()
export class Cache implements BaseCache {
  constructor(
    @inject(AppConfig) private appConfig: AppConfig,
    @inject('Redis') private client: RedisClientType,
  ) { }

  set = async (key: string, value: any): Promise<void> => {
    await this.client.SETEX(key, this.appConfig.cache_ttl_in_seconds, JSON.stringify(value));
  }

  get = async (key: string): Promise<any> => {
    let data = await this.client.get(key);

    if (data) data = JSON.parse(data);

    return data;
  }
}