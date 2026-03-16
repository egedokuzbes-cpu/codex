import { byId } from '../utils/helpers';

export class PromptUI {
  private prompt = byId<HTMLDivElement>('prompt');

  show(text: string) {
    this.prompt.textContent = text;
    this.prompt.classList.remove('hidden');
  }

  hide() {
    this.prompt.classList.add('hidden');
  }
}

