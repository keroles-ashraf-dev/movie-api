import { container } from 'tsyringe';
import redis from 'cache/connection';
import { Cache } from 'cache/cache';

container.register('Redis', { useValue: redis });
container.register('BaseCache', { useClass: Cache });