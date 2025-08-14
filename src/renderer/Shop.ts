import { UpgradeableStat } from './types';

export interface Upgrade {
  name: string;
  stat: UpgradeableStat;
  levels: {
    price: number;
    value: number;
  }[];
}

export const upgrades: Upgrade[] = [
  {
    name: 'Helmet',
    stat: 'rotationSpeed',
    levels: [
      { price: 25, value: 0.15 },
      { price: 100, value: 0.2 },
      { price: 250, value: 0.25 },
    ],
  },
  {
    name: 'Shoes',
    stat: 'jumpVelocity',
    levels: [
      { price: 25, value: 0.18 },
      { price: 100, value: 0.21 },
      { price: 250, value: 0.24 },
    ],
  },
  {
    name: 'Board',
    stat: 'speed',
    levels: [
      { price: 25, value: 0.12 },
      { price: 100, value: 0.14 },
      { price: 250, value: 0.16 },
    ],
  },
];
