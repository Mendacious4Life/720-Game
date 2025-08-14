interface Entity {
  x: number;
  y: number;
}

export type Direction = 'left' | 'right';

export const drawPlayer = (context: CanvasRenderingContext2D, player: Entity, dir: Direction, rotation: number) => {
  context.save();
  context.translate(player.x, player.y);
  context.rotate(rotation);

  if (dir === 'left') {
    context.scale(-1, 1);
  }

  // Draw the player centered at (0, 0) relative to the translated context
  const x = 0;
  const y = 0;

  // Skateboard
  context.fillStyle = '#795548'; // Brown
  context.fillRect(x - 20, y, 40, 10);

  // Wheels
  context.fillStyle = 'black';
  context.beginPath();
  context.arc(x - 10, y + 10, 5, 0, 2 * Math.PI);
  context.arc(x + 10, y + 10, 5, 0, 2 * Math.PI);
  context.fill();

  // Body
  context.strokeStyle = 'black';
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x, y - 30); // Torso
  context.moveTo(x, y - 20);
  context.lineTo(x - 10, y - 10); // Left arm
  context.moveTo(x, y - 20);
  context.lineTo(x + 10, y - 10); // Right arm
  context.moveTo(x, y);
  context.lineTo(x - 5, y + 5); // Left leg on board
  context.moveTo(x, y);
  context.lineTo(x + 5, y + 5); // Right leg on board
  context.stroke();

  // Head
  context.fillStyle = '#F0DBC0'; // Skin tone
  context.beginPath();
  context.arc(x, y - 40, 10, 0, 2 * Math.PI);
  context.fill();
  context.stroke();

  context.restore();
};

export const drawBee = (context: CanvasRenderingContext2D, bee: Entity) => {
  context.fillStyle = 'yellow';
  context.beginPath();
  context.arc(bee.x, bee.y, 5, 0, 2 * Math.PI);
  context.fill();
};
