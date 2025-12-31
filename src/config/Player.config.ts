export const PlayerConfig = {
  jump: {
    bufferTime: 0.12,
    coyoteTime: 0.08,
    impulse: 8.5,
  },

  movement: {
    speed: 10,
    maxSpeed: 12,
    airControl: 0.4,
    groundAcceleration: 60,
    airAcceleration: 20,
  },
} as const;
