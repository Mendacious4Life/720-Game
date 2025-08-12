import React from 'react';

interface PlayerProps {
  position: {
    x: number;
    y: number;
  };
}

const Player = ({ position }: PlayerProps) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: position.x,
    top: position.y,
    width: '20px',
    height: '20px',
    backgroundColor: 'blue',
    color: 'white',
    textAlign: 'center',
    borderRadius: '50%',
  };

  return (
    <div style={style}>
      P
    </div>
  );
};

export default Player;
