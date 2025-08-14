import { checkPlayerBeeCollision } from '../Collision';

describe('checkPlayerBeeCollision', () => {
  const bee = { x: 5, y: 5 };

  it('should return false when the player is far from the bee', () => {
    const player = { x: 10, y: 10, z: 0, vz: 0 };
    expect(checkPlayerBeeCollision(player, bee)).toBe(false);
  });

  it('should return true when the player is close to the bee', () => {
    const player = { x: 5.1, y: 5.1, z: 0, vz: 0 };
    expect(checkPlayerBeeCollision(player, bee)).toBe(true);
  });

  it('should return true when the player is at the same position as the bee', () => {
    const player = { x: 5, y: 5, z: 0, vz: 0 };
    expect(checkPlayerBeeCollision(player, bee)).toBe(true);
  });

  it('should consider the z-axis for collision', () => {
    const player = { x: 5, y: 5, z: 10, vz: 0 }; // High above the bee
    expect(checkPlayerBeeCollision(player, bee)).toBe(false);
  });
});
