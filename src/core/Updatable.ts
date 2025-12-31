export interface Updatable {
  fixedUpdate?(fixedDt: number): void;
  update?(dt: number): void;
}
