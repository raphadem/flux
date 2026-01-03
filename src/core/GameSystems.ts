import type { GameContext } from "./GameContext";
import { Renderer } from "@/engine/graphics/Renderer";
import { CameraManager } from "@/engine/graphics/Camera";
import { PhysicsSyncSystem } from "@/engine/physics/PhysicsSyncSystem";
import { PhysicsDebugRenderer } from "@/engine/physics/PhysicsDebugRenderer";
import { EntityFactory } from "./EntityFactory";
EntityFactory;

export interface GameSystems {
  readonly ctx: GameContext;
  readonly renderer: Renderer;
  readonly camera: CameraManager;
  readonly physicsSync: PhysicsSyncSystem;
  readonly debugRenderer: PhysicsDebugRenderer;
  readonly entityFactory: EntityFactory;
}
