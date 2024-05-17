import { Router } from 'express';
import { container } from 'tsyringe';

container.register('AppRouter', { useValue: Router() });
