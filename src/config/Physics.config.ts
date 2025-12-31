export const PhysicsConfig = {
  fixedDt: 1 / 60,
  gravity: { x: 0, y: -9.81, z: 0 },

  solver: {
    iterations: 4,
    substeps: 1,
  },
} as const;
