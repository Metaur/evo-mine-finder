import {GameType} from '../types';

export class WebSocketDecorator {
  ws: WebSocket;
  onMapListeners: Array<(content: string) => void> = [];
  onLossListeners: Array<() => void> = [];

  constructor(ws: WebSocket) {
    this.ws = ws;

    this.ws.onmessage = (e: MessageEvent) => {
      console.log(e);
      if (e.data.startsWith('map:')) {
        this.onMapListeners.forEach(l => l(e.data))
      }

      if (e.data.indexOf('You lose') !== -1) {
        this.onLossListeners.forEach(l => l());
      }
    };
  }

  private send(msg: string) {
    this.ws.send(msg);
  }

  newGame(game: GameType) {
    this.send(`new ${game}`)
  }

  addMapListener(fn: (content: string) => void) {
    this.onMapListeners.push(fn);
  }

  addLossListener(fn: () => void) {
    this.onLossListeners.push(fn);
  }

  removeMapListener(fn: (content: string) => void) {
    const index = this.onMapListeners.indexOf(fn);
    if (index > 0) {
      delete this.onMapListeners[index];
    }
  }

  removeAllListeners() {
    this.onMapListeners = [];
    this.onLossListeners = [];
  }

  getMap() {
    this.send('map');
  }

  open(x: number, y: number) {
    this.send(`open ${x} ${y}`)
  }

  help() {
    this.send('help')
  }

  close() {
    return this.ws.close()
  }
}

let wsSingleton: WebSocketDecorator | null = null;

export default function getWS(): Promise<WebSocketDecorator> {
  return new Promise((resolve, reject) => {
    if (wsSingleton != null && wsSingleton.ws.readyState <= 1) {
      resolve(wsSingleton);
      return;
    }

    const ws = new WebSocket('wss://hometask.eg1236.com/game1/');
    ws.onopen = () => {
      const wsNew = new WebSocketDecorator(ws);
      if (wsSingleton != null) {
        wsNew.onLossListeners = wsSingleton.onLossListeners;
        wsNew.onMapListeners = wsSingleton.onMapListeners;
      }
      wsSingleton = wsNew;
      resolve(wsSingleton);
    };
    ws.onerror = (e: Event) => {
      console.error(e);
      reject(e)
    };
  });
};
