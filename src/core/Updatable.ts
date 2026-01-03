export interface Updatable {
  fixedUpdate?(dt: number): void;
  update?(dt: number): void;
}
