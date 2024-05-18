import "reflect-metadata";
import { RedisClientType } from "redis";
import { inject, injectable, singleton } from "tsyringe";
import AppConfig from "config/app.config";

export interface BaseCache {
  set(key: string, value: any): Promise<void>;

  get(key: string): Promise<string | null>;
}

@singleton()
@injectable()
export class Cache implements BaseCache {
  constructor(
    @inject(AppConfig) private appConfig: AppConfig,
    @inject('Redis') private client: RedisClientType,
  ) { }

  set = async (key: any, value: any): Promise<void> => {
    await this.client.setEx(String(key), this.appConfig.cache_ttl_in_seconds, JSON.stringify(value));
  }

  get = async (key: any): Promise<string | null> => {
    let data = await this.client.get(String(key));

    return data;
  }
}