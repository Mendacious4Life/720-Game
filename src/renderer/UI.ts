export const drawTimer = (context: CanvasRenderingContext2D, timer: number) => {
  context.fillStyle = 'black';
  context.font = '24px Arial';
  context.textAlign = 'right';
  context.fillText(`Time: ${timer.toFixed(2)}`, context.canvas.width - 20, 40);
};

export const drawScore = (context: CanvasRenderingContext2D, score: number) => {
  context.fillStyle = 'black';
  context.font = '24px Arial';
  context.textAlign = 'left';
  context.fillText(`Score: ${score}`, 20, 40);
};

export const drawTickets = (context: CanvasRenderingContext2D, tickets: number) => {
  context.fillStyle = 'black';
  context.font = '24px Arial';
  context.textAlign = 'left';
  context.fillText(`Tickets: ${tickets}`, 20, 70);
};

export const drawMoney = (context: CanvasRenderingContext2D, money: number) => {
  context.fillStyle = 'black';
  context.font = '24px Arial';
  context.textAlign = 'left';
  context.fillText(`$${money}`, 20, 100);
};

export const drawGameOver = (context: CanvasRenderingContext2D) => {
  context.fillStyle = 'rgba(0, 0, 0, 0.5)';
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);

  context.fillStyle = 'white';
  context.font = '48px Arial';
  context.textAlign = 'center';
  context.fillText('Game Over', context.canvas.width / 2, context.canvas.height / 2);
};
