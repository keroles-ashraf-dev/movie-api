import "reflect-metadata";
import { container } from "tsyringe";
import 'di/register';
import App from './app/app';

const app: App = container.resolve(App);
app.run();