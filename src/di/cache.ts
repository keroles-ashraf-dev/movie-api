import "reflect-metadata";
import { container } from 'tsyringe';
import redis from 'cache/client';
import { Cache } from 'cache/cache';

container.register('Redis', { useValue: redis });
container.register('BaseCache', { useClass: Cache });