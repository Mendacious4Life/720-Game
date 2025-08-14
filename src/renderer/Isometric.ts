interface Point {
  x: number;
  y: number;
}

const TILE_WIDTH_HALF = 32;
const TILE_HEIGHT_HALF = 16;

export const toIsometric = (x: number, y: number, z: number, origin: Point): Point => {
  const isoX = origin.x + (x - y) * TILE_WIDTH_HALF;
  const isoY = origin.y + (x + y) * TILE_HEIGHT_HALF - z;
  return { x: isoX, y: isoY };
};
