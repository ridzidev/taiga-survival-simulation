"use client";

import { useEffect, useRef } from "react";

export default function SurvivalSimulation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    // Inject styles
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap');
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { background: #0f0f23; color: #e0e0e0; font-family: 'Roboto Mono', monospace; }
      #container { display: flex; height: 100vh; gap: 8px; padding: 8px; background: #0f0f23; }
      #left-panel { width: 220px; display: flex; flex-direction: column; gap: 8px; overflow-y: auto; }
      #right-panel { flex: 1; display: flex; flex-direction: column; gap: 8px; }
      .panel { background: #1a1a2e; border: 1px solid #333; border-radius: 6px; padding: 8px; }
      .stat-row { display: flex; justify-content: space-between; font-size: 12px; margin: 3px 0; }
      .stat-bar { height: 6px; background: #333; border-radius: 2px; overflow: hidden; margin: 2px 0; }
      .bar-fill { height: 100%; transition: width 0.2s; }
      #gameCanvas { width: 100%; height: 100%; image-rendering: pixelated; }
      button { background: #333; border: 1px solid #555; color: #e0e0e0; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold; }
      button:hover { background: #444; }
      input { background: #2a2a3e; border: 1px solid #444; color: #e0e0e0; padding: 4px; border-radius: 3px; font-size: 11px; }
      h3 { font-size: 13px; color: #ffb700; margin-bottom: 6px; }
      #log { height: 150px; overflow-y: auto; background: #000; padding: 6px; border-radius: 3px; font-size: 10px; line-height: 1.3; }
      .log-entry { color: #888; margin: 2px 0; }
      .log-entry.important { color: #ffb700; }
      #canvas-wrapper { display: flex; align-items: center; justify-content: center; flex: 1; background: #000; border: 1px solid #333; border-radius: 6px; overflow: hidden; }
      #gameCanvas, #shelter-canvas { display: block; max-width: 100%; max-height: 100%; image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges; }
    `;
    document.head.appendChild(style);

    containerRef.current.innerHTML = `
<div id="container">
  <div id="left-panel">
    <div class="panel">
      <h3>⚡ TAIGA SURVIVAL</h3>
      <div class="stat-row"><span>Day:</span><span id="day-display">0</span></div>
      <div class="stat-row"><span>Score:</span><span id="score-display">0</span></div>
      <div class="stat-row"><span>Temp:</span><span id="temp-display">15°C</span></div>
      <div class="stat-row"><span>Weather:</span><span id="weather-display">cerah</span></div>
    </div>

    <div class="panel">
      <h3>📊 STATS</h3>
      <div class="stat-row"><span>Warmth</span><span id="warmth-val">100</span></div>
      <div class="stat-bar"><div id="warmth-bar" class="bar-fill" style="background: #ff6b6b; width: 100%;"></div></div>
      <div class="stat-row"><span>Hunger</span><span id="hunger-val">100</span></div>
      <div class="stat-bar"><div id="hunger-bar" class="bar-fill" style="background: #ffd93d; width: 100%;"></div></div>
      <div class="stat-row"><span>Thirst</span><span id="thirst-val">100</span></div>
      <div class="stat-bar"><div id="thirst-bar" class="bar-fill" style="background: #00d4ff; width: 100%;"></div></div>
      <div class="stat-row"><span>Health</span><span id="health-val">100</span></div>
      <div class="stat-bar"><div id="health-bar" class="bar-fill" style="background: #4caf50; width: 100%;"></div></div>
    </div>

    <div class="panel">
      <h3>🎒 INVENTORY</h3>
      <div class="stat-row"><span>Wood</span><span id="inv-wood">0</span></div>
      <div class="stat-row"><span>Stone</span><span id="inv-stone">0</span></div>
      <div class="stat-row"><span>Food</span><span id="inv-food">0</span></div>
      <div class="stat-row"><span>Fur</span><span id="inv-fur">0</span></div>
      <div class="stat-row"><span>Thread</span><span id="inv-thread">0</span></div>
      <div class="stat-row"><span>Water</span><span id="inv-water">0</span></div>
      <div class="stat-row"><span>Shelter Lvl</span><span id="inv-shelterlevel">0</span></div>
    </div>

    <div class="panel">
      <h3>🌍 RESOURCES</h3>
      <div class="stat-row"><span>Trees</span><span id="res-pohon" style="color: #4caf50;">0</span></div>
      <div class="stat-row"><span>Stones</span><span id="res-batu" style="color: #999;">0</span></div>
      <div class="stat-row"><span>Animals</span><span id="res-hewan" style="color: #ffc107;">0</span></div>
      <div class="stat-row"><span>Predators</span><span id="res-predator" style="color: #f44336;">0</span></div>
    </div>

    <div class="panel">
      <h3>🎮 CONTROLS</h3>
      <button id="start-sim" style="width: 100%; margin-bottom: 6px;">START/RESET</button>
      <button id="pause-btn" style="width: 48%; margin-right: 4%;">PAUSE</button>
      <button id="ff-btn" style="width: 48%;">2x</button>
      <button id="export-log" style="width: 100%; margin-top: 6px;">EXPORT LOG</button>
    </div>

    <div class="panel">
      <h3>⚙️ PARAMS</h3>
      <label>Map Size</label><input id="peta-size" type="number" value="40" style="width: 100%; margin-bottom: 4px;">
      <label>Speed</label><input id="cycle-speed" type="number" value="5" min="1" max="10" style="width: 100%; margin-bottom: 4px;">
      <label>Trees</label><input id="pohon-count" type="number" value="60" style="width: 100%; margin-bottom: 4px;">
      <label>Animals</label><input id="hewan-count" type="number" value="10" style="width: 100%; margin-bottom: 4px;">
      <label>Stones</label><input id="batu-count" type="number" value="30" style="width: 100%; margin-bottom: 4px;">
      <label>Predators</label><input id="predator-count" type="number" value="3" style="width: 100%;">
    </div>

    <div class="panel" style="flex: 1; min-height: 150px;">
      <h3>📝 LOG</h3>
      <div id="log" style="flex: 1;"></div>
    </div>
  </div>

  <div id="right-panel">
    <div id="canvas-wrapper">
      <canvas id="gameCanvas"></canvas>
      <canvas id="shelter-canvas" style="display: none;"></canvas>
    </div>
  </div>
</div>
`;

    // Setup
    const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    const shelterCanvas = document.getElementById(
      "shelter-canvas"
    ) as HTMLCanvasElement;
    const shelterCtx = shelterCanvas.getContext("2d")!;
    const logContainer = document.getElementById("log") as HTMLDivElement;

    const startButton = document.getElementById(
      "start-sim"
    ) as HTMLButtonElement;
    const pauseButton = document.getElementById(
      "pause-btn"
    ) as HTMLButtonElement;
    const ffButton = document.getElementById("ff-btn") as HTMLButtonElement;
    const exportButton = document.getElementById(
      "export-log"
    ) as HTMLButtonElement;
    const TILE_SIZE = 12;
    const COLORS: { [key: string]: string } = {
      SURVIVOR: "#ff4757",
      POHON: "#2ecc71",
      BATU: "#95a5a6",
      HEWAN: "#f39c12",
      PREDATOR: "#e74c3c",
      SHELTER: "#9b59b6",
      TANAH_DAY: "#8b7355",
      TANAH_NIGHT: "#3a3a4a",
      AIR_DAY: "#3498db",
      AIR_NIGHT: "#1e4a7a",
      API: "#ff9500",
    };

    // Load survivor sprite
    let survivorSprite: HTMLImageElement | null = null;
    const SPRITE_PATH = "/game_assets/survivor/survivor.png"; // Update this path when you have the new sprite
    const survivorImg = new Image();
    survivorImg.onload = () => {
      survivorSprite = survivorImg;
      console.log("Survivor sprite loaded successfully");
    };
    survivorImg.onerror = () => {
      console.warn(
        `Failed to load sprite from ${SPRITE_PATH}, using colored fallback`
      );
    };
    survivorImg.src = SPRITE_PATH;
    let mapSize: number = 60,
      mapHeight: number = 42;
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
    let weather = "cerah";
    let inShelter = false;
    let season = 0; // 0: semi, 1: panas, 2: gugur, 3: dingin
    let score = 0;
    let aiIntelligence = 5;
    // Desired thresholds AI will try to maintain
    const DESIRED = {
      hunger: 50,
      thirst: 70,
      warmth: 85,
      health: 80,
    };
    let isPaused = false;
    let speedMultiplier = 1;
    let lastFireTime = 0;
    let audioCtx = new (window.AudioContext ||
      (window as any).webkitAudioContext)();

    function playSound(frequency: number, duration: number) {
      const oscillator = audioCtx.createOscillator();
      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      oscillator.connect(audioCtx.destination);
      oscillator.start();
      setTimeout(() => oscillator.stop(), duration);
    }
    function logActivity(message: string, isImportant = false) {
      if (!logContainer) return;
      const entry = document.createElement("div");
      entry.className = `log-entry ${isImportant ? "important" : ""}`;
      entry.textContent = `[D${survivalDays}] ${message}`;
      logContainer.appendChild(entry);

      const entries = logContainer.querySelectorAll(".log-entry");
      if (entries.length > 8) entries[0].remove();
      logContainer.scrollTop = logContainer.scrollHeight;
    }

    // Show a game-over alert and offer restart to make the death feel more impactful
    function showGameOverAlert(message: string) {
      // Delay to ensure UI/log has updated before the blocking confirm
      setTimeout(() => {
        try {
          const restart = window.confirm(message + "\n\nMau coba lagi?");
          if (restart) {
            setupAndStartGame();
          }
        } catch (e) {
          // In case alert/confirm are not available (non-browser env), just log
          console.warn("Game over dialog failed:", e);
        }
      }, 50);
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
        super(x, y, "API");
        this.lifespan = isIndoor ? 500 : 250;
        this.update = () => {
          this.lifespan--;
          if (weather === "hujan" && !this.isIndoor) this.lifespan -= 2;
        };
      }
      lifespan: number;
    }

    class Animal extends Entity {
      constructor(x: number, y: number, type = "HEWAN") {
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
          if (
            this.type === "PREDATOR" &&
            survivor &&
            survivor.health > 0 &&
            !inShelter &&
            Math.abs(this.x - survivor.x) + Math.abs(this.y - survivor.y) <=
              1 &&
            Math.random() < 0.05
          ) {
            survivor.health -= survivor.inventory.spear ? 5 : 10;
            logActivity("Binatang buas menyerang survivor!", true);
          } else if (
            survivor &&
            Math.abs(this.x - survivor.x) + Math.abs(this.y - survivor.y) < 5 &&
            Math.random() < 0.2
          ) {
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
        return (
          x >= 0 &&
          x < mapSize &&
          y >= 0 &&
          y < mapHeight &&
          grid[y][x] !== "AIR"
        );
      }
    }

    class Trap extends Entity {
      constructor(x: number, y: number) {
        super(x, y, "TRAP");
        this.active = true;
        this.update = () => {
          if (this.active && Math.random() < 0.1) {
            survivor.inventory.food += 1;
            logActivity("Perangkap menangkap hewan! +1 makanan.");
            this.active = false; // Need repair after catch
          }
        };
      }
      active: boolean;
    }

    class Shelter extends Entity {
      constructor(x: number, y: number) {
        super(x, y, "SHELTER");
        this.level = 1;
        this.fire = null;
        this.update = () => {
          if (this.fire) {
            const fire = this.fire;
            fire.update();
            if (fire.lifespan <= 0) {
              this.fire = null;
              logActivity("Api di shelter padam.");
            }
          }
        };
      }
      level: number;
      fire: Fire | null;
    }

    class Survivor extends Entity {
      constructor(x: number, y: number) {
        super(x, y, "SURVIVOR");
        this.health = 100;
        this.warmth = 100;
        this.hunger = 100;
        this.thirst = 100;
        this.inventory = {
          wood: 5,
          stone: 0,
          food: 0,
          fur: 0,
          thread: 0,
          fishingrod: 0,
          furcoat: 0,
          spear: 0,
          trap: 0,
          water: 0,
        };
        this.task = "bertahan hidup";
        this.target = null;
        this.hasShelter = false;
        this.home = null;
        this.wearingFurCoat = false;
        this.lastFireTime = 0;
        this.activityTimer = 0;
        this.plan = [];
        this.planAdvance = false;
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
      activityTimer: number;
      plan: string[];
      planAdvance: boolean;

      // 2. updateAI() – Tambah satu baris biar malam langsung pulang (double protection)
      updateAI() {
        if (this.health <= 0) return;

        // DOUBLE PROTECTION: MALAM + PUNYA SHELTER = LANGSUNG PULANG, NGGAK BOLEH ADA PLAN LAIN
        if (!isDay && this.hasShelter && !inShelter) {
          this.task = "pulang ke shelter";
          this.performTask();
          return;
        }

        // Warmth kritis → langsung pulang / bikin api
        if (this.warmth < 55 && this.hasShelter && !inShelter) {
          this.task = "pulang ke shelter";
          this.performTask();
          return;
        }

        // Plan kosong? Buat baru
        if (!this.plan || this.plan.length === 0) {
          this.buildPlan();
        }

        // Eksekusi plan normal
        if (this.plan.length > 0) {
          this.task = this.plan[0];
          this.planAdvance = false;
          this.performTask();
          if (this.planAdvance) this.plan.shift();
          return;
        }

        this.task = inShelter ? "istirahat" : "mengembara";
        this.performTask();
      }

      findNearest(type: string): Entity | null {
        let closest: Entity | null = null;
        let minDistance = Infinity;
        entities.forEach((e) => {
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

      findNearestWater(): { x: number; y: number } | null {
        let closestX: number | null = null,
          closestY: number | null = null;
        let minDistance = Infinity;
        for (let y = 0; y < mapHeight; y++) {
          for (let x = 0; x < mapSize; x++) {
            if (grid[y][x] === "AIR") {
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
          return { x: closestX, y: closestY };
        }
        return null;
      }

      pathfind(target: any): { x: number; y: number } | null {
        if (!target) return null;
        const typedTarget = target as { x: number; y: number };
        const queue: Array<{
          x: number;
          y: number;
          path: Array<{ x: number; y: number }>;
        }> = [{ x: this.x, y: this.y, path: [] }];
        const visited = new Set();
        visited.add(`${this.x},${this.y}`);
        while (queue.length > 0) {
          const { x, y, path } = queue.shift()!;
          if (x === typedTarget.x && y === typedTarget.y)
            return path.length > 0 ? path[0] : null; // Return first move or null if already there
          const dirs = [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0],
          ];
          for (let [dx, dy] of dirs) {
            const nx = x + dx,
              ny = y + dy;
            if (
              nx >= 0 &&
              nx < mapSize &&
              ny >= 0 &&
              ny < mapHeight &&
              grid[ny][nx] !== "AIR" &&
              !visited.has(`${nx},${ny}`)
            ) {
              visited.add(`${nx},${ny}`);
              queue.push({ x: nx, y: ny, path: [...path, { x: dx, y: dy }] });
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
        return (
          x >= 0 &&
          x < mapSize &&
          y >= 0 &&
          y < mapHeight &&
          grid[y][x] !== "AIR"
        );
      }

      performTask() {
        if (this.target && !entities.includes(this.target)) this.target = null;

        switch (this.task) {
          case "mencari kayu":
            if (!this.target || this.target.type !== "POHON")
              this.target = this.findNearest("POHON");
            if (this.target)
              this.executeMoveAndAction("POHON", "wood", "menebang pohon");
            else this.wander();
            break;
          case "berburu":
            if (!this.target || this.target.type !== "HEWAN")
              this.target = this.findNearest("HEWAN");
            if (this.target) {
              if (
                Math.abs(this.x - this.target.x) <= 1 &&
                Math.abs(this.y - this.target.y) <= 1
              ) {
                const success = this.inventory.spear ? 0.8 : 0.5;
                if (Math.random() < success) {
                  this.inventory.food++;
                  this.inventory.fur++;
                  entities = entities.filter((e) => e.id !== this.target.id);
                  logActivity(
                    "Survivor berhasil berburu dan mendapatkan makanan serta bulu."
                  );
                } else {
                  logActivity("Survivor gagal berburu.");
                }
                this.target = null;
              } else {
                this.moveTo(this.target);
              }
            } else this.wander();
            break;
          case "mencari batu":
            if (!this.target || this.target.type !== "BATU")
              this.target = this.findNearest("BATU");
            if (this.target)
              this.executeMoveAndAction("BATU", "stone", "menambang batu");
            else this.wander();
            break;
          case "memancing":
            this.target = this.findNearestWater();
            if (
              this.target &&
              typeof this.target === "object" &&
              "x" in this.target &&
              "y" in this.target &&
              typeof this.target.x === "number" &&
              typeof this.target.y === "number" &&
              Math.abs(this.x - this.target.x) <= 1 &&
              Math.abs(this.y - this.target.y) <= 1
            ) {
              if (Math.random() < 0.3) {
                this.inventory.food += 2;
                this.planAdvance = true;
                logActivity("Survivor berhasil memancing ikan!");
              } else {
                this.planAdvance = true; // attempt counts as progress
                logActivity("Survivor mencoba memancing tapi gagal.");
              }
              this.target = null;
            } else {
              this.moveTo(this.target);
            }
            break;
          case "ambil air":
            this.target = this.findNearestWater();
            if (
              this.target &&
              typeof this.target === "object" &&
              "x" in this.target &&
              "y" in this.target &&
              typeof this.target.x === "number" &&
              typeof this.target.y === "number" &&
              Math.abs(this.x - this.target.x) <= 1 &&
              Math.abs(this.y - this.target.y) <= 1
            ) {
              this.inventory.water += 2;
              this.planAdvance = true;
              logActivity("Survivor mengambil air dari sungai.");
              this.target = null;
            } else {
              this.moveTo(this.target);
            }
            break;
          case "membuat api":
            if (this.inventory.wood > 0) {
              this.inventory.wood -= 1;
              entities.push(new Fire(this.x, this.y));
              this.lastFireTime = globalTime;
              this.planAdvance = true;
              logActivity(
                "Survivor membuat api unggun untuk menghangatkan diri.",
                true
              );
            }
            this.task = "bertahan hidup";
            break;
          case "membuat api di shelter":
            if (this.inventory.wood > 0) {
              this.inventory.wood -= 1;
              shelter.fire = new Fire(shelter.x, shelter.y, true);
              this.planAdvance = true;
              logActivity("Survivor membuat api di dalam shelter.", true);
            }
            this.task = "istirahat";
            break;
          case "makan":
            if (this.inventory.food > 0) {
              this.inventory.food -= 1;
              this.hunger = Math.min(100, this.hunger + 50);
              this.planAdvance = true;
              logActivity("Survivor memakan hasil buruannya.", true);
            }
            this.task = inShelter ? "istirahat" : "bertahan hidup";
            break;
          case "minum":
            if (this.inventory.water > 0) {
              this.inventory.water -= 1;
              this.thirst = Math.min(100, this.thirst + 50);
              this.planAdvance = true;
              logActivity("Survivor minum air.", true);
            }
            this.task = inShelter ? "istirahat" : "bertahan hidup";
            break;
          case "bangun shelter":
            if (this.inventory.wood >= 10 && this.inventory.stone >= 5) {
              this.inventory.wood -= 10;
              this.inventory.stone -= 5;
              shelter = new Shelter(this.x, this.y);
              entities.push(shelter);
              this.hasShelter = true;
              this.home = { x: this.x, y: this.y };
              this.planAdvance = true;
              logActivity("Survivor membangun shelter!", true);
            }
            this.task = "bertahan hidup";
            break;
          case "upgrade shelter":
            this.inventory.wood -= 10 * shelter.level;
            this.inventory.stone -= 5 * shelter.level;
            shelter.level++;
            logActivity(
              `Survivor mengupgrade shelter ke level ${shelter.level}.`,
              true
            );
            this.task = "istirahat";
            break;
          case "buat benang":
            this.inventory.fur -= 3;
            this.inventory.thread += 5;
            logActivity("Survivor membuat benang dari bulu.", true);
            this.task = "istirahat";
            break;
          case "buat pancing":
            this.inventory.thread -= 2;
            this.inventory.stone -= 1;
            this.inventory.fishingrod = 1;
            logActivity("Survivor membuat pancing.", true);
            this.task = "istirahat";
            break;
          case "buat baju bulu":
            this.inventory.fur -= 5;
            this.inventory.furcoat = 1;
            this.wearingFurCoat = true;
            logActivity(
              "Survivor membuat baju bulu untuk kehangatan ekstra.",
              true
            );
            this.task = "istirahat";
            break;
          case "buat tombak":
            this.inventory.wood -= 5;
            this.inventory.stone -= 2;
            this.inventory.spear = 1;
            logActivity("Survivor membuat tombak.", true);
            this.task = "istirahat";
            break;
          case "buat perangkap":
            this.inventory.wood -= 3;
            this.inventory.thread -= 2;
            this.inventory.trap += 1;
            entities.push(new Trap(this.x, this.y));
            logActivity("Survivor membuat perangkap.", true);
            this.task = "istirahat";
            break;
          case "pulang ke shelter":
            this.target = this.home;
            if (
              this.target &&
              typeof this.target === "object" &&
              "x" in this.target &&
              "y" in this.target &&
              typeof this.target.x === "number" &&
              typeof this.target.y === "number" &&
              Math.abs(this.x - this.target.x) <= 1 &&
              Math.abs(this.y - this.target.y) <= 1
            ) {
              inShelter = true;
              canvas.style.display = "none";
              shelterCanvas.style.display = "block";
              this.planAdvance = true;
              logActivity("Survivor masuk ke shelter.", true);
              this.task = "istirahat";
            } else {
              this.moveTo(this.target);
            }
            break;
          case "mengembara":
            if (Math.random() < 0.1)
              logActivity("Survivor mengamati sekitar...");
            this.wander();
            break;
          case "istirahat":
            // Di dalam shelter = otomatis jaga diri sendiri
            if (
              this.warmth < 75 &&
              this.inventory.wood > 0 &&
              shelter &&
              (!shelter.fire || shelter.fire.lifespan < 80)
            ) {
              this.task = "membuat api di shelter";
            } else if (this.hunger < 75 && this.inventory.food > 0) {
              this.task = "makan di shelter";
            } else if (this.thirst < 75 && this.inventory.water > 0) {
              this.task = "minum di shelter";
            } else if (this.health < 90) {
              this.task = "tidur";
            } else if (Math.random() < 0.35 && this.inventory.food >= 3) {
              this.task = "memasak";
            } else {
              this.task = "bersantai";
            }
            this.performTask(); // eksekusi task baru (rekursif sekali, aman)
            break;
          case "tidur":
            this.health = Math.min(100, this.health + 1.5);
            this.warmth = Math.min(100, this.warmth + 0.8);
            if (this.health >= 95) {
              logActivity("Survivor terbangun dari tidur.", true);
              this.task = "istirahat";
            }
            break;

          case "makan di shelter":
            if (this.inventory.food > 0) {
              this.inventory.food--;
              this.hunger = Math.min(100, this.hunger + 60);
              logActivity("Survivor makan makanan hangat di shelter. 😋");
              this.task = "istirahat";
            }
            break;

          case "minum di shelter":
            if (this.inventory.water > 0) {
              this.inventory.water--;
              this.thirst = Math.min(100, this.thirst + 60);
              logActivity("Survivor minum air hangat dari wadah. 💧");
              this.task = "istirahat";
            }
            break;

          case "membuat api di shelter":
            if (this.inventory.wood > 0) {
              this.inventory.wood--;
              shelter.fire = new Fire(shelter.x, shelter.y, true);
              logActivity("Survivor membuat api untuk kehangatan. 🔥", true);
              this.task = "istirahat";
            }
            break;

          case "memasak":
            // Simulating cooking/preparing food
            if (this.inventory.food >= 1) {
              this.inventory.food = Math.min(this.inventory.food + 2, 20);
              logActivity("Survivor memasak makanan lezat di atas api. 🍳");
              this.task = "istirahat";
            }
            break;

          case "bersantai":
            this.health = Math.min(100, this.health + 0.3);
            this.activityTimer++;

            // Change activity every 60-120 frames
            if (this.activityTimer > 60 + Math.random() * 60) {
              this.activityTimer = 0;
              if (Math.random() < 0.2) {
                const activities = [
                  "Survivor mengamati api",
                  "Survivor merapikan barang",
                  "Survivor memeriksa perbekalan",
                  "Survivor berjalan santai",
                ];
                logActivity(
                  activities[Math.floor(Math.random() * activities.length)] +
                    "..."
                );
              }
            }

            if (isDay && Math.random() < 0.02) {
              inShelter = false;
              canvas.style.display = "block";
              shelterCanvas.style.display = "none";
              logActivity("Survivor keluar dari shelter.", true);
              this.task = "bertahan hidup";
            }
            // Switch activity after random time
            if (Math.random() < 0.08) this.task = "istirahat";
        }
      }

      // Build a plan using RESOURCE BALANCE strategy with nearby resource gathering
      // 1. buildPlan() – VERSI AMAN 2025 (nggak akan keluyuran malam!)
      buildPlan() {
        this.plan = [];

        // ========== DARURAT PALING ATAS (override semua) ==========
        if (this.thirst < 45) {
          this.plan.push(this.inventory.water > 0 ? "minum" : "ambil air");
          return;
        }
        if (this.hunger < 45) {
          this.plan.push(
            this.inventory.food > 0
              ? "makan"
              : this.inventory.fishingrod
              ? "memancing"
              : "berburu"
          );
          return;
        }

        // MALAM HARI + PUNYA SHELTER = PULANG DULU, NGGAK PEDULI APA PUN!
        if (!isDay && this.hasShelter && !inShelter) {
          this.plan.push("pulang ke shelter");
          return;
        }

        // Kalo warmth udah bahaya → langsung pulang / bikin api, nggak peduli target stok
        if (this.warmth < 55) {
          if (this.hasShelter) {
            this.plan.push("pulang ke shelter");
          } else if (this.inventory.wood > 0) {
            this.plan.push("membuat api");
          } else {
            this.plan.push("mencari kayu");
          }
          return;
        }

        // Belum punya shelter → fokus bangun
        if (!this.hasShelter) {
          if (this.inventory.wood >= 10 && this.inventory.stone >= 5) {
            this.plan.push("bangun shelter");
          } else if (this.inventory.wood < 10) {
            this.plan.push("mencari kayu");
          } else {
            this.plan.push("mencari batu");
          }
          return;
        }

        // SUDAH AMAN DI SHELTER + SIANG HARI → baru boleh stok barang
        if (!isDay) {
          // Malam hari cuma boleh istirahat atau bikin api kalo dingin
          return;
        }

        // Stok barang cuma dilakukan saat SIANG + warmth aman
        const target = {
          food: 20,
          water: 12,
          wood: season === 3 ? 70 : 30,
          fur: 12,
        };

        const deficits = [
          {
            cur: this.inventory.water,
            tgt: target.water,
            task: "ambil air",
            prio: 18,
          },
          {
            cur: this.inventory.food,
            tgt: target.food,
            task: this.inventory.fishingrod ? "memancing" : "berburu",
            prio: 14,
          },
          {
            cur: this.inventory.wood,
            tgt: target.wood,
            task: "mencari kayu",
            prio: season === 3 ? 25 : 10,
          },
          {
            cur: this.inventory.fur,
            tgt: target.fur,
            task: "berburu",
            prio: 7,
          },
        ];

        let worst = deficits[0];
        for (const d of deficits) {
          if ((d.tgt - d.cur) * d.prio > (worst.tgt - worst.cur) * worst.prio)
            worst = d;
        }

        this.plan.push(worst.task);

        // Crafting otomatis kalo stok udah aman
        if (
          !this.inventory.fishingrod &&
          this.inventory.thread >= 2 &&
          this.inventory.stone >= 1
        ) {
          this.plan.push("buat pancing");
        } else if (!this.wearingFurCoat && this.inventory.fur >= 5) {
          this.plan.push("buat baju bulu");
        } else if (
          !this.inventory.spear &&
          this.inventory.wood >= 5 &&
          this.inventory.stone >= 2
        ) {
          this.plan.push("buat tombak");
        } else if (this.inventory.wood >= 20 && this.inventory.stone >= 10) {
          this.plan.push("upgrade shelter");
        }
      }

      executeMoveAndAction(
        targetType: string,
        inventoryItem: string,
        logMsg: string
      ) {
        if (
          this.target &&
          typeof this.target === "object" &&
          "x" in this.target &&
          "y" in this.target &&
          typeof this.target.x === "number" &&
          typeof this.target.y === "number" &&
          Math.abs(this.x - this.target.x) <= 1 &&
          Math.abs(this.y - this.target.y) <= 1
        ) {
          this.inventory[inventoryItem]++;
          entities = entities.filter((e) => e.id !== this.target.id);
          this.target = null;
          this.planAdvance = true;
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
          const fire = this.findNearest("API");
          fireDistance = fire
            ? Math.abs(this.x - fire.x) + Math.abs(this.y - fire.y)
            : Infinity;
        }

        let tempDrop = 0.05 * (15 - temperature);
        if (!isDay) tempDrop *= 1.5;
        if (weather === "salju") tempDrop *= 2;
        if (weather === "hujan") tempDrop *= 1.2;
        if (this.wearingFurCoat) tempDrop *= 0.6;
        if (inShelter) tempDrop *= 1 - 0.3 * shelter.level;
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

        // Immediate death if any core stat reaches zero
        if (this.warmth <= 0) {
          const msg = "Survivor meninggal karena kedinginan... Game over!";
          logActivity(msg, true);
          checkAchievements();
          if (gameLoopInterval) clearInterval(gameLoopInterval);
          gameLoopInterval = null;
          showGameOverAlert(msg);
          return;
        }
        if (this.hunger <= 0) {
          const msg = "Survivor meninggal karena kelaparan... Game over!";
          logActivity(msg, true);
          checkAchievements();
          if (gameLoopInterval) clearInterval(gameLoopInterval);
          gameLoopInterval = null;
          showGameOverAlert(msg);
          return;
        }
        if (this.thirst <= 0) {
          const msg = "Survivor meninggal karena kehausan... Game over!";
          logActivity(msg, true);
          checkAchievements();
          if (gameLoopInterval) clearInterval(gameLoopInterval);
          gameLoopInterval = null;
          showGameOverAlert(msg);
          return;
        }

        // If health drops to zero by other means, also end the game
        if (this.health <= 0) {
          const msg =
            "Survivor tidak dapat bertahan dari kerasnya alam... Game over!";
          logActivity(msg, true);
          checkAchievements();
          if (gameLoopInterval) clearInterval(gameLoopInterval);
          gameLoopInterval = null;
          showGameOverAlert(msg);
          return;
        }
      }
    }

    function generateMap() {
      grid = [];
      mapHeight = Math.floor(canvas.height / TILE_SIZE);
      for (let y = 0; y < mapHeight; y++) {
        const row = new Array(mapSize).fill("TANAH");
        grid.push(row);
      }
      const waterBodies = getRandomInt(3) + 1;
      for (let i = 0; i < waterBodies; i++) {
        const waterStartX = getRandomInt(mapSize);
        const waterStartY = getRandomInt(mapHeight);
        const waterWidth = getRandomInt(10) + 5;
        const waterHeight = getRandomInt(10) + 5;
        for (
          let y = waterStartY;
          y < Math.min(waterStartY + waterHeight, mapHeight);
          y++
        ) {
          for (
            let x = waterStartX;
            x < Math.min(waterStartX + waterWidth, mapSize);
            x++
          ) {
            grid[y][x] = "AIR";
          }
        }
      }
    }

    function placeEntities() {
      entities = [];
      const numPohon = parseInt(
        (document.getElementById("pohon-count") as HTMLInputElement).value
      );
      const numBatu = parseInt(
        (document.getElementById("batu-count") as HTMLInputElement).value
      );
      const numHewan = parseInt(
        (document.getElementById("hewan-count") as HTMLInputElement).value
      );
      const numPredator = parseInt(
        (document.getElementById("predator-count") as HTMLInputElement).value
      );

      const placeObject = (
        count: number,
        type: string,
        Class: any = Entity
      ) => {
        for (let i = 0; i < count; i++) {
          let x, y;
          do {
            x = getRandomInt(mapSize);
            y = getRandomInt(mapHeight);
          } while (grid[y][x] === "AIR");
          entities.push(new Class(x, y, type));
        }
      };

      placeObject(numPohon, "POHON");
      placeObject(numBatu, "BATU");
      placeObject(numHewan, "HEWAN", Animal);
      placeObject(numPredator, "PREDATOR", Animal);

      let sx, sy;
      do {
        sx = getRandomInt(mapSize);
        sy = getRandomInt(mapHeight);
      } while (grid[sy][sx] === "AIR");
      survivor = new Survivor(sx, sy);
      entities.push(survivor);
    }

    function regenerateResources() {
      if (globalTime % 240 === 0) {
        // Setiap hari
        if (Math.random() < 0.5)
          entities.push(
            new Entity(getRandomInt(mapSize), getRandomInt(mapHeight), "POHON")
          );
        if (Math.random() < 0.3)
          entities.push(
            new Entity(getRandomInt(mapSize), getRandomInt(mapHeight), "BATU")
          );
        if (countEntities("HEWAN") < 5)
          entities.push(
            new Animal(getRandomInt(mapSize), getRandomInt(mapHeight), "HEWAN")
          );
      }
    }

    function countEntities(type: string) {
      return entities.filter((e) => e.type === type).length;
    }

    function updateEvents() {
      if (globalTime % 720 === 0) {
        // Setiap 3 hari
        if (Math.random() < 0.2) {
          logActivity("Badai datang! Api luar padam.", true);
          entities = entities.filter((e) => e.type !== "API" || e.isIndoor);
        } else if (Math.random() < 0.1) {
          logActivity("Longsor! Hilang beberapa resource.", true);
          survivor.inventory.wood = Math.max(0, survivor.inventory.wood - 5);
        }
      }
    }

    function updateSeason() {
      season = Math.floor(survivalDays / 30) % 4;
      if (season === 3) temperature -= 10; // Musim dingin lebih dingin
    }

    function checkAchievements() {
      let ach = "";
      if (survivalDays >= 100) ach = "Legenda";
      else if (survivalDays >= 30) ach = "Ranger";
      else if (survivalDays >= 7) ach = "Pemula";
      if (ach) logActivity(`🏆 Achievement: ${ach}!`, true);
      score =
        survivalDays *
        (shelter ? shelter.level : 1) *
        Math.max(1, survivor.inventory.food);
    }

    function updateUI() {
      const updateEl = (id: string, value: string | number) => {
        const el = document.getElementById(id);
        if (el) el.textContent = String(value);
      };

      const updateBar = (id: string, value: number) => {
        const el = document.getElementById(id);
        if (el)
          el.style.width = `${Math.max(0, Math.min(100, Math.round(value)))}%`;
      };

      // Update main stats
      updateEl("day-display", survivalDays);
      updateEl("score-display", Math.round(score));
      updateEl("temp-display", Math.round(temperature) + "°C");
      updateEl("weather-display", weather);

      if (survivor) {
        // Update stat values and bars
        updateEl("warmth-val", Math.round(survivor.warmth));
        updateBar("warmth-bar", survivor.warmth);

        updateEl("hunger-val", Math.round(survivor.hunger));
        updateBar("hunger-bar", survivor.hunger);

        updateEl("thirst-val", Math.round(survivor.thirst));
        updateBar("thirst-bar", survivor.thirst);

        updateEl("health-val", Math.round(survivor.health));
        updateBar("health-bar", survivor.health);

        // Update inventory
        updateEl("inv-wood", survivor.inventory.wood || 0);
        updateEl("inv-stone", survivor.inventory.stone || 0);
        updateEl("inv-food", survivor.inventory.food || 0);
        updateEl("inv-fur", survivor.inventory.fur || 0);
        updateEl("inv-thread", survivor.inventory.thread || 0);
        updateEl("inv-water", survivor.inventory.water || 0);
        updateEl("inv-shelterlevel", shelter ? shelter.level : 0);
      }

      // Update resource counts
      updateEl("res-pohon", countEntities("POHON"));
      updateEl("res-batu", countEntities("BATU"));
      updateEl("res-hewan", countEntities("HEWAN"));
      updateEl("res-predator", countEntities("PREDATOR"));
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
          ctx.fillStyle = grid[y][x] === "AIR" ? airColor : tanahColor;
          ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      }

      entities.forEach((entity: Entity) => {
        // Render survivor sprite if available
        if (entity.type === "SURVIVOR" && survivorSprite) {
          const spriteWidth = survivorSprite.width || 64;
          const spriteHeight = survivorSprite.height || 64;
          const scale = TILE_SIZE / Math.max(spriteWidth, spriteHeight);
          const displayWidth = spriteWidth * scale;
          const displayHeight = spriteHeight * scale;
          const x = entity.x * TILE_SIZE + (TILE_SIZE - displayWidth) / 2;
          const y = entity.y * TILE_SIZE + (TILE_SIZE - displayHeight) / 2;
          ctx.drawImage(survivorSprite, x, y, displayWidth, displayHeight);
        } else {
          // Fallback to colored squares for other entities
          ctx.fillStyle =
            entity.type === "API"
              ? Math.random() > 0.5
                ? "#ff9500"
                : "#ffdd59"
              : COLORS[entity.type] || "#fff";
          ctx.fillRect(
            entity.x * TILE_SIZE,
            entity.y * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE
          );
        }
      });
    }

    // drawMiniMap removed since minimap is no longer used.

    function drawShelterInterior() {
      shelterCtx.clearRect(0, 0, shelterCanvas.width, shelterCanvas.height);

      // Background
      shelterCtx.fillStyle = "#4d3a2b";
      shelterCtx.fillRect(0, 0, shelterCanvas.width, shelterCanvas.height);

      // Walls
      shelterCtx.fillStyle = "#7d5a3e";
      const wallThickness = 20;
      shelterCtx.fillRect(0, 0, shelterCanvas.width, wallThickness);
      shelterCtx.fillRect(
        0,
        shelterCanvas.height - wallThickness,
        shelterCanvas.width,
        wallThickness
      );
      shelterCtx.fillRect(0, 0, wallThickness, shelterCanvas.height);
      shelterCtx.fillRect(
        shelterCanvas.width - wallThickness,
        0,
        wallThickness,
        shelterCanvas.height
      );

      // Draw furniture and activity zones
      const drawActivityZone = (
        x: number,
        y: number,
        w: number,
        h: number,
        label: string,
        icon: string
      ) => {
        shelterCtx.fillStyle = "#5a4a3a";
        shelterCtx.fillRect(x, y, w, h);
        shelterCtx.strokeStyle = "#8d7d6d";
        shelterCtx.lineWidth = 2;
        shelterCtx.strokeRect(x, y, w, h);

        // Icon
        shelterCtx.fillStyle = "#ffb700";
        shelterCtx.font = "20px Arial";
        shelterCtx.textAlign = "center";
        shelterCtx.textBaseline = "middle";
        shelterCtx.fillText(icon, x + w / 2, y + h / 2 - 15);

        // Label
        shelterCtx.fillStyle = "#aaa";
        shelterCtx.font = "9px Arial";
        shelterCtx.fillText(label, x + w / 2, y + h / 2 + 15);
      };

      // Sleeping area
      drawActivityZone(40, 50, 60, 60, "Sleep", "🛏️");

      // Cooking area
      drawActivityZone(shelterCanvas.width - 100, 50, 60, 60, "Cook", "🔥");

      // Water storage
      drawActivityZone(40, shelterCanvas.height - 110, 60, 60, "Water", "💧");

      // Food storage
      drawActivityZone(
        shelterCanvas.width - 100,
        shelterCanvas.height - 110,
        60,
        60,
        "Food",
        "🍖"
      );

      // Fire in center
      const fireCenterX = shelterCanvas.width / 2;
      const fireCenterY = shelterCanvas.height / 2;
      if (shelter.fire) {
        const flicker = Math.random() > 0.5 ? "#ff9500" : "#ffdd59";
        shelterCtx.fillStyle = flicker;
        shelterCtx.beginPath();
        shelterCtx.arc(fireCenterX, fireCenterY, 25, 0, Math.PI * 2);
        shelterCtx.fill();

        // Glow effect
        shelterCtx.fillStyle = "rgba(255, 149, 0, 0.3)";
        shelterCtx.beginPath();
        shelterCtx.arc(fireCenterX, fireCenterY, 35, 0, Math.PI * 2);
        shelterCtx.fill();
      } else {
        shelterCtx.fillStyle = "#3a3a3a";
        shelterCtx.beginPath();
        shelterCtx.arc(fireCenterX, fireCenterY, 25, 0, Math.PI * 2);
        shelterCtx.fill();
        shelterCtx.fillStyle = "#666";
        shelterCtx.font = "20px Arial";
        shelterCtx.textAlign = "center";
        shelterCtx.textBaseline = "middle";
        shelterCtx.fillText("❌", fireCenterX, fireCenterY);
      }

      // Survivor position with animation - dynamically based on task
      const survivorSize = 24 + 4 * (shelter.level - 1);
      let survivorX = shelterCanvas.width / 2;
      let survivorY = shelterCanvas.height * 0.75;
      let activity = "";
      let activityColor = "#ff4757";

      if (survivor) {
        // Move survivor to different locations based on current activity
        switch (survivor.task) {
          case "tidur":
            survivorX = 70;
            survivorY = 80;
            activity = "😴";
            activityColor = "#4caf50";
            break;
          case "makan di shelter":
            survivorX = shelterCanvas.width / 2;
            survivorY = shelterCanvas.height * 0.75;
            activity = "🍽️";
            activityColor = "#ffb700";
            break;
          case "minum di shelter":
            survivorX = 70;
            survivorY = shelterCanvas.height - 80;
            activity = "💧";
            activityColor = "#00d4ff";
            break;
          case "membuat api di shelter":
            survivorX = shelterCanvas.width / 2;
            survivorY = shelterCanvas.height / 2;
            activity = "🔥";
            activityColor = "#ff9500";
            break;
          case "memasak":
            survivorX = shelterCanvas.width - 70;
            survivorY = 80;
            activity = "🍳";
            activityColor = "#ffb700";
            break;
          case "bersantai":
            // Wander around with smooth sinusoidal movement
            const wanderSpeed = 0.02;
            const wanderRange = (shelterCanvas.width - 160) / 2;
            const centerX = shelterCanvas.width / 2;
            const centerY = shelterCanvas.height / 2;
            survivorX =
              centerX + Math.sin(globalTime * wanderSpeed) * wanderRange;
            survivorY =
              centerY +
              Math.cos(globalTime * wanderSpeed * 0.8) *
                (shelterCanvas.height / 3);
            activity = "🚶";
            activityColor = "#00d4ff";
            break;
          default:
            survivorX = shelterCanvas.width / 2;
            survivorY = shelterCanvas.height * 0.75;
            activity = "⚙️";
        }
      }

      // Draw survivor
      shelterCtx.fillStyle = activityColor;
      shelterCtx.beginPath();
      shelterCtx.arc(survivorX, survivorY, survivorSize / 2, 0, Math.PI * 2);
      shelterCtx.fill();

      // Draw activity indicator above survivor
      if (activity) {
        shelterCtx.font = "24px Arial";
        shelterCtx.textAlign = "center";
        shelterCtx.textBaseline = "middle";
        shelterCtx.fillText(activity, survivorX, survivorY - survivorSize - 20);
      }

      // Status text
      shelterCtx.fillStyle = "#aaa";
      shelterCtx.font = "11px Arial";
      shelterCtx.textAlign = "center";
      shelterCtx.fillText("INSIDE SHELTER", shelterCanvas.width / 2, 15);
    }

    function update() {
      if (isPaused) return;
      for (let i = 0; i < speedMultiplier; i++) {
        globalTime++;
        dayCycle += cycleSpeed / 1000;
        if (dayCycle >= 1) dayCycle = 0;
        isDay = dayCycle < 0.5;
        temperature = isDay
          ? 15 - 10 * Math.sin((globalTime / 100) * Math.PI)
          : -5 - 10 * Math.sin((globalTime / 100) * Math.PI);
        updateSeason();

        if (globalTime % 100 === 0) {
          const rand = Math.random();
          if (rand < 0.3) weather = "cerah";
          else if (rand < 0.6) weather = "hujan";
          else weather = "salju";
          logActivity(`Cuaca berubah menjadi ${weather}.`, true);
        }

        if (globalTime % 240 === 0) survivalDays++;
        if (survivor) {
          survivor.updateStatus();
          survivor.updateAI();
        }
        entities = entities.filter((e) => {
          if (typeof e.update === "function") e.update();
          if (e.type === "API") {
            if (e.lifespan !== undefined && e.lifespan <= 0) {
              logActivity("Api unggun telah padam.");
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

      if (logContainer) logContainer.innerHTML = "";
      globalTime = 0;
      survivalDays = 0;
      dayCycle = 0;
      weather = "cerah";
      season = 0;
      score = 0;
      inShelter = false;
      isPaused = false;
      speedMultiplier = 1;

      const cycleSpeedInput = document.getElementById(
        "cycle-speed"
      ) as HTMLInputElement;
      if (cycleSpeedInput) cycleSpeed = parseInt(cycleSpeedInput.value);

      const petaSizeInput = document.getElementById(
        "peta-size"
      ) as HTMLInputElement;
      if (petaSizeInput) mapSize = parseInt(petaSizeInput.value);

      // Set canvas dengan aspect ratio yang baik
      if (canvas) {
        const wrapper = document.getElementById("canvas-wrapper");
        if (wrapper) {
          const wrapperRect = wrapper.getBoundingClientRect();
          const availableWidth = wrapperRect.width || 600;
          const availableHeight = wrapperRect.height || 400;

          // Target aspect ratio: 16:10
          let canvasWidth = mapSize * TILE_SIZE;
          let canvasHeight = Math.round(canvasWidth * 0.625); // 16:10 ratio

          // Scale down if doesn't fit
          if (canvasWidth > availableWidth || canvasHeight > availableHeight) {
            const scaleX = availableWidth / canvasWidth;
            const scaleY = availableHeight / canvasHeight;
            const scale = Math.min(scaleX, scaleY, 1);
            canvasWidth = Math.round(canvasWidth * scale);
            canvasHeight = Math.round(canvasHeight * scale);
          }

          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
          canvas.style.display = "block";
        }
      }

      if (shelterCanvas) {
        shelterCanvas.width = canvas!.width;
        shelterCanvas.height = canvas!.height;
        shelterCanvas.style.display = "none";
      }

      mapHeight = Math.floor(canvas!.height / TILE_SIZE);

      generateMap();
      placeEntities();
      logActivity("Survivor terdampar di Taiga! Bertahanlah!", true);

      gameLoopInterval = setInterval(gameLoop, 300 / speedMultiplier);
    }

    function togglePause() {
      isPaused = !isPaused;
      const pauseButton = document.getElementById(
        "pause-btn"
      ) as HTMLButtonElement;
      if (pauseButton) pauseButton.textContent = isPaused ? "Resume" : "Pause";
    }

    function toggleFF() {
      speedMultiplier = speedMultiplier === 1 ? 2 : 1;
      const ffButton = document.getElementById("ff-btn") as HTMLButtonElement;
      if (ffButton) ffButton.textContent = `Fast Forward (x${speedMultiplier})`;
      if (gameLoopInterval) clearInterval(gameLoopInterval);
      gameLoopInterval = setInterval(gameLoop, 300 / speedMultiplier);
    }

    function exportLog() {
      const logContainer = document.getElementById(
        "activity-log"
      ) as HTMLElement;
      if (!logContainer) return;
      const logText = Array.from(logContainer.querySelectorAll("p"))
        .map((p) => p.textContent)
        .join("\n");
      const blob = new Blob([logText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "survival_log.txt";
      a.click();
      URL.revokeObjectURL(url);
    }

    function getRandomInt(max: number) {
      return Math.floor(Math.random() * max);
    }

    // Event listeners
    if (startButton) startButton.addEventListener("click", setupAndStartGame);
    if (pauseButton) pauseButton.addEventListener("click", togglePause);
    if (ffButton) ffButton.addEventListener("click", toggleFF);
    if (exportButton) exportButton.addEventListener("click", exportLog);
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
}
