import { byId } from '../utils/helpers';

export class ResultsUI {
  private panel = byId<HTMLDivElement>('results');
  private message = byId<HTMLParagraphElement>('results-message');
  private restartHandlers: Array<() => void> = [];
  private menuHandlers: Array<() => void> = [];

  constructor() {
    byId<HTMLButtonElement>('results-restart').addEventListener('click', () => {
      this.restartHandlers.forEach((cb) => cb());
    });
    byId<HTMLButtonElement>('results-menu').addEventListener('click', () => {
      this.menuHandlers.forEach((cb) => cb());
    });
  }

  onRestart(handler: () => void) {
    this.restartHandlers.push(handler);
  }

  onMenu(handler: () => void) {
    this.menuHandlers.push(handler);
  }

  show(message: string) {
    this.message.textContent = message;
    this.panel.classList.remove('hidden');
  }

  hide() {
    this.panel.classList.add('hidden');
  }
}

