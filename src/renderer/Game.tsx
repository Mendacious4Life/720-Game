import React, { useState, useEffect, useRef } from 'react';
import Player from './Player';
import Bee from './Bee';

const Game = () => {
  const [playerPosition, setPlayerPosition] = useState({ x: 100, y: 100 });
  const playerPositionRef = useRef(playerPosition);

  useEffect(() => {
    playerPositionRef.current = playerPosition;
  }, [playerPosition]);

  const [beePosition, setBeePosition] = useState({ x: 200, y: 200 });
  const requestRef = useRef<number | null>(null);
  const speed = 10;
  const beeSpeed = 2;

  const handleKeyDown = (event: KeyboardEvent) => {
    setPlayerPosition((prevPosition) => {
      switch (event.key) {
        case 'ArrowUp':
          return { ...prevPosition, y: prevPosition.y - speed };
        case 'ArrowDown':
          return { ...prevPosition, y: prevPosition.y + speed };
        case 'ArrowLeft':
          return { ...prevPosition, x: prevPosition.x - speed };
        case 'ArrowRight':
          return { ...prevPosition, x: prevPosition.x + speed };
        default:
          return prevPosition;
      }
    });
  };

  const gameLoop = () => {
    setBeePosition(prevBeePosition => {
      const playerPos = playerPositionRef.current;
      const dx = playerPos.x - prevBeePosition.x;
      const dy = playerPos.y - prevBeePosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 1) {
        const newX = prevBeePosition.x + (dx / distance) * beeSpeed;
        const newY = prevBeePosition.y + (dy / distance) * beeSpeed;
        return { x: newX, y: newY };
      }
      return prevBeePosition;
    });

    requestRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    requestRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <div>
      <h1>720° Skateboarding Game</h1>
      <Player position={playerPosition} />
      <Bee position={beePosition} />
    </div>
  );
};

export default Game;
