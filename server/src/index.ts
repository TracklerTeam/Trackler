import express, { NextFunction, Request, Response } from 'express';
import { connect } from './database/mongoose-connection';
import helmet from 'helmet';
import cors from 'cors';
import 'dotenv/config';
import router from './routes';
import bodyParser from 'body-parser';

const app = express();

const jsonErrorHandler = (err: SyntaxError, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send({ error: err.message });
}

app.use(helmet());
app.use(cors());
app.use(
    express.urlencoded({
      extended: true,
    })
);
app.use(bodyParser.json());
app.use(router);
app.use(jsonErrorHandler);

connect();

app.get('/', (req: Request, res: Response) => {
    res.send("Welcome to Trackler API");
});

app.listen(process.env.API_PORT, () => {
    console.log(`Application started on port ${process.env.API_PORT}!`);
});
