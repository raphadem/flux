function createPhysicsConfig() {
  return {
    controller: {
      height: 0.5,
      radius: 1,

      snapDistance: 0.2,
      maxSlopeAngle: 50,
      skinWidth: 0.5,
    },

    jump: {
      bufferTime: 0.12,
      coyoteTime: 0.12,
      impulse: 11,
    },

    movement: {
      maxGroundSpeed: 12,
      maxAirSpeed: 14,

      groundAcceleration: 80,
      groundDeceleration: 50,

      airAcceleration: 28,

      airDrag: 0.98, // only when no input
    },
  };
}

export const PlayerConfig = createPhysicsConfig();
