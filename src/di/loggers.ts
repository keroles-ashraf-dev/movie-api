import { container } from 'tsyringe';
import { Logger } from 'helpers/logger';

container.register('GeneralLogger', { useValue: new Logger('general') });
container.register('RedisLogger', { useValue: new Logger('redis') });
container.register('JWTLogger', { useValue: new Logger('jwt') });