import React, { useState, useEffect, useRef } from 'react';
import { drawMap, ramps, downhillParkMap, jumpParkRamps } from './Map';
import { drawPlayer, drawBee, Direction } from './Entities';
import { toIsometric } from './Isometric';
import { drawTimer, drawScore, drawTickets, drawGameOver, drawMoney } from './UI';
import { checkRampCollision, checkPlayerBeeCollision, checkParkEntranceCollision, checkDownhillCollision, checkFinishLineCollision } from './Collision';
import { checkTicketEarned, buyUpgrade as buyUpgradeLogic } from './GameLogic';
import { upgrades } from './Shop';
import { PlayerStats, UpgradeLevels } from './types';
import { ShopUI } from './ShopUI';
import { audioManager } from './Audio';

const GRAVITY = 0.005;
const TICKET_THRESHOLD = 1000;

type GameState = 'skate_city' | 'ramp_park' | 'downhill_park' | 'jump_park';

interface PlayerState {
  x: number;
  y: number;
  z: number;
  vz: number;
  dir: Direction;
  rotation: number;
}

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [gameState, setGameState] = useState<GameState>('skate_city');
  const gameStateRef = useRef(gameState);
  const [playerPosition, setPlayerPosition] = useState<PlayerState>({ x: 0, y: 0, z: 10, vz: 0, dir: 'right', rotation: 0 });
  const playerPositionRef = useRef(playerPosition);
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    jumpVelocity: 0.15,
    speed: 0.1,
    rotationSpeed: 0.1,
  });
  const [upgradeLevels, setUpgradeLevels] = useState<UpgradeLevels>({});
  const [isGrounded, setIsGrounded] = useState(false);
  const wasGroundedRef = useRef(true);
  const [airTime, setAirTime] = useState(0);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(score);
  const [tickets, setTickets] = useState(3);
  const ticketsRef = useRef(tickets);
  const [nextTicketAt, setNextTicketAt] = useState(TICKET_THRESHOLD);
  const [money, setMoney] = useState(100);
  const moneyRef = useRef(money);
  const [beePosition, setBeePosition] = useState({ x: 5, y: 5 });
  const beePositionRef = useRef(beePosition);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(timer);
  const [isBeeActive, setIsBeeActive] = useState(false);
  const isBeeActiveRef = useRef(isBeeActive);
  const [isGameOver, setIsGameOver] = useState(false);
  const isGameOverRef = useRef(isGameOver);
  const lastTimeRef = useRef<number | null>(null);
  const requestRef = useRef<number | null>(null);
  const beeSpeed = 0.05;
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  const buyUpgrade = (upgradeName: string) => {
    const result = buyUpgradeLogic(upgradeName, money, playerStats, upgradeLevels);
    if (result.success) {
      audioManager.playSound('buyUpgrade');
      setMoney(result.money);
      setPlayerStats(result.playerStats);
      setUpgradeLevels(result.upgradeLevels);
    } else {
      console.log('Could not buy upgrade');
    }
  };

  const restartGame = () => {
    audioManager.stopBuzz();
    setPlayerPosition({ x: 0, y: 0, z: 10, vz: 0, dir: 'right', rotation: 0 });
    setBeePosition({ x: 5, y: 5 });
    setTimer(0);
    setScore(0);
    setTickets(3);
    setNextTicketAt(TICKET_THRESHOLD);
    setMoney(100);
    setIsBeeActive(false);
    setIsGameOver(false);
    setGameState('skate_city');
    setPlayerStats({
      jumpVelocity: 0.15,
      speed: 0.1,
      rotationSpeed: 0.1,
    });
    setUpgradeLevels({});
    lastTimeRef.current = null;
    keysPressed.current = {};
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    playerPositionRef.current = playerPosition;
  }, [playerPosition]);

  useEffect(() => {
    beePositionRef.current = beePosition;
  }, [beePosition]);

  useEffect(() => {
    timerRef.current = timer;
    const currentGameState = gameStateRef.current;
    if ((currentGameState === 'ramp_park' || currentGameState === 'jump_park') && timer <= 0 && score > 0) {
      audioManager.stopBuzz();
      setGameState('skate_city');
      setPlayerPosition(prev => ({ ...prev, x: 0, y: 0, z: 10, vz: 0 }));
      setIsBeeActive(false);
      setMoney(prevMoney => prevMoney + Math.floor(score / 10));
      setScore(0);
    }
  }, [timer, score]);

  useEffect(() => {
    if (isBeeActive && !isBeeActiveRef.current) {
      audioManager.startBuzz();
    } else if (!isBeeActive && isBeeActiveRef.current) {
      audioManager.stopBuzz();
    }
    isBeeActiveRef.current = isBeeActive;
  }, [isBeeActive]);

  useEffect(() => {
    if (isGameOver && !isGameOverRef.current) {
      audioManager.stopBuzz();
    }
    isGameOverRef.current = isGameOver;
  }, [isGameOver]);

  useEffect(() => {
    scoreRef.current = score;
    const newState = checkTicketEarned(score, { tickets, nextTicketAt }, TICKET_THRESHOLD);
    if (newState.tickets > tickets) {
      setTickets(newState.tickets);
      setNextTicketAt(newState.nextTicketAt);
    }
  }, [score, tickets, nextTicketAt]);

  useEffect(() => {
    ticketsRef.current = tickets;
  }, [tickets]);

  useEffect(() => {
    moneyRef.current = money;
  }, [money]);

  useEffect(() => {
    if (isGrounded) {
      setPlayerPosition(prev => ({ ...prev, rotation: 0 }));
    }
  }, [isGrounded]);

  const handleKeyDown = (event: KeyboardEvent) => {
    keysPressed.current[event.key] = true;

    if (isGameOverRef.current) {
      if (event.key === 'r' || event.key === 'R') {
        restartGame();
      }
      return;
    }

    if (event.key === 's' && gameStateRef.current === 'skate_city') {
      setIsShopOpen(prev => !prev);
      return;
    }

    if (isShopOpen) return;

    if (event.key === '1') buyUpgrade('Helmet');
    if (event.key === '2') buyUpgrade('Shoes');
    if (event.key === '3') buyUpgrade('Board');

    if (gameStateRef.current === 'skate_city' && event.key === 'Enter') {
      const park = checkParkEntranceCollision(playerPositionRef.current);
      if (park && tickets > 0) {
        setTickets(prev => prev - 1);
        setGameState(park as GameState);
        if (park === 'ramp_park' || park === 'jump_park') {
          setPlayerPosition(prev => ({ ...prev, x: 0, y: 0, z: 10, vz: 0 }));
          setTimer(60);
        } else if (park === 'downhill_park') {
          setPlayerPosition(prev => ({ ...prev, x: 0, y: -5, z: 20, vz: 0 }));
          setTimer(0);
        }
      }
      return;
    }

    if (event.code === 'Space' && isGrounded) {
      audioManager.playSound('jump');
      setPlayerPosition(prev => ({ ...prev, vz: playerStats.jumpVelocity }));
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    keysPressed.current[event.key] = false;
  };

  const updatePlayerMovement = () => {
    if (isShopOpen) return;
    setPlayerPosition(prev => {
      if (!isGrounded && (gameStateRef.current === 'ramp_park' || gameStateRef.current === 'jump_park')) {
        if (keysPressed.current['ArrowLeft']) {
          return { ...prev, rotation: prev.rotation - playerStats.rotationSpeed };
        }
        if (keysPressed.current['ArrowRight']) {
          return { ...prev, rotation: prev.rotation + playerStats.rotationSpeed };
        }
      } else {
        let dx = 0;
        let dy = 0;
        let dir: Direction = prev.dir;

        if (keysPressed.current['ArrowUp']) { dx = -playerStats.speed; dy = -playerStats.speed; }
        if (keysPressed.current['ArrowDown']) { dx = playerStats.speed; dy = playerStats.speed; }
        if (keysPressed.current['ArrowLeft']) { dx = -playerStats.speed; dy = playerStats.speed; dir = 'left'; }
        if (keysPressed.current['ArrowRight']) { dx = playerStats.speed; dy = -playerStats.speed; dir = 'right'; }

        if (dx !== 0 || dy !== 0) {
          return { ...prev, x: prev.x + dx, y: prev.y + dy, dir };
        }
      }
      return prev;
    });
  };

  const gameLoop = (time: number) => {
    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(gameLoop);
      return;
    }
    const deltaTime = (time - lastTimeRef.current) / 16.67;
    lastTimeRef.current = time;

    if (isGameOverRef.current || isShopOpen) {
      requestRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    updatePlayerMovement();

    let groundZ = 0;
    const currentGameState = gameStateRef.current;
    if (currentGameState === 'ramp_park') {
      groundZ = checkRampCollision(playerPositionRef.current, ramps);
    } else if (currentGameState === 'jump_park') {
      groundZ = checkRampCollision(playerPositionRef.current, jumpParkRamps);
    } else if (currentGameState === 'downhill_park') {
      groundZ = checkDownhillCollision(playerPositionRef.current);
      if (checkFinishLineCollision(playerPositionRef.current)) {
        setGameState('skate_city');
        setPlayerPosition(prev => ({ ...prev, x: 0, y: 0, z: 10, vz: 0 }));
        setMoney(prevMoney => prevMoney + Math.floor(score / 10));
        setScore(0);
      }
    }

    setPlayerPosition(prev => {
      const newVz = prev.vz - GRAVITY * deltaTime;
      let newZ = prev.z + newVz * deltaTime;
      let landed = false;
      if (newZ < groundZ) {
        newZ = groundZ;
        landed = true;
      }
      return { ...prev, z: newZ, vz: landed ? 0 : newVz };
    });

    setIsGrounded(playerPositionRef.current.z <= groundZ + 0.1);

    if (!isGrounded && wasGroundedRef.current) {
      setAirTime(0);
    } else if (!isGrounded) {
      setAirTime(prev => prev + deltaTime);
    } else if (isGrounded && !wasGroundedRef.current) {
      audioManager.playSound('land');
      const rotationBonus = Math.floor(Math.abs(playerPositionRef.current.rotation) / (2 * Math.PI));
      const newScore = Math.floor(airTime * 10) + rotationBonus * 500;
      setScore(prev => prev + newScore);
      setAirTime(0);
    }
    wasGroundedRef.current = isGrounded;

    if (isBeeActiveRef.current) {
      setBeePosition(prev => {
        const dx = playerPositionRef.current.x - prev.x;
        const dy = playerPositionRef.current.y - prev.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return {
          x: prev.x + (dx / dist) * beeSpeed * deltaTime,
          y: prev.y + (dy / dist) * beeSpeed * deltaTime,
        };
      });

      if (checkPlayerBeeCollision(playerPositionRef.current, beePositionRef.current)) {
        setIsGameOver(true);
      }
    }

    if (currentGameState === 'ramp_park' || currentGameState === 'jump_park') {
      const newTime = Math.max(0, timerRef.current - deltaTime / 60);
      setTimer(newTime);
      if (newTime > 0 && newTime < 10 && !isBeeActiveRef.current) {
        setIsBeeActive(true);
      }
    } else if (currentGameState === 'downhill_park') {
      setTimer(prev => prev + deltaTime / 60);
    }

    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (context && canvas) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      const origin = { x: canvas.width / 2, y: 150 };
      drawMap(context, currentGameState, toIsometric, origin);

      const isoPlayerPos = toIsometric(playerPositionRef.current.x, playerPositionRef.current.y, playerPositionRef.current.z, origin);
      drawPlayer(context, isoPlayerPos, playerPositionRef.current.dir, playerPositionRef.current.rotation);

      if (isBeeActiveRef.current) {
        const isoBeePos = toIsometric(beePositionRef.current.x, beePositionRef.current.y, 0, origin);
        drawBee(context, isoBeePos);
      }

      drawTimer(context, timerRef.current);
      drawScore(context, scoreRef.current);
      drawTickets(context, ticketsRef.current);
      drawMoney(context, moneyRef.current);
      if (isGameOverRef.current) {
        drawGameOver(context);
      }
    }

    requestRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    requestRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '800px', height: '600px' }}>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ backgroundColor: 'black' }}
      />
      {isShopOpen && (
        <ShopUI
          money={money}
          upgrades={upgrades}
          upgradeLevels={upgradeLevels}
          onBuyUpgrade={buyUpgrade}
          onClose={() => setIsShopOpen(false)}
        />
      )}
    </div>
  );
};

export default Game;
