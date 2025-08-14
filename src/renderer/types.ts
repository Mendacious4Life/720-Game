export type UpgradeableStat = 'jumpVelocity' | 'speed' | 'rotationSpeed';

export interface PlayerStats {
  jumpVelocity: number;
  speed: number;
  rotationSpeed: number;
}

export interface UpgradeLevels {
  [key: string]: number;
}
