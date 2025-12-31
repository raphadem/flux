// export interface GameConfig {
//   gravity: { x: number; y: number; z: number };
//   fixedDt: number;
//   cameraPosition: { x: number; y: number; z: number };
//   cubeSize: number;
//   groundSize: { width: number; height: number; depth: number };
// }

const Config = {
  physics: {
    fixedDt: 1 / 60,
    gravity: { x: 0, y: -9.81, z: 0 },
  },
  debug: {
    physics: false,
  },
};

export default Config;
