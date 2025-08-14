import React from 'react';
import { Upgrade } from './Shop';
import { UpgradeLevels } from './types';

interface ShopUIProps {
  money: number;
  upgrades: Upgrade[];
  upgradeLevels: UpgradeLevels;
  onBuyUpgrade: (upgradeName: string) => void;
  onClose: () => void;
}

const shopStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '400px',
  padding: '20px',
  backgroundColor: 'rgba(0, 0, 0, 0.85)',
  border: '2px solid #fff',
  borderRadius: '10px',
  color: '#fff',
  fontFamily: 'monospace',
  zIndex: 100,
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid #fff',
  marginBottom: '15px',
};

const itemStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px',
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  color: '#000',
  border: 'none',
  padding: '5px 10px',
  cursor: 'pointer',
};

export const ShopUI: React.FC<ShopUIProps> = ({ money, upgrades, upgradeLevels, onBuyUpgrade, onClose }) => {
  return (
    <div style={shopStyle}>
      <div style={headerStyle}>
        <h2>Equipment Shop</h2>
        <button style={buttonStyle} onClick={onClose}>Close</button>
      </div>
      <h3>Your Money: ${money}</h3>
      <div>
        {upgrades.map(upgrade => {
          const currentLevel = upgradeLevels[upgrade.name] || 0;
          const isMaxed = currentLevel >= upgrade.levels.length;
          const nextLevelData = isMaxed ? null : upgrade.levels[currentLevel];

          return (
            <div key={upgrade.name} style={itemStyle}>
              <div>
                <strong>{upgrade.name}</strong> (Level {currentLevel})
                {!isMaxed && nextLevelData && (
                  <p style={{ margin: 0, fontSize: '0.9em' }}>
                    Next: +{nextLevelData.value} {upgrade.stat}
                  </p>
                )}
              </div>
              <div>
                {isMaxed ? (
                  <span>MAX LEVEL</span>
                ) : (
                  nextLevelData && (
                    <button style={buttonStyle} onClick={() => onBuyUpgrade(upgrade.name)}>
                      Buy (${nextLevelData.price})
                    </button>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
