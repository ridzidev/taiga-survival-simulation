'use client';

import { useEffect, useRef } from 'react';

export default function SurvivalSimulation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing content
    containerRef.current.innerHTML = '';

    // Create the HTML structure
    const header = document.createElement('div');
    header.id = 'header';
    header.innerHTML = `
      <div id="status-display">
        <h4>Status Survivor</h4>
        <small>Kehangatan</small>
        <div class="status-bar"><div id="warmth-bar" style="width: 100%;"></div></div>
        <small>Rasa Lapar</small>
        <div class="status-bar"><div id="hunger-bar" style="width: 100%;"></div></div>
        <small>Rasa Haus</small>
        <div class="status-bar"><div id="thirst-bar" style="width: 100%;"></div></div>
        <small>Kesehatan</small>
        <div class="status-bar"><div id="health-bar" style="width: 100%;"></div></div>
        <div class="inventory-item"><strong>Kayu:</strong> <span id="inv-wood">0</span></div>
        <div class="inventory-item"><strong>Batu:</strong> <span id="inv-stone">0</span></div>
        <div class="inventory-item"><strong>Makanan:</strong> <span id="inv-food">0</span></div>
        <div class="inventory-item"><strong>Bulu:</strong> <span id="inv-fur">0</span></div>
        <div class="inventory-item"><strong>Benang:</strong> <span id="inv-thread">0</span></div>
        <div class="inventory-item"><strong>Pancing:</strong> <span id="inv-fishingrod">0</span></div>
        <div class="inventory-item"><strong>Baju Bulu:</strong> <span id="inv-furcoat">0</span></div>
        <div class="inventory-item"><strong>Tombak:</strong> <span id="inv-spear">0</span></div>
        <div class="inventory-item"><strong>Perangkap:</strong> <span id="inv-trap">0</span></div>
        <div class="inventory-item"><strong>Air:</strong> <span id="inv-water">0</span></div>
        <div class="inventory-item"><strong>Level Shelter:</strong> <span id="inv-shelterlevel">0</span></div>
        <div id="survival-time">Waktu Bertahan: 0 hari</div>
        <div id="day-night-indicator">Waktu: Siang</div>
        <div id="temperature-display">Suhu: 15°C</div>
        <div id="score-display">Score: 0</div>
      </div>
    `;

    const gameContainer = document.createElement('div');
    gameContainer.id = 'game-container';
    gameContainer.innerHTML = `
      <div id="ui-panel">
        <div>
          <h3>Parameter Simulasi</h3>
          <div class="param-group">
            <label for="peta-size">Ukuran Peta (contoh: 60)</label>
            <input type="number" id="peta-size" value="60">
          </div>
          <div class="param-group">
            <label for="pohon-count">Jumlah Pohon</label>
            <input type="number" id="pohon-count" value="100">
          </div>
          <div class="param-group">
            <label for="batu-count">Jumlah Batu</label>
            <input type="number" id="batu-count" value="50">
          </div>
          <div class="param-group">
            <label for="hewan-count">Jumlah Hewan Buruan</label>
            <input type="number" id="hewan-count" value="15">
          </div>
          <div class="param-group">
            <label for="predator-count">Jumlah Binatang Buas</label>
            <input type="number" id="predator-count" value="5">
          </div>
          <div class="param-group">
            <label for="cycle-speed">Kecepatan Siklus Siang-Malam (1-10)</label>
            <input type="number" id="cycle-speed" value="5" min="1" max="10">
          </div>
          <div class="param-group">
            <label for="ai-intelligence">Kecerdasan AI (1-10)</label>
            <input type="number" id="ai-intelligence" value="5" min="1" max="10">
          </div>
        </div>
        <button id="start-sim">Mulai / Atur Ulang</button>
        <div id="controls">
          <button id="pause-btn">Pause</button>
          <button id="ff-btn">Fast Forward (x2)</button>
          <button id="export-log">Export Log</button>
        </div>
      </div>
      <div id="main-content">
        <canvas id="gameCanvas" width="840" height="600"></canvas>
        <canvas id="mini-map" width="200" height="150"></canvas>
        <canvas id="shelter-canvas"></canvas>
        <div id="activity-log">
          <p>Selamat datang di simulasi bertahan hidup terbaik di Taiga! Fitur baru: AI ditingkatkan, thirst, musim, event, regenerate resource, tombak, perangkap, mini-map, pause/FF, sound, achievement.</p>
        </div>
      </div>
    `;

    containerRef.current.appendChild(header);
    containerRef.current.appendChild(gameContainer);

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      body {
        font-family: 'Courier New', Courier, monospace;
        background-color: #1a1a1a;
        color: #f0f0f0;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      #header {
        width: 100%;
        max-width: 1200px;
        display: flex;
        justify-content: space-between;
        gap: 20px;
        margin-bottom: 20px;
      }
      #status-display {
        flex: 1;
        background-color: #2a2a2a;
        border: 2px solid #555;
        padding: 15px;
      }
      #status-display h4 {
        margin: 0 0 10px 0;
        border-bottom: 1px solid #555;
        padding-bottom: 10px;
      }
      .status-bar {
        background-color: #444;
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 8px;
      }
      .status-bar div {
        height: 12px;
        border-radius: 3px;
        transition: width 0.3s;
      }
      #warmth-bar { background-color: #e67e22; }
      #hunger-bar { background-color: #c0392b; }
      #thirst-bar { background-color: #3498db; }
      #health-bar { background-color: #2ecc71; }
      .inventory-item {
        font-size: 14px;
      }
      #survival-time {
        font-size: 16px;
        font-weight: bold;
        color: #27ae60;
        margin-top: 10px;
      }
      #day-night-indicator {
        font-size: 14px;
        color: #bdc3c7;
      }
      #temperature-display {
        font-size: 14px;
        color: #3498db;
      }
      #score-display {
        font-size: 14px;
        color: #ffcc00;
      }
      #game-container {
        width: 100%;
        max-width: 1200px;
        display: flex;
        gap: 20px;
      }
      #ui-panel {
        padding: 20px;
        background-color: #2a2a2a;
        border: 2px solid #555;
        width: 280px;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .param-group {
        margin-bottom: 5px;
      }
      .param-group label {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        color: #aaa;
      }
      .param-group input {
        width: 100%;
        box-sizing: border-box;
        background-color: #333;
        border: 1px solid #555;
        color: #f0f0f0;
        padding: 8px;
        border-radius: 3px;
      }
      button {
        width: 100%;
        padding: 12px;
        background-color: #507A52;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        border-radius: 3px;
        transition: background-color 0.2s;
      }
      button:hover {
        background-color: #619363;
      }
      #controls {
        display: flex;
        gap: 10px;
      }
      #controls button {
        flex: 1;
        padding: 8px;
      }
      #activity-log {
        width: 100%;
        box-sizing: border-box;
        height: 200px;
        background-color: #222;
        border: 1px solid #555;
        padding: 10px;
        overflow-y: scroll;
        font-size: 13px;
        line-height: 1.6;
      }
      #activity-log p {
        margin: 0 0 5px 0;
        color: #ccc;
      }
      #activity-log p.important {
        color: #ffc107;
        font-weight: bold;
      }
      #main-content {
        display: flex;
        flex-direction: column;
        gap: 10px;
        flex: 1;
      }
      canvas {
        border: 2px solid #555;
        background-color: #000;
        image-rendering: -moz-crisp-edges;
        image-rendering: -webkit-crisp-edges;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
      }
      #gameCanvas {
        width: 840px;
        height: 600px;
      }
      #mini-map {
        width: 200px;
        height: 150px;
        border: 1px solid #555;
        align-self: flex-end;
      }
      #shelter-canvas {
        display: none;
        width: 840px;
        height: 300px;
      }
    `;
    document.head.appendChild(style);

    // Now add the JavaScript logic
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    const miniMapCanvas = document.getElementById('mini-map') as HTMLCanvasElement;
    const miniMapCtx = miniMapCanvas.getContext('2d')!;
    const shelterCanvas = document.getElementById('shelter-canvas') as HTMLCanvasElement;
    const shelterCtx = shelterCanvas.getContext('2d')!;
    const startButton = document.getElementById('start-sim') as HTMLButtonElement;
    const pauseButton = document.getElementById('pause-btn') as HTMLButtonElement;
    const ffButton = document.getElementById('ff-btn') as HTMLButtonElement;
    const exportButton = document.getElementById('export-log') as HTMLButtonElement;
    const logContainer = document.getElementById('activity-log') as HTMLDivElement;
    const TILE_SIZE = 14;
    const SHELTER_INTERIOR_SIZE = 20;
    const COLORS: {[key: string]: string} = {
      SURVIVOR: '#ff4757',
      POHON: '#218c74',
      BATU: '#8395a7',
      HEWAN: '#e1b12c',
      PREDATOR: '#c23616',
      SHELTER: '#8e44ad',
      TANAH_DAY: '#574b3b',
      TANAH_NIGHT: '#2c241d',
      AIR_DAY: '#3498db',
      AIR_NIGHT: '#1e4a7a',
      API: '#f0932b',
      SNOW: '#f0f0f0',
      INTERIOR_WALL: '#7d5a3e',
      INTERIOR_FLOOR: '#4d3a2b',
      INTERIOR_SURVIVOR: '#ff4757',
      INTERIOR_FIRE: '#f0932b'
    };
    let mapSize: number = 60, mapHeight: number = 42;
    let grid: string[][] = [];
    let entities: Entity[] = [];
    let survivor: any;
    let shelter: any = null;
    let gameLoopInterval: any = null;
    let globalTime = 0;
    let temperature = 15;
    let dayCycle = 0;
    let isDay = true;
    let cycleSpeed = 5;
    let survivalDays = 0;
    let weather = 'cerah';
    let inShelter = false;
    let season = 0; // 0: semi, 1: panas, 2: gugur, 3: dingin
    let score = 0;
    let aiIntelligence = 5;
    let isPaused = false;
    let speedMultiplier = 1;
    let lastFireTime = 0;
    let audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

    function playSound(frequency: number, duration: number) {
      const oscillator = audioCtx.createOscillator();
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      oscillator.connect(audioCtx.destination);
      oscillator.start();
      setTimeout(() => oscillator.stop(), duration);
    }

    function logActivity(message: string, isImportant = false) {
      const p = document.createElement('p');
      p.textContent = `[${Math.floor(globalTime/240)} hari, ${Math.floor((globalTime % 240)/10)} jam] ${message}`;
      if (isImportant) p.classList.add('important');
      logContainer.appendChild(p);
      logContainer.scrollTop = logContainer.scrollHeight;
      if (isImportant) playSound(440, 200); // Simple beep for important events
    }

    class Entity {
      constructor(public x: number, public y: number, public type: string) {
        this.id = Math.random();
      }
      id: number;
      update?: () => void;
      lifespan?: number;
      isIndoor?: boolean;
      active?: boolean;
      level?: number;
      fire?: Fire | null;
    }

    class Fire extends Entity {
      update: () => void;
      constructor(x: number, y: number, public isIndoor = false) {
        super(x, y, 'API');
        this.lifespan = isIndoor ? 500 : 250;
        this.update = () => {
          this.lifespan--;
          if (weather === 'hujan' && !this.isIndoor) this.lifespan -= 2;
        };
      }
      lifespan: number;
    }

    class Animal extends Entity {
      constructor(x: number, y: number, type = 'HEWAN') {
        super(x, y, type);
        this.update = () => {
          if (Math.random() < (isDay ? 0.3 : 0.1)) {
            const moveX = Math.floor(Math.random() * 3) - 1;
            const moveY = Math.floor(Math.random() * 3) - 1;
            if (this.isValidMove(this.x + moveX, this.y + moveY)) {
              this.x += moveX;
              this.y += moveY;
            }
          }
      if (this.type === 'PREDATOR' && survivor && survivor.health > 0 && !inShelter && Math.abs(this.x - survivor.x) + Math.abs(this.y - survivor.y) <= 1 && Math.random() < 0.05) {
        survivor.health -= survivor.inventory.spear ? 5 : 10;
        logActivity('Binatang buas menyerang survivor!', true);
      } else if (survivor && Math.abs(this.x - survivor.x) + Math.abs(this.y - survivor.y) < 5 && Math.random() < 0.2) {
        const dx = Math.sign(this.x - survivor.x);
        const dy = Math.sign(this.y - survivor.y);
        if (this.isValidMove(this.x + dx, this.y + dy)) {
          this.x += dx;
          this.y += dy;
        }
      }
        };
      }
      isValidMove(x: number, y: number) {
        return x >= 0 && x < mapSize && y >= 0 && y < mapHeight && grid[y][x] !== 'AIR';
      }
    }

    class Trap extends Entity {
      constructor(x: number, y: number) {
        super(x, y, 'TRAP');
        this.active = true;
        this.update = () => {
          if (this.active && Math.random() < 0.1) {
            survivor.inventory.food += 1;
            logActivity('Perangkap menangkap hewan! +1 makanan.');
            this.active = false; // Need repair after catch
          }
        };
      }
      active: boolean;
    }

    class Shelter extends Entity {
      constructor(x: number, y: number) {
        super(x, y, 'SHELTER');
        this.level = 1;
        this.fire = null;
        this.update = () => {
          if (this.fire) {
            const fire = this.fire;
            fire.update();
            if (fire.lifespan <= 0) {
              this.fire = null;
              logActivity('Api di shelter padam.');
            }
          }
        };
      }
      level: number;
      fire: Fire | null;
    }

    class Survivor extends Entity {
      constructor(x: number, y: number) {
        super(x, y, 'SURVIVOR');
        this.health = 100;
        this.warmth = 100;
        this.hunger = 100;
        this.thirst = 100;
        this.inventory = { wood: 5, stone: 0, food: 0, fur: 0, thread: 0, fishingrod: 0, furcoat: 0, spear: 0, trap: 0, water: 0 };
        this.task = 'bertahan hidup';
        this.target = null;
        this.hasShelter = false;
        this.home = null;
        this.wearingFurCoat = false;
        this.lastFireTime = 0;
      }
      health: number;
      warmth: number;
      hunger: number;
      thirst: number;
      inventory: any;
      task: string;
      target: any;
      hasShelter: boolean;
      home: any;
      wearingFurCoat: boolean;
      lastFireTime: number;

      updateAI() {
        if (this.health <= 0) return;

        if (this.hasShelter && !isDay && !inShelter) {
          this.task = 'pulang ke shelter';
          this.performTask();
          return;
        }

        if (inShelter) {
          if (this.warmth < 60 && this.inventory.wood > 0 && (!shelter.fire || shelter.fire.lifespan < 50)) {
            this.task = 'membuat api di shelter';
          } else if (this.thirst < 50 && this.inventory.water > 0) {
            this.task = 'minum';
          } else if (this.hunger < 50 && this.inventory.food > 0) {
            this.task = 'makan';
          } else if (this.inventory.fur >= 3 && this.inventory.thread < 5) {
            this.task = 'buat benang';
          } else if (this.inventory.thread >= 2 && this.inventory.stone >= 1 && this.inventory.fishingrod === 0) {
            this.task = 'buat pancing';
          } else if (this.inventory.fur >= 5 && this.inventory.furcoat === 0) {
            this.task = 'buat baju bulu';
          } else if (this.inventory.wood >= 5 && this.inventory.stone >= 2 && this.inventory.spear === 0) {
            this.task = 'buat tombak';
          } else if (this.inventory.wood >= 3 && this.inventory.thread >= 2 && this.inventory.trap < 3) {
            this.task = 'buat perangkap';
          } else if (shelter.level < 3 && this.inventory.wood >= 10 * shelter.level && this.inventory.stone >= 5 * shelter.level) {
            this.task = 'upgrade shelter';
          } else {
            this.task = 'istirahat';
          }
          this.performTask();
          return;
        }

        if (!this.hasShelter && this.inventory.wood >= 10 && this.inventory.stone >= 5) {
          this.task = 'bangun shelter';
          this.performTask();
          return;
        }

        if (this.warmth < 20 && this.inventory.wood > 0 && globalTime - this.lastFireTime > 50) {
          this.task = 'membuat api';
          this.performTask();
          return;
        }

        if (this.thirst < 40 && this.inventory.water < 2) {
          this.task = 'ambil air';
        } else if (this.hunger < 60 && this.inventory.food < 5) {
          if (this.inventory.fishingrod > 0 && Math.random() < 0.5) {
            this.task = 'memancing';
          } else {
            this.task = 'berburu';
          }
        } else if (this.inventory.wood < 10) {
          this.task = 'mencari kayu';
        } else if (this.inventory.stone < 5) {
          this.task = 'mencari batu';
        } else if (this.inventory.fur < 10) {
          this.task = 'berburu';
        } else {
          this.task = 'mengembara';
        }
        this.performTask();
      }

      findNearest(type: string) {
        let closest = null;
        let minDistance = Infinity;
        entities.forEach(e => {
          if (e.type === type) {
            const distance = Math.abs(this.x - e.x) + Math.abs(this.y - e.y);
            if (distance < minDistance) {
              minDistance = distance;
              closest = e;
            }
          }
        });
        return closest;
      }

      findNearestWater(): {x: number, y: number} | null {
        let closestX: number | null = null, closestY: number | null = null;
        let minDistance = Infinity;
        for (let y = 0; y < mapHeight; y++) {
          for (let x = 0; x < mapSize; x++) {
            if (grid[y][x] === 'AIR') {
              const distance = Math.abs(this.x - x) + Math.abs(this.y - y);
              if (distance < minDistance) {
                minDistance = distance;
                closestX = x;
                closestY = y;
              }
            }
          }
        }
        if (closestX !== null && closestY !== null) {
          return {x: closestX, y: closestY};
        }
        return null;
      }

      pathfind(target: any): {x: number, y: number} | null {
        if (!target) return null;
        const typedTarget = target as {x: number, y: number};
        const queue: Array<{x: number, y: number, path: Array<{x: number, y: number}>}> = [{x: this.x, y: this.y, path: []}];
        const visited = new Set();
        visited.add(`${this.x},${this.y}`);
        while (queue.length > 0) {
          const {x, y, path} = queue.shift()!;
          if (x === typedTarget.x && y === typedTarget.y) return path.length > 0 ? path[0] : null; // Return first move or null if already there
          const dirs = [[0,1],[1,0],[0,-1],[-1,0]];
          for (let [dx, dy] of dirs) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < mapSize && ny >= 0 && ny < mapHeight && grid[ny][nx] !== 'AIR' && !visited.has(`${nx},${ny}`)) {
              visited.add(`${nx},${ny}`);
              queue.push({x: nx, y: ny, path: [...path, {x: dx, y: dy}]});
            }
          }
        }
        return null;
      }

      moveTo(target: any) {
        if (!target) {
          this.wander();
          return;
        }
        const move = this.pathfind(target);
        if (move) {
          this.x += move.x;
          this.y += move.y;
        } else {
          this.wander();
        }
      }

      wander() {
        const moveX = Math.floor(Math.random() * 3) - 1;
        const moveY = Math.floor(Math.random() * 3) - 1;
        if (this.isValidMove(this.x + moveX, this.y + moveY)) {
          this.x += moveX;
          this.y += moveY;
        }
      }

      isValidMove(x: number, y: number) {
        return x >= 0 && x < mapSize && y >= 0 && y < mapHeight && grid[y][x] !== 'AIR';
      }

      performTask() {
        if (this.target && !entities.includes(this.target)) this.target = null;

        switch (this.task) {
          case 'mencari kayu':
            if (!this.target || this.target.type !== 'POHON') this.target = this.findNearest('POHON');
            if (this.target) this.executeMoveAndAction('POHON', 'wood', 'menebang pohon'); else this.wander();
            break;
          case 'berburu':
            if (!this.target || this.target.type !== 'HEWAN') this.target = this.findNearest('HEWAN');
            if (this.target) {
              if (Math.abs(this.x - this.target.x) <= 1 && Math.abs(this.y - this.target.y) <= 1) {
                const success = this.inventory.spear ? 0.8 : 0.5;
                if (Math.random() < success) {
                  this.inventory.food++;
                  this.inventory.fur++;
                  entities = entities.filter(e => e.id !== this.target.id);
                  logActivity('Survivor berhasil berburu dan mendapatkan makanan serta bulu.');
                } else {
                  logActivity('Survivor gagal berburu.');
                }
                this.target = null;
              } else {
                this.moveTo(this.target);
              }
            } else this.wander();
            break;
          case 'mencari batu':
            if (!this.target || this.target.type !== 'BATU') this.target = this.findNearest('BATU');
            if (this.target) this.executeMoveAndAction('BATU', 'stone', 'menambang batu'); else this.wander();
            break;
          case 'memancing':
            this.target = this.findNearestWater();
            if (this.target && typeof this.target === 'object' && 'x' in this.target && 'y' in this.target && typeof this.target.x === 'number' && typeof this.target.y === 'number' && Math.abs(this.x - this.target.x) <= 1 && Math.abs(this.y - this.target.y) <= 1) {
              if (Math.random() < 0.3) {
                this.inventory.food += 2;
                logActivity('Survivor berhasil memancing ikan!');
              } else {
                logActivity('Survivor mencoba memancing tapi gagal.');
              }
              this.target = null;
            } else {
              this.moveTo(this.target);
            }
            break;
          case 'ambil air':
            this.target = this.findNearestWater();
            if (this.target && typeof this.target === 'object' && 'x' in this.target && 'y' in this.target && typeof this.target.x === 'number' && typeof this.target.y === 'number' && Math.abs(this.x - this.target.x) <= 1 && Math.abs(this.y - this.target.y) <= 1) {
              this.inventory.water += 2;
              logActivity('Survivor mengambil air dari sungai.');
              this.target = null;
            } else {
              this.moveTo(this.target);
            }
            break;
          case 'membuat api':
            this.inventory.wood -= 1;
            entities.push(new Fire(this.x, this.y));
            this.lastFireTime = globalTime;
            logActivity('Survivor membuat api unggun untuk menghangatkan diri.', true);
            this.task = 'bertahan hidup';
            break;
          case 'membuat api di shelter':
            this.inventory.wood -= 1;
            shelter.fire = new Fire(shelter.x, shelter.y, true);
            logActivity('Survivor membuat api di dalam shelter.', true);
            this.task = 'istirahat';
            break;
          case 'makan':
            this.inventory.food -= 1;
            this.hunger = Math.min(100, this.hunger + 50);
            logActivity('Survivor memakan hasil buruannya.', true);
            this.task = inShelter ? 'istirahat' : 'bertahan hidup';
            break;
          case 'minum':
            this.inventory.water -= 1;
            this.thirst = Math.min(100, this.thirst + 50);
            logActivity('Survivor minum air.', true);
            this.task = inShelter ? 'istirahat' : 'bertahan hidup';
            break;
          case 'bangun shelter':
            this.inventory.wood -= 10;
            this.inventory.stone -= 5;
            shelter = new Shelter(this.x, this.y);
            entities.push(shelter);
            this.hasShelter = true;
            this.home = {x: this.x, y: this.y};
            logActivity('Survivor membangun shelter!', true);
            this.task = 'bertahan hidup';
            break;
          case 'upgrade shelter':
            this.inventory.wood -= 10 * shelter.level;
            this.inventory.stone -= 5 * shelter.level;
            shelter.level++;
            logActivity(`Survivor mengupgrade shelter ke level ${shelter.level}.`, true);
            this.task = 'istirahat';
            break;
          case 'buat benang':
            this.inventory.fur -= 3;
            this.inventory.thread += 5;
            logActivity('Survivor membuat benang dari bulu.', true);
            this.task = 'istirahat';
            break;
          case 'buat pancing':
            this.inventory.thread -= 2;
            this.inventory.stone -= 1;
            this.inventory.fishingrod = 1;
            logActivity('Survivor membuat pancing.', true);
            this.task = 'istirahat';
            break;
          case 'buat baju bulu':
            this.inventory.fur -= 5;
            this.inventory.furcoat = 1;
            this.wearingFurCoat = true;
            logActivity('Survivor membuat baju bulu untuk kehangatan ekstra.', true);
            this.task = 'istirahat';
            break;
          case 'buat tombak':
            this.inventory.wood -= 5;
            this.inventory.stone -= 2;
            this.inventory.spear = 1;
            logActivity('Survivor membuat tombak.', true);
            this.task = 'istirahat';
            break;
          case 'buat perangkap':
            this.inventory.wood -= 3;
            this.inventory.thread -= 2;
            this.inventory.trap += 1;
            entities.push(new Trap(this.x, this.y));
            logActivity('Survivor membuat perangkap.', true);
            this.task = 'istirahat';
            break;
          case 'pulang ke shelter':
            this.target = this.home;
            if (this.target && typeof this.target === 'object' && 'x' in this.target && 'y' in this.target && typeof this.target.x === 'number' && typeof this.target.y === 'number' && Math.abs(this.x - this.target.x) <= 1 && Math.abs(this.y - this.target.y) <= 1) {
              inShelter = true;
              canvas.style.display = 'none';
              miniMapCanvas.style.display = 'none';
              shelterCanvas.style.display = 'block';
              logActivity('Survivor masuk ke shelter.', true);
              this.task = 'istirahat';
            } else {
              this.moveTo(this.target);
            }
            break;
          case 'mengembara':
            if (Math.random() < 0.1) logActivity('Survivor mengamati sekitar...');
            this.wander();
            break;
          case 'istirahat':
            this.health = Math.min(100, this.health + 0.5);
            if (Math.random() < 0.05) logActivity('Survivor beristirahat di shelter.');
            if (isDay && Math.random() < 0.1) {
              inShelter = false;
              canvas.style.display = 'block';
              miniMapCanvas.style.display = 'block';
              shelterCanvas.style.display = 'none';
              logActivity('Survivor keluar dari shelter.', true);
              this.task = 'bertahan hidup';
            }
            break;
        }
      }

      executeMoveAndAction(targetType: string, inventoryItem: string, logMsg: string) {
        if (this.target && typeof this.target === 'object' && 'x' in this.target && 'y' in this.target && typeof this.target.x === 'number' && typeof this.target.y === 'number' && Math.abs(this.x - this.target.x) <= 1 && Math.abs(this.y - this.target.y) <= 1) {
          this.inventory[inventoryItem]++;
          entities = entities.filter(e => e.id !== this.target.id);
          this.target = null;
          logActivity(`Survivor ${logMsg}.`);
        } else {
          this.moveTo(this.target);
        }
      }

      updateStatus() {
        let fireDistance = Infinity;
        if (inShelter && shelter.fire) {
          fireDistance = 0;
        } else {
          const fire = this.findNearest('API');
          fireDistance = fire ? Math.abs(this.x - fire.x) + Math.abs(this.y - fire.y) : Infinity;
        }

        let tempDrop = 0.05 * (15 - temperature);
        if (!isDay) tempDrop *= 1.5;
        if (weather === 'salju') tempDrop *= 2;
        if (weather === 'hujan') tempDrop *= 1.2;
        if (this.wearingFurCoat) tempDrop *= 0.6;
        if (inShelter) tempDrop *= (1 - 0.3 * shelter.level);
        if (fireDistance <= 3) {
          this.warmth = Math.min(100, this.warmth + (inShelter ? 5 : 3));
        } else {
          this.warmth -= tempDrop;
        }

        this.hunger -= isDay ? 0.15 : 0.1;
        this.thirst -= isDay ? 0.2 : 0.15;
        if (inShelter && shelter.level > 1) {
          this.hunger -= 0.05; // Less hunger in better shelter
        }

        if (this.warmth <= 0 || this.hunger <= 0 || this.thirst <= 0) this.health -= 0.5;
        if (this.health <= 0) {
          logActivity("Survivor tidak dapat bertahan dari kerasnya alam... Game over!", true);
          checkAchievements();
          if (gameLoopInterval) clearInterval(gameLoopInterval);
          gameLoopInterval = null;
        }
      }
    }

    function generateMap() {
      grid = [];
      mapHeight = Math.floor(canvas.height / TILE_SIZE);
      for (let y = 0; y < mapHeight; y++) {
        const row = new Array(mapSize).fill('TANAH');
        grid.push(row);
      }
      const waterBodies = getRandomInt(3) + 1;
      for (let i = 0; i < waterBodies; i++) {
        const waterStartX = getRandomInt(mapSize);
        const waterStartY = getRandomInt(mapHeight);
        const waterWidth = getRandomInt(10) + 5;
        const waterHeight = getRandomInt(10) + 5;
        for (let y = waterStartY; y < Math.min(waterStartY + waterHeight, mapHeight); y++) {
          for (let x = waterStartX; x < Math.min(waterStartX + waterWidth, mapSize); x++) {
            grid[y][x] = 'AIR';
          }
        }
      }
    }

    function placeEntities() {
      entities = [];
      const numPohon = parseInt((document.getElementById('pohon-count') as HTMLInputElement).value);
      const numBatu = parseInt((document.getElementById('batu-count') as HTMLInputElement).value);
      const numHewan = parseInt((document.getElementById('hewan-count') as HTMLInputElement).value);
      const numPredator = parseInt((document.getElementById('predator-count') as HTMLInputElement).value);

      const placeObject = (count: number, type: string, Class: any = Entity) => {
        for (let i = 0; i < count; i++) {
          let x, y;
          do {
            x = getRandomInt(mapSize);
            y = getRandomInt(mapHeight);
          } while (grid[y][x] === 'AIR');
          entities.push(new Class(x, y, type));
        }
      };

      placeObject(numPohon, 'POHON');
      placeObject(numBatu, 'BATU');
      placeObject(numHewan, 'HEWAN', Animal);
      placeObject(numPredator, 'PREDATOR', Animal);

      let sx, sy;
      do {
        sx = getRandomInt(mapSize);
        sy = getRandomInt(mapHeight);
      } while (grid[sy][sx] === 'AIR');
      survivor = new Survivor(sx, sy);
      entities.push(survivor);
    }

    function regenerateResources() {
      if (globalTime % 240 === 0) { // Setiap hari
        if (Math.random() < 0.5) entities.push(new Entity(getRandomInt(mapSize), getRandomInt(mapHeight), 'POHON'));
        if (Math.random() < 0.3) entities.push(new Entity(getRandomInt(mapSize), getRandomInt(mapHeight), 'BATU'));
        if (countEntities('HEWAN') < 5) entities.push(new Animal(getRandomInt(mapSize), getRandomInt(mapHeight), 'HEWAN'));
      }
    }

    function countEntities(type: string) {
      return entities.filter(e => e.type === type).length;
    }

    function updateEvents() {
      if (globalTime % 720 === 0) { // Setiap 3 hari
        if (Math.random() < 0.2) {
          logActivity('Badai datang! Api luar padam.', true);
          entities = entities.filter(e => e.type !== 'API' || e.isIndoor);
        } else if (Math.random() < 0.1) {
          logActivity('Longsor! Hilang beberapa resource.', true);
          survivor.inventory.wood = Math.max(0, survivor.inventory.wood - 5);
        }
      }
    }

    function updateSeason() {
      season = Math.floor(survivalDays / 30) % 4;
      if (season === 3) temperature -= 10; // Musim dingin lebih dingin
    }

    function checkAchievements() {
      let ach = '';
      if (survivalDays >= 100) ach = 'Legenda';
      else if (survivalDays >= 30) ach = 'Ranger';
      else if (survivalDays >= 13) ach = 'Pemula';
      if (ach) logActivity(`Achievement unlocked: ${ach}!`, true);
      score = survivalDays * (shelter ? shelter.level : 1) * survivor.inventory.food;
      const scoreDisplay = document.getElementById('score-display') as HTMLElement;
      if (scoreDisplay) scoreDisplay.textContent = `Score: ${score}`;
    }

    function updateUI() {
      const warmthBar = document.getElementById('warmth-bar') as HTMLElement;
      if (warmthBar) warmthBar.style.width = `${Math.max(0, survivor.warmth)}%`;
      const hungerBar = document.getElementById('hunger-bar') as HTMLElement;
      if (hungerBar) hungerBar.style.width = `${Math.max(0, survivor.hunger)}%`;
      const thirstBar = document.getElementById('thirst-bar') as HTMLElement;
      if (thirstBar) thirstBar.style.width = `${Math.max(0, survivor.thirst)}%`;
      const healthBar = document.getElementById('health-bar') as HTMLElement;
      if (healthBar) healthBar.style.width = `${Math.max(0, survivor.health)}%`;
      const invWood = document.getElementById('inv-wood') as HTMLElement;
      if (invWood) invWood.textContent = survivor.inventory.wood.toString();
      const invStone = document.getElementById('inv-stone') as HTMLElement;
      if (invStone) invStone.textContent = survivor.inventory.stone.toString();
      const invFood = document.getElementById('inv-food') as HTMLElement;
      if (invFood) invFood.textContent = survivor.inventory.food.toString();
      const invFur = document.getElementById('inv-fur') as HTMLElement;
      if (invFur) invFur.textContent = survivor.inventory.fur.toString();
      const invThread = document.getElementById('inv-thread') as HTMLElement;
      if (invThread) invThread.textContent = survivor.inventory.thread.toString();
      const invFishingrod = document.getElementById('inv-fishingrod') as HTMLElement;
      if (invFishingrod) invFishingrod.textContent = survivor.inventory.fishingrod.toString();
      const invFurcoat = document.getElementById('inv-furcoat') as HTMLElement;
      if (invFurcoat) invFurcoat.textContent = survivor.inventory.furcoat.toString();
      const invSpear = document.getElementById('inv-spear') as HTMLElement;
      if (invSpear) invSpear.textContent = survivor.inventory.spear.toString();
      const invTrap = document.getElementById('inv-trap') as HTMLElement;
      if (invTrap) invTrap.textContent = survivor.inventory.trap.toString();
      const invWater = document.getElementById('inv-water') as HTMLElement;
      if (invWater) invWater.textContent = survivor.inventory.water.toString();
      const invShelterlevel = document.getElementById('inv-shelterlevel') as HTMLElement;
      if (invShelterlevel) invShelterlevel.textContent = shelter ? shelter.level.toString() : '0';
      const survivalTime = document.getElementById('survival-time') as HTMLElement;
      if (survivalTime) survivalTime.textContent = `Waktu Bertahan: ${survivalDays} hari`;
      const dayNightIndicator = document.getElementById('day-night-indicator') as HTMLElement;
      if (dayNightIndicator) dayNightIndicator.textContent = `Waktu: ${isDay ? 'Siang' : 'Malam'} | Cuaca: ${weather.charAt(0).toUpperCase() + weather.slice(1)} | Musim: ${['Semi', 'Panas', 'Gugur', 'Dingin'][season]}`;
      const temperatureDisplay = document.getElementById('temperature-display') as HTMLElement;
      if (temperatureDisplay) temperatureDisplay.textContent = `Suhu: ${Math.round(temperature)}°C`;
      const scoreDisplay = document.getElementById('score-display') as HTMLElement;
      if (scoreDisplay) scoreDisplay.textContent = `Score: ${score}`;
    }

    function draw() {
      if (inShelter) {
        drawShelterInterior();
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const tanahColor = isDay ? COLORS.TANAH_DAY : COLORS.TANAH_NIGHT;
      const airColor = isDay ? COLORS.AIR_DAY : COLORS.AIR_NIGHT;

      for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapSize; x++) {
          ctx.fillStyle = grid[y][x] === 'AIR' ? airColor : tanahColor;
          ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      }

      if (weather === 'salju') {
        ctx.fillStyle = COLORS.SNOW + '44';
        for (let i = 0; i < 50; i++) {
          const sx = getRandomInt(canvas.width);
          const sy = getRandomInt(canvas.height);
          ctx.fillRect(sx, sy, 2, 2);
        }
      }

      entities.forEach((entity: Entity) => {
        if (entity.type === 'API') {
          const flicker = Math.random() > 0.5 ? COLORS.API : '#ffdd59';
          ctx.fillStyle = flicker;
        } else {
          ctx.fillStyle = COLORS[entity.type] || '#ffffff';
        }
        ctx.fillRect(entity.x * TILE_SIZE, entity.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      });

      drawMiniMap();
    }

    function drawMiniMap() {
      const miniTile = miniMapCanvas.width / mapSize;
      miniMapCtx.clearRect(0, 0, miniMapCanvas.width, miniMapCanvas.height);
      for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapSize; x++) {
          miniMapCtx.fillStyle = grid[y][x] === 'AIR' ? COLORS.AIR_DAY : COLORS.TANAH_DAY;
          miniMapCtx.fillRect(x * miniTile, y * miniTile, miniTile, miniTile);
        }
      }
      entities.forEach(e => {
        miniMapCtx.fillStyle = COLORS[e.type];
        miniMapCtx.fillRect(e.x * miniTile, e.y * miniTile, miniTile, miniTile);
      });
    }

    function drawShelterInterior() {
      shelterCtx.clearRect(0, 0, shelterCanvas.width, shelterCanvas.height);
      shelterCtx.fillStyle = COLORS.INTERIOR_FLOOR;
      shelterCtx.fillRect(0, 0, shelterCanvas.width, shelterCanvas.height);
      shelterCtx.fillStyle = COLORS.INTERIOR_WALL;
      const wallThickness = 20;
      shelterCtx.fillRect(0, 0, shelterCanvas.width, wallThickness);
      shelterCtx.fillRect(0, shelterCanvas.height - wallThickness, shelterCanvas.width, wallThickness);
      shelterCtx.fillRect(0, 0, wallThickness, shelterCanvas.height);
      shelterCtx.fillRect(shelterCanvas.width - wallThickness, 0, wallThickness, shelterCanvas.height);
      shelterCtx.fillStyle = COLORS.INTERIOR_SURVIVOR;
      const survivorSize = SHELTER_INTERIOR_SIZE * (1 + 0.2 * (shelter.level - 1));
      shelterCtx.fillRect(shelterCanvas.width / 2 - survivorSize / 2, shelterCanvas.height / 2 - survivorSize / 2, survivorSize, survivorSize);
      if (shelter.fire) {
        const flicker = Math.random() > 0.5 ? COLORS.INTERIOR_FIRE : '#ffdd59';
        shelterCtx.fillStyle = flicker;
        const fireSize = SHELTER_INTERIOR_SIZE * 1.5;
        shelterCtx.fillRect(shelterCanvas.width / 2 + 50, shelterCanvas.height / 2, fireSize, fireSize);
      }
    }

    function update() {
      if (isPaused) return;
      for (let i = 0; i < speedMultiplier; i++) {
        globalTime++;
        dayCycle += (cycleSpeed / 1000);
        if (dayCycle >= 1) dayCycle = 0;
        isDay = dayCycle < 0.5;
        temperature = isDay ? 15 - 10 * Math.sin(globalTime / 100 * Math.PI) : -5 - 10 * Math.sin(globalTime / 100 * Math.PI);
        updateSeason();

        if (globalTime % 100 === 0) {
          const rand = Math.random();
          if (rand < 0.3) weather = 'cerah';
          else if (rand < 0.6) weather = 'hujan';
          else weather = 'salju';
          logActivity(`Cuaca berubah menjadi ${weather}.`, true);
        }

    if (globalTime % 240 === 0) survivalDays++;
    if (survivor) {
      survivor.updateStatus();
      survivor.updateAI();
    }
    entities = entities.filter(e => {
      if (typeof e.update === 'function') e.update();
      if (e.type === 'API') {
        if (e.lifespan !== undefined && e.lifespan <= 0) {
          logActivity('Api unggun telah padam.');
          return false;
        }
      }
      return true;
    });

    regenerateResources();
    updateEvents();
      }
    }

    function gameLoop() {
      update();
      draw();
      updateUI();
    }

    function setupAndStartGame() {
      if (gameLoopInterval) clearInterval(gameLoopInterval);

      const logContainer = document.getElementById('activity-log') as HTMLElement;
      if (logContainer) logContainer.innerHTML = '<p>Menciptakan dunia baru...</p>';
      globalTime = 0;
      survivalDays = 0;
      dayCycle = 0;
      weather = 'cerah';
      season = 0;
      score = 0;
      const cycleSpeedInput = document.getElementById('cycle-speed') as HTMLInputElement;
      if (cycleSpeedInput) cycleSpeed = parseInt(cycleSpeedInput.value);
      const aiIntelligenceInput = document.getElementById('ai-intelligence') as HTMLInputElement;
      if (aiIntelligenceInput) aiIntelligence = parseInt(aiIntelligenceInput.value);
      inShelter = false;
      isPaused = false;
      speedMultiplier = 1;
      if (canvas) canvas.style.display = 'block';
      if (miniMapCanvas) miniMapCanvas.style.display = 'block';
      if (shelterCanvas) shelterCanvas.style.display = 'none';

      const petaSizeInput = document.getElementById('peta-size') as HTMLInputElement;
      if (petaSizeInput) mapSize = parseInt(petaSizeInput.value);
      if (canvas) canvas.width = mapSize * TILE_SIZE;
      if (shelterCanvas) shelterCanvas.width = canvas.width;
      if (miniMapCanvas) miniMapCanvas.width = 200; // Fixed size
      if (miniMapCanvas) miniMapCanvas.height = (mapHeight / mapSize) * 200;
      mapHeight = Math.floor(canvas.height / TILE_SIZE);

      generateMap();
      placeEntities();

      logActivity('Seorang survivor terdampar di tengah taiga. Bertahanlah!', true);

      gameLoopInterval = setInterval(gameLoop, 300 / speedMultiplier);
    }

    function togglePause() {
      isPaused = !isPaused;
      const pauseButton = document.getElementById('pause-btn') as HTMLButtonElement;
      if (pauseButton) pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
    }

    function toggleFF() {
      speedMultiplier = speedMultiplier === 1 ? 2 : 1;
      const ffButton = document.getElementById('ff-btn') as HTMLButtonElement;
      if (ffButton) ffButton.textContent = `Fast Forward (x${speedMultiplier})`;
      if (gameLoopInterval) clearInterval(gameLoopInterval);
      gameLoopInterval = setInterval(gameLoop, 300 / speedMultiplier);
    }

    function exportLog() {
      const logContainer = document.getElementById('activity-log') as HTMLElement;
      if (!logContainer) return;
      const logText = Array.from(logContainer.querySelectorAll('p')).map(p => p.textContent).join('\n');
      const blob = new Blob([logText], {type: 'text/plain'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'survival_log.txt';
      a.click();
      URL.revokeObjectURL(url);
    }

    function getRandomInt(max: number) {
      return Math.floor(Math.random() * max);
    }

    // Event listeners
    if (startButton) startButton.addEventListener('click', setupAndStartGame);
    if (pauseButton) pauseButton.addEventListener('click', togglePause);
    if (ffButton) ffButton.addEventListener('click', toggleFF);
    if (exportButton) exportButton.addEventListener('click', exportLog);
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />
  );
}
