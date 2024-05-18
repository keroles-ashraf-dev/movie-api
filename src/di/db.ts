import "reflect-metadata";
import { container } from 'tsyringe';
import postgres from 'db/connection';

container.register('Postgres', { useValue: postgres });
