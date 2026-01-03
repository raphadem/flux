import { SceneManager } from "@/engine/graphics/Scene";
import { PhysicsWorld } from "@/engine/physics/PhysicsWorld";
import { Input } from "./Input";

export interface GameContext {
  readonly scene: SceneManager;
  readonly physics: PhysicsWorld;
  readonly input: Input;
}
