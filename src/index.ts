import "reflect-metadata";
import { container } from "tsyringe";
import 'di/register';
import App from './app/app';

const app: App = container.resolve(App);
app.run();

// import Express from 'express'

// const app = Express()
// const port = 3000

// app.get('/', (req, res) => {
//   res.send("Hello From Express and Typescirpt")
// })

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })
