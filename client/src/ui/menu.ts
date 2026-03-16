import { byId } from '../utils/helpers';

export class MenuUI {
  private menu = byId<HTMLDivElement>('menu');
  private join = byId<HTMLDivElement>('join');
  private joinError = byId<HTMLDivElement>('join-error');
  private joinInput = byId<HTMLInputElement>('join-code');

  constructor() {
    const createBtn = byId<HTMLButtonElement>('create-room');
    const openJoinBtn = byId<HTMLButtonElement>('open-join');
    const joinBtn = byId<HTMLButtonElement>('join-room');
    const backBtn = byId<HTMLButtonElement>('back-menu');

    openJoinBtn.addEventListener('click', () => this.showJoin());
    backBtn.addEventListener('click', () => this.showMenu());

    createBtn.addEventListener('click', () => this.emit('create'));
    joinBtn.addEventListener('click', () => this.emit('join'));

    this.joinInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') this.emit('join');
    });
  }

  private createHandlers: Array<() => void> = [];
  private joinHandlers: Array<(code: string) => void> = [];

  onCreate(handler: () => void) {
    this.createHandlers.push(handler);
  }

  onJoin(handler: (code: string) => void) {
    this.joinHandlers.push(handler);
  }

  private emit(type: 'create' | 'join') {
    if (type === 'create') this.createHandlers.forEach((cb) => cb());
    if (type === 'join') this.joinHandlers.forEach((cb) => cb(this.joinInput.value));
  }

  showMenu() {
    this.menu.classList.remove('hidden');
    this.join.classList.add('hidden');
    this.setJoinError('');
  }

  showJoin() {
    this.menu.classList.add('hidden');
    this.join.classList.remove('hidden');
    this.joinInput.focus();
    this.setJoinError('');
  }

  setJoinError(message: string) {
    this.joinError.textContent = message;
  }

  hideAll() {
    this.menu.classList.add('hidden');
    this.join.classList.add('hidden');
  }
}

