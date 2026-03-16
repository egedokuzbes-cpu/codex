import './style.css';
import { Game } from './core/game';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('App root missing');

const game = new Game(app);
game.init();

