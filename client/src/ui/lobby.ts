import { byId } from '../utils/helpers';
import type { PlayerRole } from '../player/playerState';

export class LobbyUI {
  private lobby = byId<HTMLDivElement>('lobby');
  private roomCode = byId<HTMLSpanElement>('lobby-code');
  private playerList = byId<HTMLDivElement>('lobby-players');
  private startButton = byId<HTMLButtonElement>('start-game');

  private startHandlers: Array<() => void> = [];

  constructor() {
    this.startButton.addEventListener('click', () => this.startHandlers.forEach((cb) => cb()));
  }

  onStart(handler: () => void) {
    this.startHandlers.push(handler);
  }

  show() {
    this.lobby.classList.remove('hidden');
  }

  hide() {
    this.lobby.classList.add('hidden');
  }

  setRoom(code: string) {
    this.roomCode.textContent = code;
  }

  setPlayers(players: Array<{ id: string; role: PlayerRole }>) {
    this.playerList.innerHTML = '';
    const operator = players.find((p) => p.role === 'operator');
    const controller = players.find((p) => p.role === 'controller');

    const operatorEl = document.createElement('div');
    operatorEl.textContent = operator ? 'Operatör: bağlı' : 'Operatör: bekleniyor';
    operatorEl.className = operator ? 'player ready' : 'player';

    const controllerEl = document.createElement('div');
    controllerEl.textContent = controller ? 'Kontrolcü: bağlı' : 'Kontrolcü: bekleniyor';
    controllerEl.className = controller ? 'player ready' : 'player';

    this.playerList.append(operatorEl, controllerEl);
    this.startButton.disabled = players.length < 2;
  }
}

