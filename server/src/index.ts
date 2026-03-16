import 'dotenv/config';
import { createGameServer } from './server';

const port = process.env.PORT ? Number(process.env.PORT) : 3001;
createGameServer(port);

