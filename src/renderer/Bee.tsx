import React from 'react';

interface BeeProps {
  position: {
    x: number;
    y: number;
  };
}

const Bee = ({ position }: BeeProps) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: position.x,
    top: position.y,
    width: '20px',
    height: '20px',
    backgroundColor: 'yellow',
    color: 'black',
    textAlign: 'center',
    borderRadius: '50%',
  };

  return (
    <div style={style}>
      B
    </div>
  );
};

export default Bee;
