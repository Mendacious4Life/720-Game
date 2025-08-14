interface Point {
  x: number;
  y: number;
}

type ToIsometric = (x: number, y: number, z: number, origin: Point) => Point;

const drawGrid = (
  context: CanvasRenderingContext2D,
  toIsometric: ToIsometric,
  origin: Point
) => {
  const gridSize = 30; // Increased grid size
  context.strokeStyle = '#A9A9A9';
  context.lineWidth = 1;

  for (let i = -gridSize; i <= gridSize; i++) {
    let p1 = toIsometric(i, -gridSize, 0, origin);
    let p2 = toIsometric(i, gridSize, 0, origin);
    context.beginPath();
    context.moveTo(p1.x, p1.y);
    context.lineTo(p2.x, p2.y);
    context.stroke();

    p1 = toIsometric(-gridSize, i, 0, origin);
    p2 = toIsometric(gridSize, i, 0, origin);
    context.beginPath();
    context.moveTo(p1.x, p1.y);
    context.lineTo(p2.x, p2.y);
    context.stroke();
  }
};

export interface Ramp {
  x: number;
  y: number;
  z: number;
  width: number;
  depth: number;
  height: number;
}

export const ramps: Ramp[] = [
  { x: -8, y: 0, z: 0, width: 4, depth: 20, height: 4 },
  { x: 8, y: 0, z: 0, width: 4, depth: 20, height: 4 },
];

export const jumpParkRamps: Ramp[] = [
  { x: -10, y: -5, z: 0, width: 8, depth: 4, height: 3 },
  { x: 0, y: 0, z: 0, width: 8, depth: 4, height: 6 },
  { x: 10, y: 5, z: 0, width: 8, depth: 4, height: 9 },
];

export const skateCityMap = {
  parkEntrances: [
    { x: 0, y: -15, width: 8, depth: 2, park: 'ramp_park' },
    { x: 15, y: 0, width: 2, depth: 8, park: 'downhill_park' },
    { x: -15, y: 0, width: 2, depth: 8, park: 'jump_park' },
    { x: 0, y: 15, width: 8, depth: 2, park: 'slalom_park' },
  ],
};

export interface SlalomGate {
  x: number;
  y: number;
  width: number;
}

export const slalomParkMap = {
  gates: [
    { x: 0, y: 10, width: 4 },
    { x: 2, y: 20, width: 4 },
    { x: -2, y: 30, width: 4 },
    { x: 0, y: 40, width: 4 },
    { x: 3, y: 50, width: 4 },
    { x: -3, y: 60, width: 4 },
  ] as SlalomGate[],
};

export interface DownhillSegment {
  type: 'flat' | 'slope';
  x: number;
  y: number;
  z: number;
  width: number;
  depth: number;
  endZ?: number;
}

export const downhillParkMap = {
  segments: [
    { type: 'flat', x: 0, y: 0, z: 20, width: 10, depth: 10 },
    { type: 'slope', x: 0, y: 15, z: 20, width: 10, depth: 10, endZ: 10 },
    { type: 'flat', x: 0, y: 30, z: 10, width: 10, depth: 10 },
    { type: 'slope', x: 0, y: 45, z: 10, width: 10, depth: 10, endZ: 0 },
    { type: 'flat', x: 0, y: 60, z: 0, width: 10, depth: 10 },
  ] as DownhillSegment[],
  finishLine: { y: 65 },
};


const drawFace = (context: CanvasRenderingContext2D, points: Point[], color: string) => {
  context.fillStyle = color;
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    context.lineTo(points[i].x, points[i].y);
  }
  context.closePath();
  context.fill();
};

const drawRampPark = (
  context: CanvasRenderingContext2D,
  toIsometric: ToIsometric,
  origin: Point
) => {
  drawGrid(context, toIsometric, origin);

  const leftRamp = ramps[0];
  const rightRamp = ramps[1];
  const p1 = { x: leftRamp.x + leftRamp.width / 2, y: leftRamp.y - leftRamp.depth / 2, z: 0 };
  const p2 = { x: rightRamp.x - rightRamp.width / 2, y: rightRamp.y - rightRamp.depth / 2, z: 0 };
  const p3 = { x: rightRamp.x - rightRamp.width / 2, y: rightRamp.y + rightRamp.depth / 2, z: 0 };
  const p4 = { x: leftRamp.x + leftRamp.width / 2, y: leftRamp.y + leftRamp.depth / 2, z: 0 };

  const isoP1 = toIsometric(p1.x, p1.y, p1.z, origin);
  const isoP2 = toIsometric(p2.x, p2.y, p2.z, origin);
  const isoP3 = toIsometric(p3.x, p3.y, p3.z, origin);
  const isoP4 = toIsometric(p4.x, p4.y, p4.z, origin);

  drawFace(context, [isoP1, isoP2, isoP3, isoP4], '#999');

  ramps.forEach(ramp => {
    const w = ramp.width / 2;
    const d = ramp.depth / 2;
    const h = ramp.height;

    const vertices = [
      { x: ramp.x - w, y: ramp.y - d, z: ramp.z },
      { x: ramp.x + w, y: ramp.y - d, z: ramp.z },
      { x: ramp.x + w, y: ramp.y + d, z: ramp.z },
      { x: ramp.x - w, y: ramp.y + d, z: ramp.z },
      { x: ramp.x - w, y: ramp.y - d, z: ramp.z + h },
      { x: ramp.x + w, y: ramp.y - d, z: ramp.z + h },
      { x: ramp.x + w, y: ramp.y + d, z: ramp.z + h },
      { x: ramp.x - w, y: ramp.y + d, z: ramp.z + h },
    ];

    const isoVertices = vertices.map(v => toIsometric(v.x, v.y, v.z, origin));

    drawFace(context, [isoVertices[4], isoVertices[5], isoVertices[6], isoVertices[7]], '#8B9EAE');
    drawFace(context, [isoVertices[1], isoVertices[2], isoVertices[6], isoVertices[5]], '#6D7B8D');
    drawFace(context, [isoVertices[0], isoVertices[3], isoVertices[7], isoVertices[4]], '#53687E');
  });
};

const drawSkateCity = (
  context: CanvasRenderingContext2D,
  toIsometric: ToIsometric,
  origin: Point
) => {
  drawGrid(context, toIsometric, origin);

  skateCityMap.parkEntrances.forEach(entrance => {
    const w = entrance.width / 2;
    const d = entrance.depth / 2;

    const p1 = { x: entrance.x - w, y: entrance.y - d, z: 0 };
    const p2 = { x: entrance.x + w, y: entrance.y - d, z: 0 };
    const p3 = { x: entrance.x + w, y: entrance.y + d, z: 0 };
    const p4 = { x: entrance.x - w, y: entrance.y + d, z: 0 };

    const isoP1 = toIsometric(p1.x, p1.y, p1.z, origin);
    const isoP2 = toIsometric(p2.x, p2.y, p2.z, origin);
    const isoP3 = toIsometric(p3.x, p3.y, p3.z, origin);
    const isoP4 = toIsometric(p4.x, p4.y, p4.z, origin);

    drawFace(context, [isoP1, isoP2, isoP3, isoP4], '#4CAF50');
  });
};

const drawDownhillPark = (
  context: CanvasRenderingContext2D,
  toIsometric: ToIsometric,
  origin: Point
) => {
  downhillParkMap.segments.forEach(segment => {
    const w = segment.width / 2;
    const d = segment.depth / 2;

    const p1 = { x: segment.x - w, y: segment.y - d, z: segment.z };
    const p2 = { x: segment.x + w, y: segment.y - d, z: segment.z };
    const p3 = { x: segment.x + w, y: segment.y + d, z: segment.z };
    const p4 = { x: segment.x - w, y: segment.y + d, z: segment.z };

    const isoP1 = toIsometric(p1.x, p1.y, p1.z, origin);
    const isoP2 = toIsometric(p2.x, p2.y, p2.z, origin);
    const isoP3 = toIsometric(p3.x, p3.y, p3.z, origin);
    const isoP4 = toIsometric(p4.x, p4.y, p4.z, origin);

    drawFace(context, [isoP1, isoP2, isoP3, isoP4], '#8B4513');
  });
};

const drawJumpPark = (
  context: CanvasRenderingContext2D,
  toIsometric: ToIsometric,
  origin: Point
) => {
  drawGrid(context, toIsometric, origin);

  jumpParkRamps.forEach(ramp => {
    const w = ramp.width / 2;
    const d = ramp.depth / 2;
    const h = ramp.height;

    const vertices = [
      { x: ramp.x - w, y: ramp.y - d, z: ramp.z },
      { x: ramp.x + w, y: ramp.y - d, z: ramp.z },
      { x: ramp.x + w, y: ramp.y + d, z: ramp.z },
      { x: ramp.x - w, y: ramp.y + d, z: ramp.z },
      { x: ramp.x - w, y: ramp.y - d, z: ramp.z + h },
      { x: ramp.x + w, y: ramp.y - d, z: ramp.z + h },
      { x: ramp.x + w, y: ramp.y + d, z: ramp.z + h },
      { x: ramp.x - w, y: ramp.y + d, z: ramp.z + h },
    ];

    const isoVertices = vertices.map(v => toIsometric(v.x, v.y, v.z, origin));

    drawFace(context, [isoVertices[4], isoVertices[5], isoVertices[6], isoVertices[7]], '#A0A0A0'); // Top
    drawFace(context, [isoVertices[1], isoVertices[2], isoVertices[6], isoVertices[5]], '#808080'); // Side
    drawFace(context, [isoVertices[0], isoVertices[3], isoVertices[7], isoVertices[4]], '#606060'); // Front
  });
};


const drawSlalomPark = (
  context: CanvasRenderingContext2D,
  toIsometric: ToIsometric,
  origin: Point,
  currentGateIndex: number
) => {
  drawGrid(context, toIsometric, origin);

  slalomParkMap.gates.forEach((gate, index) => {
    const pole1X = gate.x - gate.width / 2;
    const pole2X = gate.x + gate.width / 2;

    const isoPole1 = toIsometric(pole1X, gate.y, 0, origin);
    const isoPole2 = toIsometric(pole2X, gate.y, 0, origin);

    context.fillStyle = index === currentGateIndex ? '#FFD700' : '#FF0000'; // Gold for next, Red for others

    context.beginPath();
    context.arc(isoPole1.x, isoPole1.y, 5, 0, 2 * Math.PI);
    context.fill();

    context.beginPath();
    context.arc(isoPole2.x, isoPole2.y, 5, 0, 2 * Math.PI);
    context.fill();
  });
};

export const drawMap = (
  context: CanvasRenderingContext2D,
  gameState: 'skate_city' | 'ramp_park' | 'downhill_park' | 'jump_park' | 'slalom_park',
  toIsometric: ToIsometric,
  origin: Point,
  currentGateIndex?: number
) => {
  switch (gameState) {
    case 'ramp_park':
      drawRampPark(context, toIsometric, origin);
      break;
    case 'skate_city':
      drawSkateCity(context, toIsometric, origin);
      break;
    case 'downhill_park':
      drawDownhillPark(context, toIsometric, origin);
      break;
    case 'jump_park':
      drawJumpPark(context, toIsometric, origin);
      break;
    case 'slalom_park':
      drawSlalomPark(context, toIsometric, origin, currentGateIndex ?? 0);
      break;
  }
};
