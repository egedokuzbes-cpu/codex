import { byId } from '../utils/helpers';

export class HudUI {
  private hud = byId<HTMLDivElement>('hud');
  private objective = byId<HTMLDivElement>('objective');
  private connection = byId<HTMLDivElement>('connection');

  show() {
    this.hud.classList.remove('hidden');
  }

  hide() {
    this.hud.classList.add('hidden');
  }

  setObjective(text: string) {
    this.objective.textContent = text;
  }

  setConnection(connected: boolean) {
    this.connection.textContent = connected ? 'Bağlı' : 'Bağlantı koptu';
    this.connection.classList.toggle('offline', !connected);
  }
}

