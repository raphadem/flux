// config.ts
export interface GameConfig {
  gravity: { x: number; y: number; z: number };
  fixedDt: number;
  cameraPosition: { x: number; y: number; z: number };
  cubeSize: number;
  groundSize: { width: number; height: number; depth: number };
}

const config: GameConfig = {
  gravity: { x: 0, y: -9.81, z: 0 },
  fixedDt: 1 / 60,
  cameraPosition: { x: 0, y: 5, z: 10 },
  cubeSize: 1,
  groundSize: { width: 50, height: 0.1, depth: 50 },
};

export default config;
