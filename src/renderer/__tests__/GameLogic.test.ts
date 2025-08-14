import { buyUpgrade, checkTicketEarned } from '../GameLogic';
import { PlayerStats, UpgradeLevels } from '../types';

describe('buyUpgrade', () => {
  const initialMoney = 100;
  const initialPlayerStats: PlayerStats = {
    speed: 0.1,
    jumpVelocity: 0.15,
    rotationSpeed: 0.1,
  };
  const initialUpgradeLevels: UpgradeLevels = {};

  it('should allow purchasing an upgrade with sufficient funds', () => {
    const result = buyUpgrade(
      'Helmet',
      initialMoney,
      initialPlayerStats,
      initialUpgradeLevels
    );
    expect(result.success).toBe(true);
    expect(result.money).toBe(75); // 100 - 25
    expect(result.playerStats.rotationSpeed).toBe(0.15);
    expect(result.upgradeLevels.Helmet).toBe(1);
  });

  it('should prevent purchasing an upgrade without sufficient funds', () => {
    const result = buyUpgrade(
      'Helmet',
      10, // Not enough money
      initialPlayerStats,
      initialUpgradeLevels
    );
    expect(result.success).toBe(false);
    expect(result.money).toBe(10);
    expect(result.playerStats).toEqual(initialPlayerStats);
    expect(result.upgradeLevels).toEqual(initialUpgradeLevels);
  });

  it('should allow upgrading to the next level', () => {
    const moneyForTwoLevels = 200;
    // First, buy level 1
    const firstPurchase = buyUpgrade(
      'Helmet',
      moneyForTwoLevels,
      initialPlayerStats,
      initialUpgradeLevels
    );
    expect(firstPurchase.success).toBe(true);
    expect(firstPurchase.money).toBe(175); // 200 - 25

    // Then, buy level 2
    const secondPurchase = buyUpgrade(
      'Helmet',
      firstPurchase.money,
      firstPurchase.playerStats,
      firstPurchase.upgradeLevels
    );
    expect(secondPurchase.success).toBe(true);
    expect(secondPurchase.money).toBe(75); // 175 - 100
    expect(secondPurchase.playerStats.rotationSpeed).toBe(0.2);
    expect(secondPurchase.upgradeLevels.Helmet).toBe(2);
  });

  it('should not allow upgrading past the maximum level', () => {
    const maxedUpgradeLevels: UpgradeLevels = { Helmet: 3 };
    const result = buyUpgrade(
      'Helmet',
      500,
      initialPlayerStats,
      maxedUpgradeLevels
    );
    expect(result.success).toBe(false);
    expect(result.money).toBe(500);
  });

  it('should handle non-existent upgrades gracefully', () => {
    const result = buyUpgrade(
      'InvalidUpgrade',
      initialMoney,
      initialPlayerStats,
      initialUpgradeLevels
    );
    expect(result.success).toBe(false);
    expect(result.money).toBe(initialMoney);
    expect(result.playerStats).toEqual(initialPlayerStats);
  });
});

describe('checkTicketEarned', () => {
  const threshold = 1000;

  it('should not award a ticket if the score is below the threshold', () => {
    const currentState = { tickets: 3, nextTicketAt: 1000 };
    const newState = checkTicketEarned(500, currentState, threshold);
    expect(newState.tickets).toBe(3);
    expect(newState.nextTicketAt).toBe(1000);
  });

  it('should award one ticket when the score reaches the threshold', () => {
    const currentState = { tickets: 3, nextTicketAt: 1000 };
    const newState = checkTicketEarned(1000, currentState, threshold);
    expect(newState.tickets).toBe(4);
    expect(newState.nextTicketAt).toBe(2000);
  });

  it('should award one ticket when the score surpasses the threshold', () => {
    const currentState = { tickets: 3, nextTicketAt: 1000 };
    const newState = checkTicketEarned(1500, currentState, threshold);
    expect(newState.tickets).toBe(4);
    expect(newState.nextTicketAt).toBe(2000);
  });

  it('should award multiple tickets if the score jumps over multiple thresholds', () => {
    const currentState = { tickets: 3, nextTicketAt: 1000 };
    const newState = checkTicketEarned(3500, currentState, threshold);
    expect(newState.tickets).toBe(6);
    expect(newState.nextTicketAt).toBe(4000);
  });

  it('should handle starting from a different ticket count and milestone', () => {
    const currentState = { tickets: 5, nextTicketAt: 3000 };
    const newState = checkTicketEarned(3500, currentState, threshold);
    expect(newState.tickets).toBe(6);
    expect(newState.nextTicketAt).toBe(4000);
  });
});
