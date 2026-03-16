import * as THREE from 'three';
import { createScene } from './scene';
import { createRenderer } from './renderer';
import { CameraRig } from './camera';
import { Input } from './input';
import { Loop } from './loop';
import { NetworkClient } from '../network/socket';
import type { PlayerState as NetPlayerState } from '../network/socket';
import { createMap01 } from '../world/map01';
import { LocalPlayer } from '../player/localPlayer';
import { RemotePlayer } from '../player/remotePlayer';
import { MenuUI } from '../ui/menu';
import { LobbyUI } from '../ui/lobby';
import { HudUI } from '../ui/hud';
import { ResultsUI } from '../ui/results';
import { NETWORK_RATE } from '../utils/constants';

const OBJECTIVES = [
  'Kontrol panelini bul.',
  'Kapıyı aç ve geç.',
  'Takım arkadaşın için yolu aktif et.',
  'İki plakayı aynı anda etkinleştirin.',
  'Enerji küpünü bulun.',
  'Küpü jeneratöre yerleştirin.',
  'Çıkış kapısına gidin.'
];

export class Game {
  private container: HTMLElement;
  private scene = createScene();
  private cameraRig = new CameraRig();
  private renderer!: THREE.WebGLRenderer;
  private input = new Input();
  private loop!: Loop;
  private network = new NetworkClient();

  private menu!: MenuUI;
  private lobby!: LobbyUI;
  private hud!: HudUI;
  private results!: ResultsUI;

  private localPlayer: LocalPlayer | null = null;
  private remotePlayers = new Map<string, RemotePlayer>();
  private inGame = false;
  private lastNetworkSend = 0;
  private objectiveIndex = 0;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  init() {
    this.buildLayout();

    const canvas = document.querySelector<HTMLCanvasElement>('#game-canvas');
    if (!canvas) throw new Error('Canvas not found');

    this.renderer = createRenderer(canvas);
    this.scene.add(createMap01());
    this.cameraRig.camera.position.set(0, 6, 10);

    this.menu = new MenuUI();
    this.lobby = new LobbyUI();
    this.hud = new HudUI();
    this.results = new ResultsUI();

    this.wireUI();
    this.wireNetwork();

    window.addEventListener('resize', () => this.handleResize());
    this.handleResize();

    this.loop = new Loop((dt) => this.update(dt));
    this.loop.start();
  }

  private buildLayout() {
    this.container.innerHTML = `
      <div id="game-root">
        <canvas id="game-canvas"></canvas>
        <div id="ui">
          <section id="menu" class="panel">
            <div class="panel-header">
              <p class="eyebrow">Facility Echo</p>
              <h1>Co-Op Kontrol Tesisi</h1>
              <p class="subtitle">İki rol, üç bulmaca, tek çıkış.</p>
            </div>
            <div class="panel-actions">
              <button id="create-room" class="primary">Oda Oluştur</button>
              <button id="open-join">Odaya Katıl</button>
              <button class="ghost" disabled>Ayarlar</button>
              <button class="ghost" disabled>Çıkış</button>
            </div>
          </section>

          <section id="join" class="panel hidden">
            <div class="panel-header">
              <h2>Odaya Katıl</h2>
              <p class="subtitle">4 haneli oda kodunu gir.</p>
            </div>
            <div class="panel-actions">
              <input id="join-code" maxlength="4" placeholder="AB12" />
              <div id="join-error" class="error"></div>
              <button id="join-room" class="primary">Katıl</button>
              <button id="back-menu">Geri</button>
            </div>
          </section>

          <section id="lobby" class="panel hidden">
            <div class="panel-header">
              <h2>Lobi</h2>
              <p class="subtitle">Oda kodu: <span id="lobby-code">----</span></p>
            </div>
            <div id="lobby-players" class="player-list"></div>
            <button id="start-game" class="primary" disabled>Oyunu Başlat</button>
          </section>

          <section id="hud" class="hud hidden">
            <div id="objective" class="objective"></div>
            <div id="prompt" class="prompt hidden">E ile kullan</div>
            <div id="connection" class="connection">Bağlanıyor...</div>
          </section>

          <section id="results" class="panel hidden">
            <div class="panel-header">
              <h2>Görev Tamamlandı</h2>
              <p id="results-message" class="subtitle"></p>
            </div>
            <div class="panel-actions">
              <button id="results-restart" class="primary">Tekrar Başlat</button>
              <button id="results-menu">Menüye Dön</button>
            </div>
          </section>
        </div>
      </div>
    `;
  }

  private wireUI() {
    this.menu.onCreate(() => this.network.createRoom());
    this.menu.onJoin((code) => this.network.joinRoom(code));

    this.lobby.onStart(() => this.network.startGame());

    this.results.onMenu(() => window.location.reload());
    this.results.onRestart(() => window.location.reload());
  }

  private wireNetwork() {
    this.network.onConnect(() => this.hud?.setConnection(true));
    this.network.onDisconnect(() => this.hud?.setConnection(false));

    this.network.onRoomCreated(({ room }) => {
      this.menu.hideAll();
      this.lobby.show();
      this.lobby.setRoom(room.code);
      this.lobby.setPlayers(room.players);
    });

    this.network.onRoomJoined((payload) => {
      if (!payload.ok) {
        this.menu.showJoin();
        this.menu.setJoinError(payload.reason === 'ROOM_NOT_FOUND_OR_FULL' ? 'Oda bulunamadı veya dolu.' : 'Bağlantı hatası');
        return;
      }

      this.menu.hideAll();
      this.lobby.show();
      this.lobby.setRoom(payload.room.code);
      this.lobby.setPlayers(payload.room.players);
    });

    this.network.onRoomUpdate((room) => {
      this.lobby.setRoom(room.code);
      this.lobby.setPlayers(room.players);

      if (room.started && !this.inGame) {
        this.startGame(room.objectiveIndex);
      }
    });

    this.network.onPlayerSpawn((player) => this.spawnPlayer(player));

    this.network.onPlayerUpdate((player) => {
      const remote = this.remotePlayers.get(player.id);
      if (!remote) return;

      const pos = new THREE.Vector3(player.position.x, player.position.y, player.position.z);
      remote.applyNetworkState(pos, player.rotation.y);
    });

    this.network.onPlayerDisconnected(({ id }) => {
      const remote = this.remotePlayers.get(id);
      if (remote) {
        this.scene.remove(remote.mesh);
        this.remotePlayers.delete(id);
      }
    });
  }

  private startGame(objectiveIndex: number) {
    this.inGame = true;
    this.objectiveIndex = objectiveIndex;
    this.hud.setObjective(OBJECTIVES[this.objectiveIndex] ?? 'Görev bekleniyor');
    this.hud.show();
    this.lobby.hide();
  }

  private spawnPlayer(player: NetPlayerState) {
    const spawn = new THREE.Vector3(player.position.x, player.position.y, player.position.z);

    if (player.id === this.network.id) {
      this.localPlayer = new LocalPlayer(player.id, player.role, spawn);
      this.scene.add(this.localPlayer.mesh);
      return;
    }

    if (!this.remotePlayers.has(player.id)) {
      const remote = new RemotePlayer(player.role, spawn);
      this.remotePlayers.set(player.id, remote);
      this.scene.add(remote.mesh);
    }
  }

  private update(dt: number) {
    if (this.inGame && this.localPlayer) {
      const state = this.localPlayer.update(dt, this.input);
      this.cameraRig.update(state.position, state.rotation.y, dt);
      this.lastNetworkSend += dt;

      if (this.lastNetworkSend >= 1 / NETWORK_RATE) {
        this.network.sendPlayerMove({
          position: { x: state.position.x, y: state.position.y, z: state.position.z },
          rotation: { x: 0, y: state.rotation.y, z: 0 },
          isMoving: state.isMoving,
          isJumping: state.isJumping
        });
        this.lastNetworkSend = 0;
      }
    }

    for (const remote of this.remotePlayers.values()) {
      remote.update(dt);
    }

    this.renderer.render(this.scene, this.cameraRig.camera);
  }

  private handleResize() {
    this.renderer?.setSize(window.innerWidth, window.innerHeight);
    this.cameraRig.resize();
  }
}

