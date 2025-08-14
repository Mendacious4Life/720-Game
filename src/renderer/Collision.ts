import { Ramp, skateCityMap, downhillParkMap, DownhillSegment } from './Map';

interface PlayerPosition {
  x: number;
  y: number;
  z: number;
  vz: number;
}

interface BeePosition {
  x: number;
  y: number;
}

export const checkRampCollision = (player: PlayerPosition, ramps: Ramp[]): number => {
  let groundZ = 0;

  for (const ramp of ramps) {
    const halfWidth = ramp.width / 2;
    const halfDepth = ramp.depth / 2;

    const isWithinY = player.y >= ramp.y - halfDepth && player.y <= ramp.y + halfDepth;

    if (isWithinY) {
      const isWithinXDeck = player.x >= ramp.x - halfWidth && player.x <= ramp.x + halfWidth;
      if (isWithinXDeck) {
        const rampTopZ = ramp.z + ramp.height;
        if (rampTopZ > groundZ) {
          groundZ = rampTopZ;
        }
      }

      const innerEdgeX = ramp.x > 0 ? ramp.x - halfWidth : ramp.x + halfWidth;
      const outerEdgeX = ramp.x > 0 ? ramp.x + halfWidth : ramp.x - halfWidth;

      if (ramp.x < 0 && player.x < innerEdgeX && player.x >= outerEdgeX) {
        const slope = ramp.height / (outerEdgeX - innerEdgeX);
        const slopeZ = slope * (player.x - innerEdgeX);
        if (slopeZ > groundZ) {
          groundZ = slopeZ;
        }
      }
      else if (ramp.x > 0 && player.x > innerEdgeX && player.x <= outerEdgeX) {
        const slope = ramp.height / (outerEdgeX - innerEdgeX);
        const slopeZ = slope * (player.x - innerEdgeX);
        if (slopeZ > groundZ) {
          groundZ = slopeZ;
        }
      }
    }
  }

  return groundZ;
};

export const checkDownhillCollision = (player: PlayerPosition): number => {
  let groundZ = -Infinity;

  for (const segment of downhillParkMap.segments) {
    const halfWidth = segment.width / 2;
    const halfDepth = segment.depth / 2;

    const isWithinX = player.x >= segment.x - halfWidth && player.x <= segment.x + halfWidth;
    const isWithinY = player.y >= segment.y - halfDepth && player.y <= segment.y + halfDepth;

    if (isWithinX && isWithinY) {
      if (segment.type === 'flat') {
        if (segment.z > groundZ) {
          groundZ = segment.z;
        }
      } else if (segment.type === 'slope') {
        const startZ = segment.z;
        const endZ = segment.endZ!;
        const startY = segment.y - halfDepth;
        const endY = segment.y + halfDepth;

        const progress = (player.y - startY) / (endY - startY);
        const slopeZ = startZ + (endZ - startZ) * progress;

        if (slopeZ > groundZ) {
          groundZ = slopeZ;
        }
      }
    }
  }

  return groundZ === -Infinity ? 0 : groundZ;
};

export const checkFinishLineCollision = (player: PlayerPosition): boolean => {
  return player.y >= downhillParkMap.finishLine.y;
};

export const checkPlayerBeeCollision = (player: PlayerPosition, bee: BeePosition): boolean => {
  const dx = player.x - bee.x;
  const dy = player.y - bee.y;
  const dz = player.z;
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

  const playerRadius = 0.5;
  const beeRadius = 0.25;
  const collisionDistance = playerRadius + beeRadius;

  return distance < collisionDistance;
};

export const checkParkEntranceCollision = (player: PlayerPosition): string | null => {
  for (const entrance of skateCityMap.parkEntrances) {
    const halfWidth = entrance.width / 2;
    const halfDepth = entrance.depth / 2;

    const isWithinX = player.x >= entrance.x - halfWidth && player.x <= entrance.x + halfWidth;
    const isWithinY = player.y >= entrance.y - halfDepth && player.y <= entrance.y + halfDepth;

    if (isWithinX && isWithinY) {
      return entrance.park;
    }
  }

  return null;
};
