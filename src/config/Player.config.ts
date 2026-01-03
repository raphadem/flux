export const PlayerConfig = {
  shape: {
    height: 0.5,
    radius: 1,
  },

  jump: {
    bufferTime: 0.12,
    coyoteTime: 0.08,
    impulse: 8.5,
  },

  movement: {
    // speed: 10,
    maxSpeed: 20,
    // airControl: 0.4,
    accelerationGround: 2,
    accelerationAir: 10,

    dampingGround: 2,
    dampingAir: 8,

    maxSlopeAngle: 45,
    snapDistance: 0.1,
    supportGrace: 0.08,
    maxSupportSpeed: 0.08,
  },
} as const;
