import { upgrades } from './Shop';
import { PlayerStats, UpgradeLevels } from './types';

export interface TicketState {
  tickets: number;
  nextTicketAt: number;
}

export const checkTicketEarned = (
  score: number,
  currentState: TicketState,
  threshold: number
): TicketState => {
  let { tickets, nextTicketAt } = currentState;
  while (score >= nextTicketAt) {
    tickets++;
    nextTicketAt += threshold;
  }
  return { tickets, nextTicketAt };
};

export interface BuyUpgradeResult {
  money: number;
  playerStats: PlayerStats;
  upgradeLevels: UpgradeLevels;
  success: boolean;
}

export const buyUpgrade = (
  upgradeName: string,
  money: number,
  playerStats: PlayerStats,
  upgradeLevels: UpgradeLevels
): BuyUpgradeResult => {
  const upgrade = upgrades.find(u => u.name === upgradeName);
  if (!upgrade) return { money, playerStats, upgradeLevels, success: false };

  const currentLevel = upgradeLevels[upgradeName] || 0;
  if (currentLevel >= upgrade.levels.length) {
    return { money, playerStats, upgradeLevels, success: false };
  }

  const nextLevelData = upgrade.levels[currentLevel];
  if (money >= nextLevelData.price) {
    const newMoney = money - nextLevelData.price;
    const newUpgradeLevels = { ...upgradeLevels, [upgradeName]: currentLevel + 1 };
    const newPlayerStats = { ...playerStats, [upgrade.stat]: nextLevelData.value };
    return { money: newMoney, playerStats: newPlayerStats, upgradeLevels: newUpgradeLevels, success: true };
  }

  return { money, playerStats, upgradeLevels, success: false };
};
